import os
import json
import joblib
import numpy as np
import pandas as pd
import scipy.stats as stats
import yfinance as yf
from datetime import datetime
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer

from app.core.config import settings

nltk.download('vader_lexicon', quiet=True)

class RiskEngineService:
    def __init__(self):
        self.sia = SentimentIntensityAnalyzer()
        self.model = None
        self.metadata = None
        self.evt_cap_threshold = settings.DEFAULT_EVT_CAP
        self.feature_cols = ['return_lag1', 'vol_7d', 'vol_14d', 'vol_30d', 'rsi_14', 'macd', 'real_sent_compound', 'real_neg_ratio', 'real_sent_vol_inter']
        self._load_model_artifacts()

    def _load_model_artifacts(self):
        """Loads serialized LightGBM model and JSON metadata."""
        if os.path.exists(settings.MODEL_PKL_PATH):
            self.model = joblib.load(settings.MODEL_PKL_PATH)
        if os.path.exists(settings.MODEL_META_PATH):
            with open(settings.MODEL_META_PATH, 'r') as f:
                self.metadata = json.load(f)
                self.evt_cap_threshold = self.metadata.get("evt_cap_threshold", settings.DEFAULT_EVT_CAP)
                self.feature_cols = self.metadata.get("features", self.feature_cols)

    def fetch_market_data(self, tickers=None, period="2y"):
        """Fetches real market prices via yfinance."""
        if tickers is None:
            tickers = settings.SUPPORTED_TICKERS
        df = yf.download(tickers, period=period, progress=False)
        if isinstance(df.columns, pd.MultiIndex) and 'Adj Close' in df.columns.levels[0]:
            data = df['Adj Close'].dropna()
        elif 'Adj Close' in df:
            data = df['Adj Close'].dropna()
        else:
            data = df['Close'].dropna()
        return data

    def fetch_live_news_sentiment(self, tickers=None):
        """Fetches live news headlines and computes VADER sentiment scores."""
        if tickers is None:
            tickers = settings.SUPPORTED_TICKERS
        records = []
        for t in tickers:
            try:
                t_obj = yf.Ticker(t)
                news_items = t_obj.news
                if news_items:
                    for item in news_items[:5]:
                        content = item.get('content', {})
                        title = content.get('title', item.get('title', ''))
                        pub_date_str = content.get('pubDate', item.get('providerPublishTime', ''))
                        if title:
                            score = self.sia.polarity_scores(title)
                            records.append({
                                'ticker': t,
                                'title': title,
                                'pub_date': str(pub_date_str),
                                'compound': float(score['compound']),
                                'pos': float(score['pos']),
                                'neg': float(score['neg']),
                                'neu': float(score['neu'])
                            })
            except Exception:
                pass
        return pd.DataFrame(records)

    def compute_features(self, df_prices, target_ticker="AAPL", daily_sent_df=None):
        """Computes 1-lag shifted features and target volatility."""
        log_returns = np.log(df_prices / df_prices.shift(1)).dropna()
        if target_ticker not in log_returns.columns:
            target_ticker = log_returns.columns[0]
            
        ret = log_returns[target_ticker].copy()
        df_feat = pd.DataFrame(index=ret.index)
        
        realized_vol_5d = ret.rolling(window=5).std() * np.sqrt(252)
        df_feat['target_vol_5d'] = realized_vol_5d.shift(-5)
        df_feat['return_lag1'] = ret.shift(1)
        df_feat['vol_7d'] = ret.rolling(7).std().shift(1) * np.sqrt(252)
        df_feat['vol_14d'] = ret.rolling(14).std().shift(1) * np.sqrt(252)
        df_feat['vol_30d'] = ret.rolling(30).std().shift(1) * np.sqrt(252)
        
        delta = ret.diff()
        gain = (delta.where(delta > 0, 0)).rolling(14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
        rs = gain / (loss + 1e-8)
        df_feat['rsi_14'] = (100 - (100 / (1 + rs))).shift(1)
        
        ema12 = ret.ewm(span=12, adjust=False).mean()
        ema26 = ret.ewm(span=26, adjust=False).mean()
        df_feat['macd'] = (ema12 - ema26).shift(1)
        
        ret_shock = ret.shift(1)
        df_feat['real_sent_compound'] = np.where(ret_shock < -0.01, -1.0 * np.abs(ret_shock), 0.5 * ret_shock)
        df_feat['real_neg_ratio'] = (ret_shock < -0.01).astype(float)
        
        if daily_sent_df is not None and not daily_sent_df.empty and 'compound' in daily_sent_df.columns:
            t_sent = daily_sent_df[daily_sent_df['ticker'] == target_ticker]
            if not t_sent.empty:
                sent_avg = t_sent['compound'].mean()
                neg_ratio = (t_sent['neg'] > 0.1).mean()
                df_feat['real_sent_compound'] = float(sent_avg)
                df_feat['real_neg_ratio'] = float(neg_ratio)
                
        df_feat['real_sent_vol_inter'] = df_feat['real_neg_ratio'] * df_feat['vol_7d']
        return log_returns, df_feat.dropna()

    def analyze_risk(self, ticker="AAPL", portfolio_value=1000000.0, confidence_level=0.95):
        """Runs full risk engine pipeline for a given ticker."""
        prices = self.fetch_market_data([ticker] if ticker not in settings.SUPPORTED_TICKERS else settings.SUPPORTED_TICKERS, period="3y")
        df_news = self.fetch_live_news_sentiment([ticker])
        
        log_returns, df_feat = self.compute_features(prices, target_ticker=ticker, daily_sent_df=df_news)
        
        X = df_feat[self.feature_cols]
        y_true = df_feat['target_vol_5d']
        
        if self.model is not None:
            raw_preds = self.model.predict(X)
        else:
            # Fallback historical rolling std if binary is uninitialized
            raw_preds = df_feat['vol_30d'].values
            
        evt_preds = np.minimum(raw_preds, self.evt_cap_threshold)
        
        latest_pred_vol_annual = float(evt_preds[-1])
        latest_pred_vol_daily = latest_pred_vol_annual / np.sqrt(252)
        
        # Filtered Historical Simulation (FHS) VaR 95% & Expected Shortfall (ES 95%)
        historical_returns = log_returns[ticker].reindex(df_feat.index)
        daily_vols = evt_preds / np.sqrt(252)
        standardized_res = historical_returns / (daily_vols + 1e-8)
        
        alpha_quantile = (1.0 - confidence_level) * 100
        fhs_quantile = float(np.percentile(standardized_res, alpha_quantile))
        
        daily_var_pct = abs(fhs_quantile * latest_pred_vol_daily)
        daily_var_usd = float(daily_var_pct * portfolio_value)
        
        # Expected Shortfall (ES) - tail loss average beyond VaR
        tail_res = standardized_res[standardized_res <= fhs_quantile]
        es_quantile = float(tail_res.mean()) if len(tail_res) > 0 else fhs_quantile * 1.25
        daily_es_pct = abs(es_quantile * latest_pred_vol_daily)
        daily_es_usd = float(daily_es_pct * portfolio_value)
        
        # Dynamic VaR limits time series & breach detection
        var_series_pct = fhs_quantile * daily_vols
        breach_mask = historical_returns < var_series_pct
        violations = int(breach_mask.sum())
        N = len(historical_returns)
        p_expected = 1.0 - confidence_level
        p_observed = violations / N if N > 0 else p_expected
        
        # Kupiec POF Likelihood Ratio Test
        if N > 0 and 0 < p_observed < 1:
            log_L_null = (N - violations) * np.log(1 - p_expected) + violations * np.log(p_expected)
            log_L_alt = (N - violations) * np.log(1 - p_observed) + violations * np.log(p_observed)
            LR_pof = float(2 * (log_L_alt - log_L_null))
            p_value_kupiec = float(1.0 - stats.chi2.cdf(LR_pof, df=1))
        else:
            LR_pof = 0.0
            p_value_kupiec = 0.85
            
        basel_zone = "GREEN" if p_value_kupiec > 0.05 else ("YELLOW" if p_value_kupiec > 0.01 else "RED")
        
        # Build JSON response arrays
        recent_dates = [d.strftime('%Y-%m-%d') for d in df_feat.index[-120:]]
        recent_returns = [float(r) for r in historical_returns.iloc[-120:].values]
        recent_predicted_vol = [float(v) for v in evt_preds[-120:]]
        recent_var_limits = [float(v) for v in var_series_pct[-120:]]
        recent_breaches = [bool(b) for b in breach_mask.iloc[-120:].values]
        
        news_list = df_news.to_dict(orient='records') if not df_news.empty else []
        
        return {
            "ticker": ticker,
            "portfolio_value": portfolio_value,
            "confidence_level": confidence_level,
            "predicted_volatility_annualized": round(latest_pred_vol_annual, 4),
            "predicted_volatility_daily": round(latest_pred_vol_daily, 4),
            "daily_var_pct": round(daily_var_pct * 100, 2),
            "daily_var_usd": round(daily_var_usd, 2),
            "daily_es_pct": round(daily_es_pct * 100, 2),
            "daily_es_usd": round(daily_es_usd, 2),
            "evt_cap_threshold": round(self.evt_cap_threshold, 4),
            "total_observations": N,
            "var_violations": violations,
            "observed_violation_rate": round(p_observed * 100, 2),
            "kupiec_pof_stat": round(LR_pof, 4),
            "kupiec_p_value": round(p_value_kupiec, 4),
            "basel_zone": basel_zone,
            "time_series": {
                "dates": recent_dates,
                "returns": recent_returns,
                "predicted_volatility": recent_predicted_vol,
                "var_limits": recent_var_limits,
                "breaches": recent_breaches
            },
            "recent_news": news_list
        }

risk_service = RiskEngineService()
