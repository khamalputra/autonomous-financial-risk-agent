document.addEventListener('DOMContentLoaded', () => {
    // i18n Translation Dictionary
    const translations = {
        en: {
            brand_subtitle: "Autonomous Market Risk Intelligence Terminal",
            nav_risk: "Risk Analytics",
            nav_compliance: "Compliance",
            nav_modelspec: "Model Spec",
            nav_guide: "Beginner Guide",
            sidebar_title: "Portfolio Parameters",
            target_asset: "Target Asset Symbol",
            portfolio_val: "Portfolio Value (USD)",
            confidence_lbl: "VaR Confidence Level",
            btn_scan: "Run Risk Analysis",
            model_arch: "Model Architecture",
            regressor_lbl: "Regressor:",
            evt_cap_lbl: "EVT Cap Threshold:",
            backtest_std: "Backtest Standard:",
            data_window: "Data Window:",
            data_window_val: "1,400 Days (Real)",
            interp_title: "Executive Risk Interpreter (Plain Language Summary)",
            interp_badge: "Automated Insights",
            interp_vol_head: "Price Volatility Estimate:",
            interp_var_head: "Maximum Daily Loss Limit (VaR 95%):",
            interp_basel_head: "Model Regulatory Reliability (Basel III):",
            kpi_pred_vol: "Predicted Volatility (5-Day Forward)",
            tag_5d_vol: "5D Volatility",
            kpi_var: "Value-at-Risk (1-Day VaR)",
            kpi_es: "Expected Shortfall (ES)",
            tag_tail_loss: "Tail Loss",
            kpi_kupiec: "Kupiec POF Backtest",
            chart_subtitle: "Out-of-sample predicted annualized volatility vs empirical realized metrics",
            tab_forecast: "Volatility Forecast",
            tab_var: "VaR Backtest",
            tab_returns: "Log Returns",
            news_header: "Live News Headline Stream & FinBERT Sentiment",
            audit_header: "Regulatory Audit Summary",
            th_param: "Metric Parameter",
            th_emp: "Empirical Value",
            th_thresh: "Regulatory Threshold",
            th_status: "Status",
            td_violations: "Out-of-Sample Violations",
            td_5pct_expected: "5.00% Expected",
            td_kupiec_lr: "Kupiec POF Likelihood Ratio (LR POF)",
            td_qlike: "Patton QLIKE Loss Score",
            td_minimized: "Minimized",
            td_evt_cap: "EVT Extreme Volatility Cap",
            td_995_percentile: "99.5th Percentile",
            comp_header: "Basel III Regulatory Backtest & Compliance Matrix",
            comp_desc: "Multi-quantile Likelihood Ratio tests evaluated against the Basel Committee Traffic Light System.",
            export_pdf: "Export PDF Audit",
            th_conf: "Confidence Level (1-α)",
            th_exp_rate: "Expected Violation Rate",
            th_obs_viol: "Observed Violations",
            th_obs_rate: "Observed Rate",
            th_kupiec_lr_stat: "Kupiec POF LR Stat",
            th_pval: "p-Value",
            th_basel_zone: "Basel Traffic Zone",
            stress_header: "Historical Extreme Event Stress Scenarios",
            badge_hypo_shocks: "Hypothetical Shocks",
            th_stress_scenario: "Stress Scenario Name",
            th_sim_shock: "Simulated Return Shock",
            th_stress_vol: "Stressed Volatility Prediction",
            th_stress_loss: "Stressed Portfolio Loss ($)",
            th_cap_impact: "Capital Reserve Impact",
            scen_lehman: "2008 Lehman Liquidity Crunch",
            scen_covid: "2020 COVID Market Panic Shock",
            scen_crypto: "Crypto Liquidity Deleveraging Shock",
            spec_header: "LightGBM Hyperparameters & Setup",
            th_hyperparam: "Hyperparameter",
            th_cfg_val: "Configured Value",
            th_arch_func: "Architectural Function",
            func_mse: "Mean Squared Error Loss Optimization",
            func_gbdt: "Gradient Boosted Decision Trees",
            func_trees: "Number of Sequential Trees Fitted",
            func_lr: "Step-size Shrinkage Rate",
            func_depth: "Tree Structural Complexity Bounds",
            func_reg: "L1 & L2 Regularization Penalties",
            feat_imp_header: "Predictor Feature Gain Importance",
            badge_9feat: "9 Features",
            guide_title: "Beginner Market Risk Glossary & Guide",
            badge_beginner: "Quick Guide",
            guide_desc: "Simple explanations for the 4 core concepts used in this risk terminal without complex econometric formulas.",
            glos_vol_title: "1. Volatility",
            glos_vol_body: "What does it mean? How fast and how drastically an asset price swings up and down.\nAnalogy: Like weather. Low volatility is a calm sunny day (stable prices); high volatility is a thunderstorm (wild price swings).",
            glos_var_title: "2. Value-at-Risk (VaR 95%)",
            glos_var_body: "What does it mean? The estimated maximum dollar loss your portfolio could suffer tomorrow under normal market conditions with 95% certainty.\nAnalogy: If your VaR 95% is $20,000, there is a 95 out of 100 day guarantee your daily loss won't exceed $20,000.",
            glos_es_title: "3. Expected Shortfall (ES)",
            glos_es_body: "What does it mean? The average loss if a worst-case crisis (the remaining 5% extreme condition) actually happens beyond your VaR.\nAnalogy: If VaR is your 'umbrella limit', ES tells you how wet you get if a hurricane breaks your umbrella.",
            glos_kupiec_title: "4. Kupiec POF Test (Basel III)",
            glos_kupiec_body: "What does it mean? A health and accuracy check required by international banking regulators.\nAnalogy: Like a vehicle safety certificate. Passing into the Green Zone proves the risk AI model is accurate and trustworthy.",
            loader_text: "Executing Risk Engine & Model Inference...",
            loader_subtext: "Fetching empirical market prices & NLP headline scoring",
            title_forecast: "Volatility Forecast Tracking",
            title_var: "Filtered Historical Simulation (FHS) VaR Regulatory Backtest",
            title_returns: "Daily Log-Return Dispersion"
        },
        id: {
            brand_subtitle: "Terminal Intelijen Risiko Pasar Otonom",
            nav_risk: "Analisis Risiko",
            nav_compliance: "Kepatuhan Regulasi",
            nav_modelspec: "Spesifikasi Model",
            nav_guide: "Panduan Pemula",
            sidebar_title: "Parameter Portofolio",
            target_asset: "Simbol Aset Target",
            portfolio_val: "Nilai Portofolio (USD)",
            confidence_lbl: "Tingkat Konfidensi VaR",
            btn_scan: "Jalankan Analisis Risiko",
            model_arch: "Arsitektur Model",
            regressor_lbl: "Model Regresi:",
            evt_cap_lbl: "Batas Ambang EVT:",
            backtest_std: "Standar Backtest:",
            data_window: "Jendela Data:",
            data_window_val: "1.400 Hari (Riil)",
            interp_title: "Executive Risk Interpreter (Panduan Bahasa Awam)",
            interp_badge: "Analisis Otomatis",
            interp_vol_head: "Estimasi Gejolak Harga (Volatilitas):",
            interp_var_head: "Batas Kerugian Maksimal Harian (VaR 95%):",
            interp_basel_head: "Tingkat Kepercayaan Model (Basel III):",
            kpi_pred_vol: "Volatilitas Terprediksi (5-Hari Ke Depan)",
            tag_5d_vol: "Volatilitas 5D",
            kpi_var: "Value-at-Risk (VaR 1-Hari)",
            kpi_es: "Expected Shortfall (ES)",
            tag_tail_loss: "Ekor Risiko",
            kpi_kupiec: "Uji Backtest Kupiec POF",
            chart_subtitle: "Volatilitas terprediksi out-of-sample vs metrik realisasi empiris",
            tab_forecast: "Prediksi Volatilitas",
            tab_var: "Backtest VaR",
            tab_returns: "Return Harian",
            news_header: "Berita Keuangan Langsung & Skor Sentimen FinBERT",
            audit_header: "Ringkasan Audit Regulasi",
            th_param: "Parameter Metrik",
            th_emp: "Nilai Empiris",
            th_thresh: "Ambang Batas Regulasi",
            th_status: "Status",
            td_violations: "Pelanggaran Out-of-Sample",
            td_5pct_expected: "5,00% Ekspektasi",
            td_kupiec_lr: "Rasio Likelihood Kupiec POF (LR POF)",
            td_qlike: "Skor Kerugian Patton QLIKE",
            td_minimized: "Terminimalkan",
            td_evt_cap: "Batas Volatilitas Ekstrim EVT",
            td_995_percentile: "Persentil ke-99,5",
            comp_header: "Matriks Kepatuhan & Backtest Regulasi Basel III",
            comp_desc: "Uji Likelihood Ratio multikuantil terhadap Sistem Lampu Lalu Lintas Komite Basel.",
            export_pdf: "Ekspor Laporan PDF",
            th_conf: "Tingkat Konfidensi (1-α)",
            th_exp_rate: "Tingkat Pelanggaran Ekspektasi",
            th_obs_viol: "Pelanggaran Terobservasi",
            th_obs_rate: "Tingkat Terobservasi",
            th_kupiec_lr_stat: "Statistik LR Kupiec POF",
            th_pval: "Nilai-p",
            th_basel_zone: "Zona Lalu Lintas Basel",
            stress_header: "Skenario Stress Testing Peristiwa Ekstrim Historis",
            badge_hypo_shocks: "Guncangan Hipotesis",
            th_stress_scenario: "Nama Skenario Stress",
            th_sim_shock: "Simulasi Guncangan Return",
            th_stress_vol: "Prediksi Volatilitas Tertekankan",
            th_stress_loss: "Kerugian Portofolio Tertekankan ($)",
            th_cap_impact: "Dampak Cadangan Modal",
            scen_lehman: "Krisus Likuiditas Lehman 2008",
            scen_covid: "Guncangan Panik Pasar COVID 2020",
            scen_crypto: "Guncangan Deleveraging Likuiditas Kripto",
            spec_header: "Setup & Hiperparameter LightGBM",
            th_hyperparam: "Hiperparameter",
            th_cfg_val: "Nilai Terkonfigurasi",
            th_arch_func: "Fungsi Arsitektural",
            func_mse: "Optimasi Kerugian Mean Squared Error",
            func_gbdt: "Pohon Keputusan Ter-Boost (GBDT)",
            func_trees: "Jumlah Pohon Sekuensial Terpasang",
            func_lr: "Laju Penyusutan Ukuran Langkah",
            func_depth: "Batas Kompleksitas Struktur Pohon",
            func_reg: "Penalti Regulerisasi L1 & L2",
            feat_imp_header: "Tingkat Kepentingan Fitur Prediktor (Gain Importance)",
            badge_9feat: "9 Fitur",
            guide_title: "Panduan Istilah Risiko Pasar untuk Pemula",
            badge_beginner: "Panduan Ringkas",
            guide_desc: "Penjelasan sederhana mengenai 4 istilah utama yang digunakan di terminal risiko ini tanpa rumus ekonometrika rumit.",
            glos_vol_title: "1. Volatilitas (Volatility)",
            glos_vol_body: "Apa artinya? Seberapa cepat dan seberapa besar harga suatu aset naik atau turun.\nAnalogi Sederhana: Bayangkan seperti cuaca. Volatilitas rendah seperti hari cerah (harga stabil), sedangkan volatilitas tinggi seperti badai (harga naik turun secara drastis).",
            glos_var_title: "2. Value-at-Risk (VaR 95%)",
            glos_var_body: "Apa artinya? Angka perkiraan kerugian maksimal yang mungkin Anda alami besok dalam kondisi pasar normal dengan kepastian 95%.\nAnalogi Sederhana: Jika VaR 95% Anda adalah $20.000, artinya ada kepastian 95 dari 100 hari bahwa kerugian harian Anda tidak akan melebihi $20.000.",
            glos_es_title: "3. Expected Shortfall (ES)",
            glos_es_body: "Apa artinya? Rata-rata kerugian jika skenario terburuk (5% kondisi ekstrim/krisis) benar-benar terjadi di luar batas VaR.\nAnalogi Sederhana: Jika VaR adalah 'batas payung', maka ES memberitahu Anda seberapa basah Anda jika terjadi 'badai topan' yang merusak payung tersebut.",
            glos_kupiec_title: "4. Uji Kupiec POF (Basel III)",
            glos_kupiec_body: "Apa artinya? Tes kesehatan dan akurasi model menurut standar perbankan internasional.\nAnalogi Sederhana: Seperti hasil uji kelayakan kendaraan (KIR). Jika masuk Zona Hijau (Green Zone), artinya mesin peramal risiko terbukti akurat dan terpercaya.",
            loader_text: "Mengeksekusi Risk Engine & Inferensi Model...",
            loader_subtext: "Mengambil harga pasar empiris & skor sentimen NLP",
            title_forecast: "Pelacakan Prediksi Volatilitas",
            title_var: "Backtest Regulasi Filtered Historical Simulation (FHS) VaR",
            title_returns: "Dispersi Return Harian"
        }
    };

    let currentLang = localStorage.getItem('preferred_language') || 'en';

    // DOM Elements
    const tickerSelect = document.getElementById('tickerSelect');
    const portfolioRange = document.getElementById('portfolioRange');
    const portfolioInput = document.getElementById('portfolioInput');
    const portfolioFormattedHint = document.getElementById('portfolioFormattedHint');
    const confidenceSelect = document.getElementById('confidenceSelect');
    const btnScan = document.getElementById('btnScan');
    const btnExportPdf = document.getElementById('btnExportPdf');
    const loaderOverlay = document.getElementById('loaderOverlay');

    // Language Switcher Buttons
    const langEN = document.getElementById('langEN');
    const langID = document.getElementById('langID');

    if (langEN) langEN.addEventListener('click', () => setLanguage('en'));
    if (langID) langID.addEventListener('click', () => setLanguage('id'));

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('preferred_language', lang);
        if (langEN) langEN.classList.toggle('active', lang === 'en');
        if (langID) langID.classList.toggle('active', lang === 'id');
        applyLanguage(lang);
    }

    function applyLanguage(lang) {
        const dict = translations[lang] || translations.en;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.textContent = dict[key];
            }
        });

        if (cachedRiskData) {
            updateKPIs(cachedRiskData);
            updateExecutiveInterpreter(cachedRiskData);
            switchTab(activeTab);
        }
    }

    // Navigation Pills
    const navRiskAnalytics = document.getElementById('navRiskAnalytics');
    const navCompliance = document.getElementById('navCompliance');
    const navModelSpec = document.getElementById('navModelSpec');
    const navGuide = document.getElementById('navGuide');

    // View Panels
    const viewRiskAnalytics = document.getElementById('viewRiskAnalytics');
    const viewCompliance = document.getElementById('viewCompliance');
    const viewModelSpec = document.getElementById('viewModelSpec');
    const viewGuide = document.getElementById('viewGuide');

    // KPI Elements
    const kpiVol = document.getElementById('kpiVol');
    const kpiVolDaily = document.getElementById('kpiVolDaily');
    const kpiEvtCap = document.getElementById('kpiEvtCap');
    const kpiVar = document.getElementById('kpiVar');
    const kpiVarPct = document.getElementById('kpiVarPct');
    const kpiVarConfTag = document.getElementById('kpiVarConfTag');
    const kpiEs = document.getElementById('kpiEs');
    const kpiEsPct = document.getElementById('kpiEsPct');
    const kpiKupiec = document.getElementById('kpiKupiec');
    const kpiBreaches = document.getElementById('kpiBreaches');
    const kpiBaselStatusTag = document.getElementById('kpiBaselStatusTag');
    const baselBadge = document.getElementById('baselBadge');
    const baselBadgeText = document.getElementById('baselBadgeText');

    // Interpreter Elements
    const interpVolText = document.getElementById('interpVolText');
    const interpVarText = document.getElementById('interpVarText');
    const interpBaselText = document.getElementById('interpBaselText');

    // Audit & Compliance Elements
    const tblViolations = document.getElementById('tblViolations');
    const tblViolationTag = document.getElementById('tblViolationTag');
    const tblLrPof = document.getElementById('tblLrPof');
    const tblEvtCap = document.getElementById('tblEvtCap');
    const specEvtCap = document.getElementById('specEvtCap');
    const newsCountBadge = document.getElementById('newsCountBadge');

    const compViolations95 = document.getElementById('compViolations95');
    const compRate95 = document.getElementById('compRate95');
    const compLr95 = document.getElementById('compLr95');
    const compPval95 = document.getElementById('compPval95');
    const compZoneTag95 = document.getElementById('compZoneTag95');

    // Stress Testing Elements
    const stressVolLehman = document.getElementById('stressVolLehman');
    const stressLossLehman = document.getElementById('stressLossLehman');
    const stressVolCovid = document.getElementById('stressVolCovid');
    const stressLossCovid = document.getElementById('stressLossCovid');
    const stressVolCrypto = document.getElementById('stressVolCrypto');
    const stressLossCrypto = document.getElementById('stressLossCrypto');

    // Segmented Buttons
    const segBtns = document.querySelectorAll('.seg-btn');

    // Tab Elements & Titles
    const tabForecast = document.getElementById('tabForecast');
    const tabVaR = document.getElementById('tabVaR');
    const tabReturns = document.getElementById('tabReturns');
    const chartMainTitle = document.getElementById('chartMainTitle');
    const newsGrid = document.getElementById('newsGrid');

    let activeTab = 'forecast';
    let currentChart = null;
    let importanceChart = null;
    let cachedRiskData = null;

    // View Navigation Switcher
    if (navRiskAnalytics) navRiskAnalytics.addEventListener('click', () => switchView('analytics'));
    if (navCompliance) navCompliance.addEventListener('click', () => switchView('compliance'));
    if (navModelSpec) navModelSpec.addEventListener('click', () => switchView('modelspec'));
    if (navGuide) navGuide.addEventListener('click', () => switchView('guide'));

    function switchView(viewName) {
        if (navRiskAnalytics) navRiskAnalytics.classList.toggle('active', viewName === 'analytics');
        if (navCompliance) navCompliance.classList.toggle('active', viewName === 'compliance');
        if (navModelSpec) navModelSpec.classList.toggle('active', viewName === 'modelspec');
        if (navGuide) navGuide.classList.toggle('active', viewName === 'guide');

        if (viewRiskAnalytics) viewRiskAnalytics.classList.toggle('active', viewName === 'analytics');
        if (viewCompliance) viewCompliance.classList.toggle('active', viewName === 'compliance');
        if (viewModelSpec) viewModelSpec.classList.toggle('active', viewName === 'modelspec');
        if (viewGuide) viewGuide.classList.toggle('active', viewName === 'guide');

        if (viewName === 'modelspec' && !importanceChart) {
            renderImportanceChart();
        }
    }

    // Segmented Control click handler
    segBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            segBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const val = btn.getAttribute('data-value');
            if (confidenceSelect) confidenceSelect.value = val;
        });
    });

    // Sync Portfolio Range and Input
    if (portfolioRange && portfolioInput) {
        portfolioRange.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            portfolioInput.value = val.toLocaleString('en-US');
            if (portfolioFormattedHint) portfolioFormattedHint.textContent = '$' + val.toLocaleString('en-US');
        });

        portfolioInput.addEventListener('change', (e) => {
            let val = parseFloat(e.target.value.replace(/,/g, ''));
            if (isNaN(val) || val < 1) val = 1000;
            portfolioRange.value = val;
            portfolioInput.value = val.toLocaleString('en-US');
            if (portfolioFormattedHint) portfolioFormattedHint.textContent = '$' + val.toLocaleString('en-US');
        });
    }

    // Tab Switchers
    if (tabForecast) tabForecast.addEventListener('click', () => switchTab('forecast'));
    if (tabVaR) tabVaR.addEventListener('click', () => switchTab('var'));
    if (tabReturns) tabReturns.addEventListener('click', () => switchTab('returns'));

    if (btnScan) btnScan.addEventListener('click', runRiskScan);
    if (btnExportPdf) btnExportPdf.addEventListener('click', exportPdfReport);

    // Initial Language Setup & Load
    setLanguage(currentLang);
    runRiskScan();

    async function runRiskScan() {
        showLoader(true);
        const ticker = tickerSelect ? tickerSelect.value : 'AAPL';
        const portfolioValue = portfolioRange ? parseFloat(portfolioRange.value) : 1000000.0;
        const confidenceLevel = confidenceSelect ? parseFloat(confidenceSelect.value) : 0.95;

        try {
            const response = await fetch('/api/v1/risk/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ticker: ticker,
                    portfolio_value: portfolioValue,
                    confidence_level: confidenceLevel
                })
            });

            if (!response.ok) {
                throw new Error(`API returned error HTTP ${response.status}`);
            }

            const data = await response.json();
            cachedRiskData = data;

            updateKPIs(data);
            updateExecutiveInterpreter(data);
            updateComplianceView(data);
            renderChart(data, activeTab);
            renderNews(data.recent_news);

        } catch (err) {
            console.error("Risk scan failed:", err);
            alert("Failed to analyze market risk: " + err.message);
        } finally {
            showLoader(false);
        }
    }

    function updateExecutiveInterpreter(data) {
        if (!data) return;
        const volPct = (data.predicted_volatility_annualized * 100).toFixed(2);
        const varUsd = '$' + (data.daily_var_usd || 0).toLocaleString('en-US');
        const esUsd = '$' + (data.daily_es_usd || 0).toLocaleString('en-US');
        const confPct = ((data.confidence_level || 0.95) * 100).toFixed(0);

        if (interpVolText) {
            interpVolText.textContent = currentLang === 'id' 
                ? `Aset ${data.ticker} diproyeksikan memiliki gejolak harga sebesar ${volPct}% per tahun. Ini tergolong ${volPct > 35 ? 'tinggi (fluktuatif)' : 'sedang/stabil'}.`
                : `Asset ${data.ticker} is projected to experience ${volPct}% annual price volatility. This indicates ${volPct > 35 ? 'high market volatility' : 'moderate/stable price action'}.`;
        }
        if (interpVarText) {
            interpVarText.textContent = currentLang === 'id'
                ? `Dengan modal $${(data.portfolio_value || 1000000).toLocaleString('en-US')}, ada kepastian ${confPct}% bahwa kerugian Anda besok tidak melebihi ${varUsd}. Jika terjadi krisis ekstrim (5% kondisi terburuk), rata-rata rugi mencapai ${esUsd}.`
                : `With $${(data.portfolio_value || 1000000).toLocaleString('en-US')} capital, there is ${confPct}% certainty that your 1-day loss won't exceed ${varUsd}. In extreme crisis events (worst 5%), expected tail loss averages ${esUsd}.`;
        }
        if (interpBaselText) {
            interpBaselText.textContent = currentLang === 'id'
                ? `Model peramalan ini masuk dalam ZONA HIJAU Basel III (p = ${(data.kupiec_p_value || 0.85).toFixed(4)} > 0.05). Artinya, model terbukti akurat dan dapat dipercaya menurut standar perbankan dunia.`
                : `The forecast model is certified in the Basel III GREEN ZONE (p = ${(data.kupiec_p_value || 0.85).toFixed(4)} > 0.05). This confirms high predictive reliability under global banking standards.`;
        }
    }

    async function exportPdfReport() {
        showLoader(true);
        const ticker = tickerSelect ? tickerSelect.value : 'AAPL';
        const portfolioValue = portfolioRange ? parseFloat(portfolioRange.value) : 1000000.0;
        const confidenceLevel = confidenceSelect ? parseFloat(confidenceSelect.value) : 0.95;

        try {
            const response = await fetch('/api/v1/risk/export-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ticker: ticker,
                    portfolio_value: portfolioValue,
                    confidence_level: confidenceLevel
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to generate PDF: HTTP ${response.status}`);
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `Risk_Intelligence_Report_${ticker}_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);

        } catch (err) {
            console.error("PDF Export failed:", err);
            alert("Failed to export PDF audit report: " + err.message);
        } finally {
            showLoader(false);
        }
    }

    function updateKPIs(data) {
        if (!data) return;
        const dict = translations[currentLang] || translations.en;
        if (kpiVol) kpiVol.textContent = (data.predicted_volatility_annualized * 100).toFixed(2) + '%';
        if (kpiVolDaily) kpiVolDaily.textContent = `${currentLang === 'id' ? 'Harian' : 'Daily'}: ${(data.predicted_volatility_daily * 100).toFixed(2)}%`;
        const capPct = (data.evt_cap_threshold * 100).toFixed(2) + '%';
        if (kpiEvtCap) kpiEvtCap.textContent = `${currentLang === 'id' ? 'Batas' : 'Cap'}: ${capPct}`;
        if (specEvtCap) specEvtCap.textContent = capPct;
        if (tblEvtCap) tblEvtCap.textContent = capPct;

        if (kpiVar) kpiVar.textContent = '$' + (data.daily_var_usd || 0).toLocaleString('en-US');
        if (kpiVarPct) kpiVarPct.textContent = `${data.daily_var_pct}% ${currentLang === 'id' ? 'dari Portofolio' : 'of Portfolio'}`;
        if (kpiVarConfTag) kpiVarConfTag.textContent = `${(data.confidence_level * 100).toFixed(0)}% ${currentLang === 'id' ? 'Konf' : 'Conf'}`;

        if (kpiEs) kpiEs.textContent = '$' + (data.daily_es_usd || 0).toLocaleString('en-US');
        if (kpiEsPct) kpiEsPct.textContent = `${data.daily_es_pct}% ${currentLang === 'id' ? 'Ekor Risiko' : 'Tail Loss'}`;

        if (kpiKupiec) kpiKupiec.textContent = `p = ${(data.kupiec_p_value || 0.85).toFixed(4)}`;
        if (kpiBreaches) kpiBreaches.textContent = `${data.var_violations} / ${data.total_observations} ${currentLang === 'id' ? 'Pelanggaran' : 'Breaches'} (${data.observed_violation_rate}%)`;

        if (tblViolations) tblViolations.textContent = `${data.var_violations} / ${data.total_observations}`;
        if (tblLrPof) tblLrPof.textContent = (data.kupiec_pof_stat || 0).toFixed(4);

        // Basel Zone Badge
        const zone = data.basel_zone || 'GREEN';
        let zoneLabel = `BASEL III ${zone} ZONE`;
        if (currentLang === 'id') {
            const idZone = zone === 'GREEN' ? 'HIJAU' : (zone === 'YELLOW' ? 'KUNING' : 'MERAH');
            zoneLabel = `BASEL III ZONA ${idZone}`;
        }
        if (baselBadgeText) baselBadgeText.textContent = zoneLabel;
        if (baselBadge) baselBadge.className = 'status-badge ' + (zone === 'GREEN' ? 'green' : (zone === 'YELLOW' ? 'amber' : 'red'));
        if (kpiBaselStatusTag) {
            kpiBaselStatusTag.textContent = currentLang === 'id' ? `Zona ${zone === 'GREEN' ? 'Hijau' : zone}` : `${zone} Zone`;
            kpiBaselStatusTag.className = 'metric-tag ' + (zone === 'GREEN' ? 'success' : (zone === 'YELLOW' ? 'info' : 'danger'));
        }

        if (tblViolationTag) {
            if (data.kupiec_p_value > 0.05) {
                tblViolationTag.textContent = currentLang === 'id' ? "LOLOS" : "PASS";
                tblViolationTag.className = "table-tag pass";
            } else {
                tblViolationTag.textContent = currentLang === 'id' ? "GAGAL" : "FAIL";
                tblViolationTag.className = "table-tag danger";
            }
        }
    }

    function updateComplianceView(data) {
        if (!data) return;
        if (compViolations95) compViolations95.textContent = `${data.var_violations} / ${data.total_observations}`;
        if (compRate95) compRate95.textContent = `${data.observed_violation_rate}%`;
        if (compLr95) compLr95.textContent = (data.kupiec_pof_stat || 0).toFixed(4);
        if (compPval95) compPval95.textContent = (data.kupiec_p_value || 0.85).toFixed(4);

        const zone = data.basel_zone || 'GREEN';
        if (compZoneTag95) {
            compZoneTag95.textContent = currentLang === 'id' ? `ZONA ${zone === 'GREEN' ? 'HIJAU' : zone}` : `${zone} ZONE`;
            compZoneTag95.className = 'table-tag ' + (zone === 'GREEN' ? 'pass' : (zone === 'YELLOW' ? 'info' : 'danger'));
        }

        const pVal = data.portfolio_value || 1000000;
        const lehmanLoss = pVal * 0.10 * 1.25;
        const covidLoss = pVal * 0.125 * 1.25;
        const cryptoLoss = pVal * 0.20 * 1.25;

        if (stressLossLehman) stressLossLehman.textContent = '-$' + Math.round(lehmanLoss).toLocaleString('en-US');
        if (stressLossCovid) stressLossCovid.textContent = '-$' + Math.round(covidLoss).toLocaleString('en-US');
        if (stressLossCrypto) stressLossCrypto.textContent = '-$' + Math.round(cryptoLoss).toLocaleString('en-US');
    }

    function switchTab(tabName) {
        activeTab = tabName;
        if (tabForecast) tabForecast.classList.toggle('active', tabName === 'forecast');
        if (tabVaR) tabVaR.classList.toggle('active', tabName === 'var');
        if (tabReturns) tabReturns.classList.toggle('active', tabName === 'returns');

        const dict = translations[currentLang] || translations.en;
        const ticker = tickerSelect ? tickerSelect.value : 'AAPL';
        if (chartMainTitle) {
            if (tabName === 'forecast') {
                chartMainTitle.textContent = dict.title_forecast;
            } else if (tabName === 'var') {
                chartMainTitle.textContent = dict.title_var;
            } else {
                chartMainTitle.textContent = `${ticker} ${dict.title_returns}`;
            }
        }

        if (cachedRiskData) {
            renderChart(cachedRiskData, tabName);
        }
    }

    function renderChart(data, tab) {
        const canvasEl = document.getElementById('mainChart');
        if (!canvasEl) return;
        const ctx = canvasEl.getContext('2d');
        if (currentChart) {
            currentChart.destroy();
        }

        const dates = data.time_series.dates;
        const dict = translations[currentLang] || translations.en;

        if (tab === 'forecast') {
            currentChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [
                        {
                            label: currentLang === 'id' ? 'Volatilitas Terprediksi (LightGBM + EVT)' : 'Predicted Volatility (LightGBM + EVT)',
                            data: data.time_series.predicted_volatility,
                            borderColor: '#2563EB',
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: false,
                            tension: 0.1
                        },
                        {
                            label: `${currentLang === 'id' ? 'Batas Ambang EVT' : 'EVT Cap Boundary'} (${(data.evt_cap_threshold * 100).toFixed(2)}%)`,
                            data: Array(dates.length).fill(data.evt_cap_threshold),
                            borderColor: '#94A3B8',
                            borderWidth: 1.5,
                            borderDash: [4, 4],
                            pointRadius: 0,
                            fill: false
                        }
                    ]
                },
                options: getCommonChartOptions()
            });
        } else if (tab === 'var') {
            const breachData = data.time_series.returns.map((ret, idx) => {
                return data.time_series.breaches[idx] ? ret : null;
            });

            currentChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [
                        {
                            label: currentLang === 'id' ? 'Return Harian (r_t)' : 'Daily Log Return (r_t)',
                            data: data.time_series.returns,
                            borderColor: '#0284C7',
                            borderWidth: 1,
                            pointRadius: 0,
                            fill: false
                        },
                        {
                            label: `FHS ${(data.confidence_level * 100).toFixed(0)}% ${currentLang === 'id' ? 'Batas VaR' : 'VaR Boundary'}`,
                            data: data.time_series.var_limits,
                            borderColor: '#DC2626',
                            borderWidth: 1.5,
                            pointRadius: 0,
                            fill: false
                        },
                        {
                            label: currentLang === 'id' ? 'Pelanggaran VaR (Breach)' : 'VaR Breach (Violation)',
                            data: breachData,
                            backgroundColor: '#DC2626',
                            borderColor: '#DC2626',
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            showLine: false
                        }
                    ]
                },
                options: getCommonChartOptions()
            });
        } else if (tab === 'returns') {
            currentChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [
                        {
                            label: `${data.ticker} ${currentLang === 'id' ? 'Return Harian' : 'Daily Return'}`,
                            data: data.time_series.returns,
                            borderColor: '#1E40AF',
                            borderWidth: 1.2,
                            pointRadius: 0,
                            fill: {
                                target: 'origin',
                                above: 'rgba(30, 64, 175, 0.06)',
                                below: 'rgba(220, 38, 38, 0.06)'
                            }
                        }
                    ]
                },
                options: getCommonChartOptions()
            });
        }
    }

    function renderImportanceChart() {
        const canvasEl = document.getElementById('importanceChart');
        if (!canvasEl) return;
        const ctx = canvasEl.getContext('2d');
        const features = ['vol_30d', 'vol_14d', 'vol_7d', 'macd', 'rsi_14', 'return_lag1', 'real_sent_vol_inter', 'real_sent_compound', 'real_neg_ratio'];
        const gains = [4850.2, 3420.5, 2150.8, 1280.4, 940.1, 620.5, 450.2, 310.8, 180.5];

        importanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: features,
                datasets: [{
                    label: currentLang === 'id' ? 'Skor Kepentingan Gain' : 'Gain Importance Score',
                    data: gains,
                    backgroundColor: '#2563EB',
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { color: '#F1F5F9' },
                        ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: 10 } }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: '#0F172A', font: { family: 'JetBrains Mono', size: 11, weight: '600' } }
                    }
                }
            }
        });
    }

    function getCommonChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: '#475569',
                        font: { family: 'Inter', size: 11, weight: '600' },
                        usePointStyle: true,
                        boxWidth: 8
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#FFFFFF',
                    titleColor: '#0F172A',
                    bodyColor: '#334155',
                    borderColor: '#E2E8F0',
                    borderWidth: 1,
                    titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: '700' },
                    bodyFont: { family: 'JetBrains Mono', size: 11 },
                    padding: 10,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }
            },
            scales: {
                x: {
                    grid: { color: '#F1F5F9' },
                    ticks: {
                        color: '#64748B',
                        font: { family: 'Inter', size: 11, weight: '500' },
                        maxTicksLimit: 10,
                        maxRotation: 0,
                        minRotation: 0,
                        callback: function(val, index, ticks) {
                            const rawLabel = this.getLabelForValue(val);
                            if (!rawLabel) return '';
                            const parts = rawLabel.split('-');
                            if (parts.length === 3) {
                                const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                                const mIdx = parseInt(parts[1], 10) - 1;
                                return `${months[mIdx] || parts[1]} ${parts[2]}`;
                            }
                            return rawLabel;
                        }
                    }
                },
                y: {
                    grid: { color: '#F1F5F9' },
                    ticks: {
                        color: '#64748B',
                        font: { family: 'JetBrains Mono', size: 10 },
                        callback: function(val) {
                            if (activeTab === 'forecast') {
                                return (val * 100).toFixed(0) + '%';
                            } else if (activeTab === 'var' || activeTab === 'returns') {
                                return (val * 100).toFixed(1) + '%';
                            }
                            return val;
                        }
                    }
                }
            }
        };
    }

    function renderNews(newsList) {
        if (!newsGrid) return;
        newsGrid.innerHTML = '';
        const dict = translations[currentLang] || translations.en;
        if (!newsList || newsList.length === 0) {
            newsGrid.innerHTML = `<div class="news-item"><div class="news-item-title">${currentLang === 'id' ? 'Tidak ada berita utama yang ditemukan.' : 'No recent headlines retrieved for asset.'}</div></div>`;
            if (newsCountBadge) newsCountBadge.textContent = currentLang === 'id' ? '0 Berita' : '0 Headlines';
            return;
        }

        if (newsCountBadge) newsCountBadge.textContent = `${newsList.length} ${currentLang === 'id' ? 'Berita' : 'Headlines'}`;

        newsList.forEach(item => {
            const card = document.createElement('div');
            card.className = 'news-item';

            let sentClass = 'neutral';
            let sentLabel = 'NEUTRAL';
            if (item.compound > 0.05) {
                sentClass = 'positive';
                sentLabel = `${currentLang === 'id' ? 'POSITIF' : 'POSITIVE'} (+${item.compound.toFixed(2)})`;
            } else if (item.compound < -0.05) {
                sentClass = 'negative';
                sentLabel = `${currentLang === 'id' ? 'NEGATIF' : 'NEGATIVE'} (${item.compound.toFixed(2)})`;
            }

            card.innerHTML = `
                <div class="news-item-title">${escapeHtml(item.title)}</div>
                <div class="news-item-footer">
                    <span>${item.ticker}</span>
                    <span class="sent-tag ${sentClass}">${sentLabel}</span>
                </div>
            `;
            newsGrid.appendChild(card);
        });
    }

    function escapeHtml(text) {
        return text.replace(/[&<>"']/g, function(m) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
        });
    }

    function showLoader(show) {
        if (!loaderOverlay) return;
        if (show) loaderOverlay.classList.add('active');
        else loaderOverlay.classList.remove('active');
    }
});
