document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const tickerSelect = document.getElementById('tickerSelect');
    const portfolioRange = document.getElementById('portfolioRange');
    const portfolioInput = document.getElementById('portfolioInput');
    const confidenceSelect = document.getElementById('confidenceSelect');
    const btnScan = document.getElementById('btnScan');
    const loaderOverlay = document.getElementById('loaderOverlay');

    // KPI Elements
    const kpiVol = document.getElementById('kpiVol');
    const kpiVolDaily = document.getElementById('kpiVolDaily');
    const kpiVar = document.getElementById('kpiVar');
    const kpiVarPct = document.getElementById('kpiVarPct');
    const kpiEs = document.getElementById('kpiEs');
    const kpiEsPct = document.getElementById('kpiEsPct');
    const kpiKupiec = document.getElementById('kpiKupiec');
    const kpiBreaches = document.getElementById('kpiBreaches');
    const baselBadge = document.getElementById('baselBadge');

    // Tab Elements
    const tabForecast = document.getElementById('tabForecast');
    const tabVaR = document.getElementById('tabVaR');
    const tabReturns = document.getElementById('tabReturns');
    const newsGrid = document.getElementById('newsGrid');

    let activeTab = 'forecast';
    let currentChart = null;
    let cachedRiskData = null;

    // Sync Portfolio Range and Input
    portfolioRange.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        portfolioInput.value = val.toLocaleString('en-US');
    });

    portfolioInput.addEventListener('change', (e) => {
        let val = parseFloat(e.target.value.replace(/,/g, ''));
        if (isNaN(val) || val < 100) val = 1000000;
        portfolioRange.value = val;
        portfolioInput.value = val.toLocaleString('en-US');
    });

    // Tab Switchers
    tabForecast.addEventListener('click', () => switchTab('forecast'));
    tabVaR.addEventListener('click', () => switchTab('var'));
    tabReturns.addEventListener('click', () => switchTab('returns'));

    btnScan.addEventListener('click', runRiskScan);

    // Initial Load
    runRiskScan();

    async function runRiskScan() {
        showLoader(true);
        const ticker = tickerSelect.value;
        const portfolioValue = parseFloat(portfolioRange.value);
        const confidenceLevel = parseFloat(confidenceSelect.value);

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
            renderChart(data, activeTab);
            renderNews(data.recent_news);

        } catch (err) {
            console.error("Risk scan failed:", err);
            alert("Failed to analyze market risk: " + err.message);
        } finally {
            showLoader(false);
        }
    }

    function updateKPIs(data) {
        kpiVol.textContent = (data.predicted_volatility_annualized * 100).toFixed(2) + '%';
        kpiVolDaily.textContent = `Daily Vol: ${(data.predicted_volatility_daily * 100).toFixed(2)}% | EVT Cap: ${(data.evt_cap_threshold * 100).toFixed(2)}%`;

        kpiVar.textContent = '$' + data.daily_var_usd.toLocaleString('en-US');
        kpiVarPct.textContent = `${data.daily_var_pct}% of Portfolio (${(data.confidence_level * 100).toFixed(0)}% Conf)`;

        kpiEs.textContent = '$' + data.daily_es_usd.toLocaleString('en-US');
        kpiEsPct.textContent = `${data.daily_es_pct}% Expected Tail Loss`;

        kpiKupiec.textContent = `p = ${data.kupiec_p_value.toFixed(4)}`;
        kpiBreaches.textContent = `${data.var_violations} Breaches (${data.observed_violation_rate}% vs ${(100 - data.confidence_level * 100).toFixed(1)}% Exp)`;

        // Basel Zone Badge
        baselBadge.textContent = `BASEL III ${data.basel_zone} ZONE`;
        baselBadge.className = 'status-badge';
        if (data.basel_zone === 'GREEN') {
            baselBadge.style.background = 'rgba(5, 150, 105, 0.08)';
            baselBadge.style.borderColor = 'rgba(5, 150, 105, 0.25)';
            baselBadge.style.color = '#059669';
        } else if (data.basel_zone === 'YELLOW') {
            baselBadge.style.background = 'rgba(217, 119, 6, 0.08)';
            baselBadge.style.borderColor = 'rgba(217, 119, 6, 0.25)';
            baselBadge.style.color = '#D97706';
        } else {
            baselBadge.style.background = 'rgba(225, 29, 72, 0.08)';
            baselBadge.style.borderColor = 'rgba(225, 29, 72, 0.25)';
            baselBadge.style.color = '#E11D48';
        }
    }

    function switchTab(tabName) {
        activeTab = tabName;
        tabForecast.classList.toggle('active', tabName === 'forecast');
        tabVaR.classList.toggle('active', tabName === 'var');
        tabReturns.classList.toggle('active', tabName === 'returns');

        if (cachedRiskData) {
            renderChart(cachedRiskData, tabName);
        }
    }

    function renderChart(data, tab) {
        const ctx = document.getElementById('mainChart').getContext('2d');
        if (currentChart) {
            currentChart.destroy();
        }

        const dates = data.time_series.dates;

        if (tab === 'forecast') {
            currentChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [
                        {
                            label: 'LightGBM + EVT Cap Predicted Volatility',
                            data: data.time_series.predicted_volatility,
                            borderColor: '#E11D48',
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: false,
                            tension: 0.1
                        },
                        {
                            label: `EVT Cap Threshold (${(data.evt_cap_threshold * 100).toFixed(2)}%)`,
                            data: Array(dates.length).fill(data.evt_cap_threshold),
                            borderColor: '#64748B',
                            borderWidth: 1.5,
                            borderDash: [5, 5],
                            pointRadius: 0,
                            fill: false
                        }
                    ]
                },
                options: getCommonChartOptions('Out-of-Sample Volatility Forecasting Tracking (Annualized)')
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
                            label: 'Daily Log Returns ($r_t$)',
                            data: data.time_series.returns,
                            borderColor: '#0284C7',
                            borderWidth: 1,
                            pointRadius: 0,
                            fill: false
                        },
                        {
                            label: `FHS ${(data.confidence_level * 100).toFixed(0)}% VaR Limit`,
                            data: data.time_series.var_limits,
                            borderColor: '#E11D48',
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: false
                        },
                        {
                            label: 'VaR Breaches (Violations)',
                            data: breachData,
                            backgroundColor: '#E11D48',
                            borderColor: '#E11D48',
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            showLine: false
                        }
                    ]
                },
                options: getCommonChartOptions(`Filtered Historical Simulation (FHS) ${(data.confidence_level * 100).toFixed(0)}% VaR Regulatory Backtest`)
            });
        } else if (tab === 'returns') {
            currentChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [
                        {
                            label: `${data.ticker} Daily Return Time-Series`,
                            data: data.time_series.returns,
                            borderColor: '#2563EB',
                            borderWidth: 1.5,
                            pointRadius: 0,
                            fill: {
                                target: 'origin',
                                above: 'rgba(37, 99, 235, 0.08)',
                                below: 'rgba(225, 29, 72, 0.08)'
                            }
                        }
                    ]
                },
                options: getCommonChartOptions(`${data.ticker} Historical Log-Return Dispersion`)
            });
        }
    }

    function getCommonChartOptions(titleText) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: titleText,
                    color: '#0F172A',
                    font: { family: 'Outfit', size: 16, weight: '700' }
                },
                legend: {
                    labels: { color: '#475569', font: { family: 'Inter', size: 12, weight: '600' } }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#FFFFFF',
                    titleColor: '#2563EB',
                    bodyColor: '#0F172A',
                    borderColor: '#E2E8F0',
                    borderWidth: 1,
                    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.1)'
                }
            },
            scales: {
                x: {
                    grid: { color: '#F1F5F9' },
                    ticks: { color: '#64748B', font: { size: 11 } }
                },
                y: {
                    grid: { color: '#F1F5F9' },
                    ticks: { color: '#64748B', font: { size: 11 } }
                }
            }
        };
    }

    function renderNews(newsList) {
        newsGrid.innerHTML = '';
        if (!newsList || newsList.length === 0) {
            newsGrid.innerHTML = '<div class="news-card"><div class="news-title">No recent news headlines retrieved for this asset.</div></div>';
            return;
        }

        newsList.forEach(item => {
            const card = document.createElement('div');
            card.className = 'news-card';

            let sentClass = 'neutral';
            let sentLabel = 'NEUTRAL';
            if (item.compound > 0.05) {
                sentClass = 'positive';
                sentLabel = `POSITIVE (+${item.compound.toFixed(2)})`;
            } else if (item.compound < -0.05) {
                sentClass = 'negative';
                sentLabel = `NEGATIVE (${item.compound.toFixed(2)})`;
            }

            card.innerHTML = `
                <div class="news-title">${escapeHtml(item.title)}</div>
                <div class="news-footer">
                    <span style="color: var(--text-muted); font-weight: 600;">${item.ticker}</span>
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
        if (show) loaderOverlay.classList.add('active');
        else loaderOverlay.classList.remove('active');
    }
});
