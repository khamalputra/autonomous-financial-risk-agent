document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const tickerSelect = document.getElementById('tickerSelect');
    const portfolioRange = document.getElementById('portfolioRange');
    const portfolioInput = document.getElementById('portfolioInput');
    const portfolioFormattedHint = document.getElementById('portfolioFormattedHint');
    const confidenceSelect = document.getElementById('confidenceSelect');
    const btnScan = document.getElementById('btnScan');
    const loaderOverlay = document.getElementById('loaderOverlay');

    // Navigation Pills
    const navRiskAnalytics = document.getElementById('navRiskAnalytics');
    const navCompliance = document.getElementById('navCompliance');
    const navModelSpec = document.getElementById('navModelSpec');

    // View Panels
    const viewRiskAnalytics = document.getElementById('viewRiskAnalytics');
    const viewCompliance = document.getElementById('viewCompliance');
    const viewModelSpec = document.getElementById('viewModelSpec');

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
    navRiskAnalytics.addEventListener('click', () => switchView('analytics'));
    navCompliance.addEventListener('click', () => switchView('compliance'));
    navModelSpec.addEventListener('click', () => switchView('modelspec'));

    function switchView(viewName) {
        navRiskAnalytics.classList.toggle('active', viewName === 'analytics');
        navCompliance.classList.toggle('active', viewName === 'compliance');
        navModelSpec.classList.toggle('active', viewName === 'modelspec');

        viewRiskAnalytics.classList.toggle('active', viewName === 'analytics');
        viewCompliance.classList.toggle('active', viewName === 'compliance');
        viewModelSpec.classList.toggle('active', viewName === 'modelspec');

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
            confidenceSelect.value = val;
            runRiskScan();
        });
    });

    // Sync Portfolio Range and Input
    portfolioRange.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        portfolioInput.value = val.toLocaleString('en-US');
        portfolioFormattedHint.textContent = '$' + val.toLocaleString('en-US');
    });

    portfolioInput.addEventListener('change', (e) => {
        let val = parseFloat(e.target.value.replace(/,/g, ''));
        if (isNaN(val) || val < 100) val = 1000000;
        portfolioRange.value = val;
        portfolioInput.value = val.toLocaleString('en-US');
        portfolioFormattedHint.textContent = '$' + val.toLocaleString('en-US');
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

    function updateKPIs(data) {
        kpiVol.textContent = (data.predicted_volatility_annualized * 100).toFixed(2) + '%';
        kpiVolDaily.textContent = `Daily: ${(data.predicted_volatility_daily * 100).toFixed(2)}%`;
        const capPct = (data.evt_cap_threshold * 100).toFixed(2) + '%';
        kpiEvtCap.textContent = `Cap: ${capPct}`;
        specEvtCap.textContent = capPct;
        tblEvtCap.textContent = capPct;

        kpiVar.textContent = '$' + data.daily_var_usd.toLocaleString('en-US');
        kpiVarPct.textContent = `${data.daily_var_pct}% of Portfolio`;
        kpiVarConfTag.textContent = `${(data.confidence_level * 100).toFixed(0)}% Conf`;

        kpiEs.textContent = '$' + data.daily_es_usd.toLocaleString('en-US');
        kpiEsPct.textContent = `${data.daily_es_pct}% Tail Loss`;

        kpiKupiec.textContent = `p = ${data.kupiec_p_value.toFixed(4)}`;
        kpiBreaches.textContent = `${data.var_violations} / ${data.total_observations} Breaches (${data.observed_violation_rate}%)`;

        tblViolations.textContent = `${data.var_violations} / ${data.total_observations}`;
        tblLrPof.textContent = data.kupiec_pof_stat.toFixed(4);

        // Basel Zone Badge
        const zone = data.basel_zone;
        baselBadgeText.textContent = `BASEL III ${zone} ZONE`;
        baselBadge.className = 'status-badge ' + (zone === 'GREEN' ? 'green' : (zone === 'YELLOW' ? 'amber' : 'red'));
        kpiBaselStatusTag.textContent = `${zone} Zone`;
        kpiBaselStatusTag.className = 'metric-tag ' + (zone === 'GREEN' ? 'success' : (zone === 'YELLOW' ? 'info' : 'danger'));

        if (data.kupiec_p_value > 0.05) {
            tblViolationTag.textContent = "PASS";
            tblViolationTag.className = "table-tag pass";
        } else {
            tblViolationTag.textContent = "FAIL";
            tblViolationTag.className = "table-tag danger";
        }
    }

    function updateComplianceView(data) {
        compViolations95.textContent = `${data.var_violations} / ${data.total_observations}`;
        compRate95.textContent = `${data.observed_violation_rate}%`;
        compLr95.textContent = data.kupiec_pof_stat.toFixed(4);
        compPval95.textContent = data.kupiec_p_value.toFixed(4);

        const zone = data.basel_zone;
        compZoneTag95.textContent = `${zone} ZONE`;
        compZoneTag95.className = 'table-tag ' + (zone === 'GREEN' ? 'pass' : (zone === 'YELLOW' ? 'info' : 'danger'));

        const pVal = data.portfolio_value;
        const lehmanLoss = pVal * 0.10 * 1.25;
        const covidLoss = pVal * 0.125 * 1.25;
        const cryptoLoss = pVal * 0.20 * 1.25;

        stressLossLehman.textContent = '-$' + Math.round(lehmanLoss).toLocaleString('en-US');
        stressLossCovid.textContent = '-$' + Math.round(covidLoss).toLocaleString('en-US');
        stressLossCrypto.textContent = '-$' + Math.round(cryptoLoss).toLocaleString('en-US');
    }

    function switchTab(tabName) {
        activeTab = tabName;
        tabForecast.classList.toggle('active', tabName === 'forecast');
        tabVaR.classList.toggle('active', tabName === 'var');
        tabReturns.classList.toggle('active', tabName === 'returns');

        if (tabName === 'forecast') {
            chartMainTitle.textContent = "Volatility Forecast Tracking";
        } else if (tabName === 'var') {
            chartMainTitle.textContent = "Filtered Historical Simulation (FHS) VaR Regulatory Backtest";
        } else {
            chartMainTitle.textContent = `${tickerSelect.value} Daily Log-Return Dispersion`;
        }

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
                            label: 'Predicted Volatility (LightGBM + EVT)',
                            data: data.time_series.predicted_volatility,
                            borderColor: '#2563EB',
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: false,
                            tension: 0.1
                        },
                        {
                            label: `EVT Cap Boundary (${(data.evt_cap_threshold * 100).toFixed(2)}%)`,
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
                            label: 'Daily Log Return (r_t)',
                            data: data.time_series.returns,
                            borderColor: '#0284C7',
                            borderWidth: 1,
                            pointRadius: 0,
                            fill: false
                        },
                        {
                            label: `FHS ${(data.confidence_level * 100).toFixed(0)}% VaR Boundary`,
                            data: data.time_series.var_limits,
                            borderColor: '#DC2626',
                            borderWidth: 1.5,
                            pointRadius: 0,
                            fill: false
                        },
                        {
                            label: 'VaR Breach (Violation)',
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
                            label: `${data.ticker} Daily Return`,
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
        const ctx = document.getElementById('importanceChart').getContext('2d');
        const features = ['vol_30d', 'vol_14d', 'vol_7d', 'macd', 'rsi_14', 'return_lag1', 'real_sent_vol_inter', 'real_sent_compound', 'real_neg_ratio'];
        const gains = [4850.2, 3420.5, 2150.8, 1280.4, 940.1, 620.5, 450.2, 310.8, 180.5];

        importanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: features,
                datasets: [{
                    label: 'Gain Importance Score',
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
                    ticks: { color: '#64748B', font: { family: 'Inter', size: 10 } }
                },
                y: {
                    grid: { color: '#F1F5F9' },
                    ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: 10 } }
                }
            }
        };
    }

    function renderNews(newsList) {
        newsGrid.innerHTML = '';
        if (!newsList || newsList.length === 0) {
            newsGrid.innerHTML = '<div class="news-item"><div class="news-item-title">No recent headlines retrieved for asset.</div></div>';
            newsCountBadge.textContent = '0 Headlines';
            return;
        }

        newsCountBadge.textContent = `${newsList.length} Headlines`;

        newsList.forEach(item => {
            const card = document.createElement('div');
            card.className = 'news-item';

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
        if (show) loaderOverlay.classList.add('active');
        else loaderOverlay.classList.remove('active');
    }
});
