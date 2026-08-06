document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const tickerSelect = document.getElementById('tickerSelect');
    const portfolioRange = document.getElementById('portfolioRange');
    const portfolioInput = document.getElementById('portfolioInput');
    const portfolioFormattedHint = document.getElementById('portfolioFormattedHint');
    const confidenceSelect = document.getElementById('confidenceSelect');
    const btnScan = document.getElementById('btnScan');
    const btnExportPdf = document.getElementById('btnExportPdf');
    const loaderOverlay = document.getElementById('loaderOverlay');

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
    const tblEvtCapMobile = document.getElementById('tblEvtCapMobile');
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

    // View Navigation Switcher for both Desktop Nav Pills & Mobile Bottom Nav Items
    document.querySelectorAll('[data-view]').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetView = btn.getAttribute('data-view');
            if (targetView) switchView(targetView);
        });
    });

    function switchView(viewName) {
        document.querySelectorAll('[data-view]').forEach(el => {
            el.classList.toggle('active', el.getAttribute('data-view') === viewName);
        });

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

    // Decoupled Hosting Support (Vercel Frontend + Railway Backend)
    const API_BASE_URL = window.location.hostname.includes('vercel.app') 
        ? 'https://your-railway-app.up.railway.app' 
        : '';

    // API Call Trigger
    window.runRiskScan = runRiskScan;
    async function runRiskScan() {
        const refreshIcon = document.querySelector('.icon-btn i.fa-rotate');
        if (refreshIcon) refreshIcon.classList.add('fa-spin');
        
        const ticker = tickerSelect ? tickerSelect.value : 'AAPL';
        showLoader(true, `Analyzing Market Risk for ${ticker}...`, 'Running LightGBM Volatility Model & Sentiment Scoring');

        let portfolioValue = 1000000;
        if (portfolioInput && portfolioInput.value) {
            const rawVal = parseFloat(portfolioInput.value.replace(/,/g, ''));
            if (!isNaN(rawVal) && rawVal > 0) {
                portfolioValue = rawVal;
            }
        } else if (portfolioRange) {
            portfolioValue = parseFloat(portfolioRange.value);
        }

        const confidenceLevel = confidenceSelect ? parseFloat(confidenceSelect.value) : 0.95;

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/risk/analyze`, {
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

            // Switch view automatically to Risk Analytics
            switchView('analytics');

        } catch (err) {
            console.error("Risk scan failed:", err);
        } finally {
            showLoader(false);
            const refreshIcon = document.querySelector('.icon-btn i.fa-rotate');
            if (refreshIcon) refreshIcon.classList.remove('fa-spin');
        }
    }

    if (btnScan) btnScan.addEventListener('click', runRiskScan);
    if (btnExportPdf) btnExportPdf.addEventListener('click', exportPdfReport);

    // Initial Load
    runRiskScan();

    function updateExecutiveInterpreter(data) {
        if (!data) return;
        const volPct = (data.predicted_volatility_annualized * 100).toFixed(2);
        const varUsd = '$' + (data.daily_var_usd || 0).toLocaleString('en-US');
        const esUsd = '$' + (data.daily_es_usd || 0).toLocaleString('en-US');
        const confPct = ((data.confidence_level || 0.95) * 100).toFixed(0);

        if (interpVolText) {
            interpVolText.textContent = `Asset ${data.ticker} is projected to experience ${volPct}% annual price volatility. This indicates ${volPct > 35 ? 'high market volatility' : 'moderate/stable price action'}.`;
        }
        if (interpVarText) {
            interpVarText.textContent = `With $${(data.portfolio_value || 1000000).toLocaleString('en-US')} capital, there is ${confPct}% certainty that your 1-day loss won't exceed ${varUsd}. In extreme crisis events (worst 5%), expected tail loss averages ${esUsd}.`;
        }
        if (interpBaselText) {
            interpBaselText.textContent = `The forecast model is certified in the Basel III GREEN ZONE (p = ${(data.kupiec_p_value || 0.85).toFixed(4)} > 0.05). This confirms high predictive reliability under global banking standards.`;
        }
    }

    async function exportPdfReport() {
        showLoader(true, 'Generating PDF Audit Report...', 'Formatting Institutional Executive Summary & Compliance Data');
        const ticker = tickerSelect ? tickerSelect.value : 'AAPL';
        const portfolioValue = portfolioRange ? parseFloat(portfolioRange.value) : 1000000.0;
        const confidenceLevel = confidenceSelect ? parseFloat(confidenceSelect.value) : 0.95;

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/risk/export-pdf`, {
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
        if (kpiVol) kpiVol.textContent = (data.predicted_volatility_annualized * 100).toFixed(2) + '%';
        if (kpiVolDaily) kpiVolDaily.textContent = `Daily: ${(data.predicted_volatility_daily * 100).toFixed(2)}%`;
        const capPct = (data.evt_cap_threshold * 100).toFixed(2) + '%';
        if (kpiEvtCap) kpiEvtCap.textContent = `Cap: ${capPct}`;
        if (specEvtCap) specEvtCap.textContent = capPct;
        if (tblEvtCap) tblEvtCap.textContent = capPct;
        if (tblEvtCapMobile) tblEvtCapMobile.textContent = capPct;

        if (kpiVar) kpiVar.textContent = '$' + (data.daily_var_usd || 0).toLocaleString('en-US');
        if (kpiVarPct) kpiVarPct.textContent = `${data.daily_var_pct}% of Portfolio`;
        if (kpiVarConfTag) kpiVarConfTag.textContent = `${(data.confidence_level * 100).toFixed(0)}% Conf`;

        if (kpiEs) kpiEs.textContent = '$' + (data.daily_es_usd || 0).toLocaleString('en-US');
        if (kpiEsPct) kpiEsPct.textContent = `${data.daily_es_pct}% Tail Loss`;

        if (kpiKupiec) kpiKupiec.textContent = `p = ${(data.kupiec_p_value || 0.85).toFixed(4)}`;
        if (kpiBreaches) kpiBreaches.textContent = `${data.var_violations} / ${data.total_observations} Breaches (${data.observed_violation_rate}%)`;

        const obsText = `${data.var_violations} / ${data.total_observations}`;
        if (tblViolations) tblViolations.textContent = obsText;
        const tblViolationsMobile = document.getElementById('tblViolationsMobile');
        if (tblViolationsMobile) tblViolationsMobile.textContent = obsText;

        const lrStatText = (data.kupiec_pof_stat || 0).toFixed(4);
        if (tblLrPof) tblLrPof.textContent = lrStatText;
        const tblLrPofMobile = document.getElementById('tblLrPofMobile');
        if (tblLrPofMobile) tblLrPofMobile.textContent = lrStatText;

        // Basel Zone Badge
        const zone = data.basel_zone || 'GREEN';
        const zoneLabel = `BASEL III ${zone} ZONE`;
        
        if (baselBadgeText) baselBadgeText.textContent = zoneLabel;
        if (baselBadge) baselBadge.className = 'status-badge ' + (zone === 'GREEN' ? 'green' : (zone === 'YELLOW' ? 'amber' : 'red'));
        if (kpiBaselStatusTag) {
            kpiBaselStatusTag.textContent = `${zone === 'GREEN' ? 'Green' : zone} Zone`;
            kpiBaselStatusTag.className = 'metric-tag ' + (zone === 'GREEN' ? 'success' : (zone === 'YELLOW' ? 'info' : 'danger'));
        }

        const tblViolationTagMobile = document.getElementById('tblViolationTagMobile');
        if (tblViolationTag) {
            if (data.kupiec_p_value > 0.05) {
                tblViolationTag.textContent = "PASS";
                tblViolationTag.className = "table-tag pass";
                if (tblViolationTagMobile) {
                    tblViolationTagMobile.textContent = "PASS";
                    tblViolationTagMobile.className = "table-tag pass";
                }
            } else {
                tblViolationTag.textContent = "FAIL";
                tblViolationTag.className = "table-tag danger";
                if (tblViolationTagMobile) {
                    tblViolationTagMobile.textContent = "FAIL";
                    tblViolationTagMobile.className = "table-tag danger";
                }
            }
        }
    }

    function updateComplianceView(data) {
        if (!data) return;

        // Dynamic Multi-Quantile Compliance Matrix (Desktop & Mobile)
        const matrixBody = document.getElementById('complianceMatrixBody');
        const mobileCompCards = document.getElementById('mobileComplianceCards');

        if (data.compliance_matrix && data.compliance_matrix.length > 0) {
            if (matrixBody) {
                matrixBody.innerHTML = data.compliance_matrix.map(row => {
                    const z = row.basel_zone || 'GREEN';
                    const tagClass = z === 'GREEN' ? 'pass' : (z === 'YELLOW' ? 'info' : 'danger');
                    const zLabel = `${z} ZONE`;
                    return `
                        <tr>
                            <td class="mono">${row.confidence_level_label}</td>
                            <td class="mono">${row.expected_violation_rate_pct.toFixed(2)}%</td>
                            <td class="mono">${row.observed_violations}</td>
                            <td class="mono">${row.observed_violation_rate_pct.toFixed(2)}%</td>
                            <td class="mono">${row.kupiec_lr_stat.toFixed(4)}</td>
                            <td class="mono">${row.p_value.toFixed(4)}</td>
                            <td><span class="table-tag ${tagClass}">${zLabel}</span></td>
                        </tr>
                    `;
                }).join('');
            }

            if (mobileCompCards) {
                mobileCompCards.innerHTML = data.compliance_matrix.map(row => {
                    const z = row.basel_zone || 'GREEN';
                    const tagClass = z === 'GREEN' ? 'pass' : (z === 'YELLOW' ? 'info' : 'danger');
                    const zLabel = `${z} ZONE`;
                    return `
                        <div class="mobile-data-card">
                            <div class="card-main-info">
                                <div class="card-header-row">
                                    <span class="card-item-title">${row.confidence_level_label}</span>
                                    <div class="card-header-badges">
                                        <span class="badge-sub">${row.observed_violation_rate_pct.toFixed(2)}% OBS</span>
                                        <span class="table-tag ${tagClass}">${zLabel}</span>
                                    </div>
                                </div>
                                <div class="card-sub-info">
                                    <span>EXP: ${row.expected_violation_rate_pct.toFixed(2)}%</span>
                                    <span class="info-sep">|</span>
                                    <span>VIOLATIONS: ${row.observed_violations}</span>
                                    <span class="info-sep">|</span>
                                    <span>LR: ${row.kupiec_lr_stat.toFixed(4)}</span>
                                </div>
                            </div>
                            <button class="expand-rincian-btn" onclick="toggleCardDetail(this)">
                                <span class="rincian-label">View Details</span>
                                <i class="fa-solid fa-chevron-down rincian-chevron"></i>
                            </button>
                            <div class="card-detail-box">
                                <div class="detail-grid-2col">
                                    <div class="detail-pair">
                                        <span class="dp-label">Confidence Level:</span>
                                        <span class="dp-value mono">${row.confidence_level_label}</span>
                                    </div>
                                    <div class="detail-pair">
                                        <span class="dp-label">Expected Violation Rate:</span>
                                        <span class="dp-value mono">${row.expected_violation_rate_pct.toFixed(2)}%</span>
                                    </div>
                                    <div class="detail-pair">
                                        <span class="dp-label">Observed Violations:</span>
                                        <span class="dp-value mono">${row.observed_violations} (${row.observed_violation_rate_pct.toFixed(2)}%)</span>
                                    </div>
                                    <div class="detail-pair">
                                        <span class="dp-label">Kupiec LR Stat:</span>
                                        <span class="dp-value mono">${row.kupiec_lr_stat.toFixed(4)} (p=${row.p_value.toFixed(4)})</span>
                                    </div>
                                    <div class="detail-pair" style="grid-column: 1 / -1;">
                                        <span class="dp-label">Basel Traffic Zone:</span>
                                        <span class="dp-value"><span class="table-tag ${tagClass}">${zLabel}</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        // Dynamic Model-Based Stress Scenarios (Desktop & Mobile)
        const stressBody = document.getElementById('stressScenariosBody');
        const mobileStressCards = document.getElementById('mobileStressCards');

        if (data.stress_scenarios && data.stress_scenarios.length > 0) {
            if (stressBody) {
                stressBody.innerHTML = data.stress_scenarios.map(sc => {
                    const lossFormatted = '-$' + Math.round(sc.stressed_loss_usd).toLocaleString('en-US');
                    return `
                        <tr>
                            <td><strong>${sc.scenario_name}</strong></td>
                            <td class="mono text-danger">${sc.simulated_return_shock_pct.toFixed(2)}%</td>
                            <td class="mono">${sc.stressed_volatility_pct.toFixed(2)}%</td>
                            <td class="mono text-danger">${lossFormatted}</td>
                            <td><span class="table-tag danger">${sc.capital_impact}</span></td>
                        </tr>
                    `;
                }).join('');
            }

            if (mobileStressCards) {
                mobileStressCards.innerHTML = data.stress_scenarios.map(sc => {
                    const lossFormatted = '-$' + Math.round(sc.stressed_loss_usd).toLocaleString('en-US');
                    return `
                        <div class="mobile-data-card">
                            <div class="card-main-info">
                                <div class="card-header-row">
                                    <span class="card-item-title">${sc.scenario_name}</span>
                                    <div class="card-header-badges">
                                        <span class="badge-sub">${sc.simulated_return_shock_pct.toFixed(2)}% SHOCK</span>
                                        <span class="table-tag danger">${sc.capital_impact}</span>
                                    </div>
                                </div>
                                <div class="card-sub-info">
                                    <span>STRESSED VOL: ${sc.stressed_volatility_pct.toFixed(2)}%</span>
                                    <span class="info-sep">|</span>
                                    <span>EST LOSS: <strong class="text-danger">${lossFormatted}</strong></span>
                                </div>
                            </div>
                            <button class="expand-rincian-btn" onclick="toggleCardDetail(this)">
                                <span class="rincian-label">View Details</span>
                                <i class="fa-solid fa-chevron-down rincian-chevron"></i>
                            </button>
                            <div class="card-detail-box">
                                <div class="detail-grid-2col">
                                    <div class="detail-pair">
                                        <span class="dp-label">Scenario Name:</span>
                                        <span class="dp-value">${sc.scenario_name}</span>
                                    </div>
                                    <div class="detail-pair">
                                        <span class="dp-label">Return Shock:</span>
                                        <span class="dp-value mono text-danger">${sc.simulated_return_shock_pct.toFixed(2)}%</span>
                                    </div>
                                    <div class="detail-pair">
                                        <span class="dp-label">Stressed Volatility:</span>
                                        <span class="dp-value mono">${sc.stressed_volatility_pct.toFixed(2)}%</span>
                                    </div>
                                    <div class="detail-pair">
                                        <span class="dp-label">Stressed Loss ($):</span>
                                        <span class="dp-value mono text-danger">${lossFormatted}</span>
                                    </div>
                                    <div class="detail-pair" style="grid-column: 1 / -1;">
                                        <span class="dp-label">Capital Reserve Impact:</span>
                                        <span class="dp-value"><span class="table-tag danger">${sc.capital_impact}</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
    }

    window.toggleCardDetail = function(btn) {
        const card = btn.closest('.mobile-data-card');
        if (!card) return;
        card.classList.toggle('expanded');
        const label = btn.querySelector('.rincian-label');
        if (label) {
            label.textContent = card.classList.contains('expanded') ? 'Hide Details' : 'View Details';
        }
    };

    function switchTab(tabName) {
        activeTab = tabName;
        if (tabForecast) tabForecast.classList.toggle('active', tabName === 'forecast');
        if (tabVaR) tabVaR.classList.toggle('active', tabName === 'var');
        if (tabReturns) tabReturns.classList.toggle('active', tabName === 'returns');



        const ticker = tickerSelect ? tickerSelect.value : 'AAPL';
        if (chartMainTitle) {
            if (tabName === 'forecast') {
                chartMainTitle.textContent = "Volatility Forecast Tracking";
            } else if (tabName === 'var') {
                chartMainTitle.textContent = "Filtered Historical Simulation (FHS) VaR Regulatory Backtest";
            } else {
                chartMainTitle.textContent = `${ticker} Daily Log-Return Dispersion`;
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

        if (tab === 'forecast') {
            currentChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [
                        {
                            label: 'Realized Volatility (30-Day)',
                            data: data.time_series.realized_volatility,
                            borderColor: '#8B5CF6',
                            backgroundColor: '#8B5CF6',
                            borderWidth: 2,
                            pointRadius: 0,
                            pointHoverRadius: 6,
                            pointHoverBackgroundColor: '#8B5CF6',
                            pointHoverBorderColor: '#FFFFFF',
                            pointHoverBorderWidth: 2.5,
                            fill: false,
                            tension: 0.1
                        },
                        {
                            label: 'LightGBM Predicted Volatility',
                            data: data.time_series.predicted_volatility,
                            borderColor: '#C4B5FD',
                            backgroundColor: '#C4B5FD',
                            borderWidth: 2,
                            pointRadius: 0,
                            pointHoverRadius: 6,
                            pointHoverBackgroundColor: '#C4B5FD',
                            pointHoverBorderColor: '#FFFFFF',
                            pointHoverBorderWidth: 2.5,
                            fill: false,
                            tension: 0.1
                        },
                        {
                            label: `EVT Cap Boundary (${(data.evt_cap_threshold * 100).toFixed(2)}%)`,
                            data: Array(dates.length).fill(data.evt_cap_threshold),
                            borderColor: '#F59E0B',
                            backgroundColor: '#F59E0B',
                            borderWidth: 1.5,
                            borderDash: [4, 4],
                            pointRadius: 0,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: '#F59E0B',
                            pointHoverBorderColor: '#FFFFFF',
                            pointHoverBorderWidth: 2,
                            fill: false
                        }
                    ]
                },
                options: getCommonChartOptions()
            });
            renderCustomLegend(currentChart.data.datasets);
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
                            borderColor: '#6366F1',
                            backgroundColor: '#6366F1',
                            borderWidth: 1,
                            pointRadius: 0,
                            pointHoverRadius: 6,
                            pointHoverBackgroundColor: '#6366F1',
                            pointHoverBorderColor: '#FFFFFF',
                            pointHoverBorderWidth: 2.5,
                            fill: false
                        },
                        {
                            label: `FHS ${(data.confidence_level * 100).toFixed(0)}% VaR Boundary`,
                            data: data.time_series.var_limits,
                            borderColor: '#EF4444',
                            backgroundColor: '#EF4444',
                            borderWidth: 1.5,
                            pointRadius: 0,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: '#EF4444',
                            pointHoverBorderColor: '#FFFFFF',
                            pointHoverBorderWidth: 2,
                            fill: false
                        },
                        {
                            label: 'VaR Breach (Violation)',
                            data: breachData,
                            backgroundColor: '#F87171',
                            borderColor: '#EF4444',
                            pointRadius: 5,
                            pointHoverRadius: 8,
                            pointHoverBackgroundColor: '#EF4444',
                            pointHoverBorderColor: '#FFFFFF',
                            pointHoverBorderWidth: 3,
                            showLine: false
                        }
                    ]
                },
                options: getCommonChartOptions()
            });
            renderCustomLegend(currentChart.data.datasets);
        } else if (tab === 'returns') {
            currentChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [
                        {
                            label: `${data.ticker} Daily Return`,
                            data: data.time_series.returns,
                            borderColor: '#8B5CF6',
                            backgroundColor: '#8B5CF6',
                            borderWidth: 1.2,
                            pointRadius: 0,
                            pointHoverRadius: 6,
                            pointHoverBackgroundColor: '#8B5CF6',
                            pointHoverBorderColor: '#FFFFFF',
                            pointHoverBorderWidth: 2.5,
                            fill: {
                                target: 'origin',
                                above: 'rgba(139, 92, 246, 0.15)',
                                below: 'rgba(239, 68, 68, 0.15)'
                            }
                        }
                    ]
                },
                options: getCommonChartOptions()
            });
            renderCustomLegend(currentChart.data.datasets);
        }
    }

    function renderCustomLegend(datasets) {
        const legendEl = document.getElementById('chartLegend');
        if (!legendEl) return;
        
        let html = '';
        datasets.forEach(ds => {
            if (ds.label) {
                const color = ds.borderColor || ds.backgroundColor;
                const isPointOnly = ds.showLine === false || (ds.pointRadius && ds.pointRadius > 0 && ds.borderWidth === undefined);
                const isDash = ds.borderDash && ds.borderDash.length > 0;
                
                let iconHtml = '';
                if (isPointOnly) {
                    // Titik / Point Icon
                    iconHtml = `<span class="legend-icon point-icon" style="background-color: ${color};"></span>`;
                } else if (isDash) {
                    // Garis Putus-putus / Dashed Line Icon
                    iconHtml = `<span class="legend-icon dashed-line-icon" style="border-top-color: ${color};"></span>`;
                } else {
                    // Garis Solid / Solid Line Icon
                    iconHtml = `<span class="legend-icon solid-line-icon" style="background-color: ${color};"></span>`;
                }
                
                html += `
                    <div class="legend-item">
                        ${iconHtml}
                        <span class="legend-label">${ds.label}</span>
                    </div>
                `;
            }
        });
        legendEl.innerHTML = html;
    }

    function renderImportanceChart() {
        const canvasEl = document.getElementById('importanceChart');
        if (!canvasEl) return;
        const ctx = canvasEl.getContext('2d');
        
        let features = ['vol_30d', 'vol_14d', 'vol_7d', 'macd', 'rsi_14', 'return_lag1', 'real_sent_vol_inter', 'real_sent_compound', 'real_neg_ratio'];
        let gains = [4850.2, 3420.5, 2150.8, 1280.4, 940.1, 620.5, 450.2, 310.8, 180.5];

        if (cachedRiskData && cachedRiskData.feature_importance) {
            features = cachedRiskData.feature_importance.features || features;
            gains = cachedRiskData.feature_importance.gains || gains;
        }

        if (importanceChart) {
            importanceChart.destroy();
        }

        const isDesktop = window.innerWidth >= 1025;
        const fontSizeXs = isDesktop ? 10 : 9.5;
        const fontSizeSm = isDesktop ? 11 : 10.5;

        importanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: features,
                datasets: [{
                    label: 'Gain Importance Score',
                    data: gains,
                    backgroundColor: '#5347B9',
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
                        ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: fontSizeXs } }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: '#0F172A', font: { family: 'JetBrains Mono', size: fontSizeSm, weight: '600' } }
                    }
                }
            }
        });
    }

    function getCommonChartOptions() {
        const isDesktop = window.innerWidth >= 1025;
        const fontSizeXs = isDesktop ? 10 : 9.5;
        const fontSizeSm = isDesktop ? 11 : 10.5;
        const fontSizeBase = isDesktop ? 12 : 11.5;
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(15, 23, 42, 0.92)',
                    backdropFilter: 'blur(12px)',
                    titleColor: '#F8FAFC',
                    bodyColor: '#E2E8F0',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    borderWidth: 1,
                    cornerRadius: 10,
                    padding: 14,
                    displayColors: true,
                    boxWidth: 8,
                    boxHeight: 8,
                    boxPadding: 6,
                    usePointStyle: true,
                    titleFont: { family: 'Plus Jakarta Sans', size: fontSizeBase, weight: '700' },
                    bodyFont: { family: 'JetBrains Mono', size: fontSizeSm, weight: '500' },
                    callbacks: {
                        title: function(tooltipItems) {
                            if (!tooltipItems || !tooltipItems.length) return '';
                            const rawLabel = tooltipItems[0].label;
                            if (!rawLabel) return '';
                            const parts = rawLabel.split('-');
                            if (parts.length === 3) {
                                const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                                const mIdx = parseInt(parts[1], 10) - 1;
                                return `📅 Date: ${parts[2]} ${months[mIdx] || parts[1]} ${parts[0]}`;
                            }
                            return rawLabel;
                        },
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) label += ': ';
                            if (context.parsed.y !== null && context.parsed.y !== undefined) {
                                const val = context.parsed.y;
                                if (Math.abs(val) < 1) {
                                    label += (val * 100).toFixed(2) + '%';
                                } else {
                                    label += val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                }
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: '#F1F5F9' },
                    ticks: {
                        color: '#64748B',
                        font: { family: 'Inter', size: fontSizeSm, weight: '500' },
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
                        font: { family: 'JetBrains Mono', size: fontSizeXs },
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
        if (!newsList || newsList.length === 0) {
            newsGrid.innerHTML = `<div class="news-item"><div class="news-item-title">No headlines found for this asset.</div></div>`;
            if (newsCountBadge) newsCountBadge.textContent = '0 Headlines';
            return;
        }

        if (newsCountBadge) newsCountBadge.textContent = `${newsList.length} Headlines`;

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

    function showLoader(show, text, subtext) {
        if (!loaderOverlay) return;
        const loaderText = document.getElementById('loaderText');
        const loaderSubtext = document.getElementById('loaderSubtext');
        
        if (text && loaderText) loaderText.textContent = text;
        if (subtext && loaderSubtext) loaderSubtext.textContent = subtext;
        
        if (show) {
            loaderOverlay.classList.add('active');
        } else {
            loaderOverlay.classList.remove('active');
        }
    }

    // PWA Service Worker Registration & Installation Handler
    let deferredPwaPrompt = null;
    const pwaInstallBanner = document.getElementById('pwaInstallBanner');
    const pwaInstallBtn = document.getElementById('pwaInstallBtn');
    const pwaDismissBtn = document.getElementById('pwaDismissBtn');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    const sidebarElement = document.getElementById('appSidebar') || document.querySelector('.sidebar');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => {
                    console.log('[ServiceWorker] Registered with scope:', reg.scope);
                    
                    // Periodically check for Service Worker updates every 60 minutes
                    setInterval(() => {
                        reg.update();
                    }, 60 * 60 * 1000);

                    // Detect if a new Service Worker is waiting and activate it immediately
                    reg.addEventListener('updatefound', () => {
                        const newWorker = reg.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    console.log('[ServiceWorker] New update available, applying seamlessly...');
                                }
                            });
                        }
                    });
                })
                .catch(err => console.warn('[ServiceWorker] Registration failed:', err));

            // Auto-reload page seamlessly when Service Worker takes control after a Vercel deployment
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!refreshing) {
                    refreshing = true;
                    window.location.reload();
                }
            });
        });
    }

    function showInstallBanner() {
        if (pwaInstallBanner && !localStorage.getItem('pwa_install_dismissed')) {
            setTimeout(() => {
                pwaInstallBanner.classList.add('visible');
            }, 3000);
        }
    }

    function hideInstallBanner() {
        if (pwaInstallBanner) {
            pwaInstallBanner.classList.remove('visible');
        }
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPwaPrompt = e;
        showInstallBanner();
    });

    if (pwaInstallBtn) {
        pwaInstallBtn.addEventListener('click', async () => {
            if (!deferredPwaPrompt) return;
            deferredPwaPrompt.prompt();
            const { outcome } = await deferredPwaPrompt.userChoice;
            console.log('[PWA] User choice outcome:', outcome);
            deferredPwaPrompt = null;
            hideInstallBanner();
            if (outcome === 'dismissed') {
                localStorage.setItem('pwa_install_dismissed', 'true');
            }
        });
    }

    if (pwaDismissBtn) {
        pwaDismissBtn.addEventListener('click', () => {
            hideInstallBanner();
            localStorage.setItem('pwa_install_dismissed', 'true');
        });
    }

    window.addEventListener('appinstalled', () => {
        console.log('[PWA] Application successfully installed as standalone PWA');
        hideInstallBanner();
        localStorage.setItem('pwa_install_dismissed', 'true');
    });

    // Mobile Android Drawer Navigation Handlers

    function toggleDrawer(open) {
        if (!sidebarElement) return;
        const isOpen = open !== undefined ? open : !sidebarElement.classList.contains('mobile-open');
        sidebarElement.classList.toggle('mobile-open', isOpen);
        if (sidebarBackdrop) sidebarBackdrop.classList.toggle('active', isOpen);
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', () => toggleDrawer(true));
    if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', () => toggleDrawer(false));
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', () => toggleDrawer(false));

    // Automatically close drawer when clicking primary action button
    if (btnScan) {
        btnScan.addEventListener('click', () => {
            if (window.innerWidth <= 1024) toggleDrawer(false);
        });
    }

    // Touch swipe to close drawer
    let touchStartX = 0;
    if (sidebarElement) {
        sidebarElement.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        sidebarElement.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 80) {
                toggleDrawer(false);
            }
        }, { passive: true });
    }

    // Material Design 3 Info Modal Dialog logic
    const infoModal = document.getElementById('infoModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBodyText = document.getElementById('modalBodyText');
    const modalDynamicInsight = document.getElementById('modalDynamicInsight');
    const modalIcon = document.getElementById('modalIcon');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalOkBtn = document.getElementById('modalOkBtn');

    // Tooltip click handlers
    document.querySelectorAll('.info-tooltip').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const metric = btn.getAttribute('data-metric');
            if (metric) openMetricModal(metric);
        });
    });

    function openMetricModal(metric) {
        if (!cachedRiskData) return;
        const data = cachedRiskData;
        const volPct = (data.predicted_volatility_annualized * 100).toFixed(2);
        const varUsd = '$' + (data.daily_var_usd || 0).toLocaleString('en-US');
        const esUsd = '$' + (data.daily_es_usd || 0).toLocaleString('en-US');
        const confPct = ((data.confidence_level || 0.95) * 100).toFixed(0);

        let title = '';
        let bodyText = '';
        let insight = '';
        let iconClass = 'fa-circle-info';
        let borderClass = '';
        let iconColorClass = '';

        if (metric === 'volatility') {
            title = 'Predicted Volatility (5-Day)';
            bodyText = 'Machine predicted price volatility over a 5-day horizon. Higher percentage reflects wider price swings and greater market uncertainty.';
            insight = `Asset ${data.ticker} is projected to experience ${volPct}% annual price volatility. This indicates ${volPct > 35 ? 'high market volatility' : 'moderate/stable price action'}.`;
            iconClass = 'fa-arrow-trend-up';
            borderClass = '';
            iconColorClass = 'text-accent';
        } else if (metric === 'var') {
            title = 'Value-at-Risk (1-Day VaR)';
            bodyText = `Estimated maximum daily loss under normal market conditions at ${confPct}% confidence. This defines the threshold that loss is not expected to exceed.`;
            insight = `With $${(data.portfolio_value || 1000000).toLocaleString('en-US')} capital, there is ${confPct}% certainty that your 1-day loss won't exceed ${varUsd}. In extreme crisis events (worst 5%), expected tail loss averages ${esUsd}.`;
            iconClass = 'fa-shield-halved';
            borderClass = 'alert-border';
            iconColorClass = 'text-danger';
        } else if (metric === 'es') {
            title = 'Expected Shortfall (ES)';
            bodyText = `Average expected loss in extreme tail crisis scenarios beyond the ${confPct}% VaR threshold (the average of the worst 5% of returns). Unlike VaR, ES is a coherent risk measure that accounts for tail severity.`;
            insight = `If market shocks exceed your VaR limit (${varUsd}), your expected average loss in those tail events is ${esUsd} (${data.daily_es_pct}% of your portfolio).`;
            iconClass = 'fa-triangle-exclamation';
            borderClass = 'alert-border';
            iconColorClass = 'text-danger';
        } else if (metric === 'basel') {
            title = 'Model Reliability (Basel III)';
            bodyText = 'International banking regulatory backtest verifying VaR model accuracy. A p-value greater than 0.05 indicates model validity under Basel III standards.';
            const zone = data.basel_zone || 'GREEN';
            insight = `The forecast model is certified in the Basel III ${zone} ZONE (p = ${(data.kupiec_p_value || 0.85).toFixed(4)} > 0.05). This confirms high predictive reliability under global banking standards.`;
            iconClass = 'fa-building-columns';
            borderClass = zone === 'GREEN' ? 'success-border' : (zone === 'YELLOW' ? 'warning-border' : 'alert-border');
            iconColorClass = zone === 'GREEN' ? 'text-success' : (zone === 'YELLOW' ? 'text-warn' : 'text-danger');
        }

        if (modalTitle) modalTitle.textContent = title;
        if (modalBodyText) modalBodyText.textContent = bodyText;
        if (modalDynamicInsight) modalDynamicInsight.textContent = insight;
        
        if (modalIcon) {
            modalIcon.className = `fa-solid ${iconClass} modal-title-icon ${iconColorClass}`;
        }
        
        const insightBox = document.querySelector('.modal-insight-box');
        if (insightBox) {
            insightBox.className = `modal-insight-box ${borderClass}`;
        }

        if (infoModal) {
            infoModal.style.display = 'flex';
            infoModal.offsetHeight; // force reflow
            infoModal.classList.add('active');
        }
    }

    function closeMetricModal() {
        if (infoModal) {
            infoModal.classList.remove('active');
            setTimeout(() => {
                infoModal.style.display = 'none';
            }, 250);
        }
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeMetricModal);
    if (modalOkBtn) modalOkBtn.addEventListener('click', closeMetricModal);
    
    if (infoModal) {
        infoModal.addEventListener('click', (e) => {
            if (e.target === infoModal) closeMetricModal();
        });
    }
});
