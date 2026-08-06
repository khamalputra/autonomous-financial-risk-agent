# Autonomous Financial & Market Risk Intelligence Agent (v1.2)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 14+](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)

An autonomous AI-agent platform for real-time market risk intelligence, combining Filtered Historical Simulation (FHS) VaR/CVaR, LightGBM-GARCH volatility forecasting with Extreme Value Theory (EVT) caps, and FinBERT news sentiment synthesis.

---

## 📌 Abstract & Research Overview

Modern financial market risk management requires the synthesis of both quantitative asset price dynamics and qualitative market sentiment. This repository provides an end-to-end open-source system that:
1. Quantifies multi-asset portfolio risk (**95% VaR and Expected Shortfall/CVaR**) using **Filtered Historical Simulation (FHS)** scaled by **LightGBM & GARCH** volatility predictions.
2. Incorporates **Extreme Value Theory (EVT)** caps to prevent extrapolation underestimation during *Black Swan* market crashes.
3. Synthesizes real-time financial news sentiment using **FinBERT (ONNX CPU quantized)** with strict timezone alignment ($t-1$ lag shift) to eliminate *lookahead bias*.
4. Integrates a **Deterministic Financial Guardrail Layer** preventing unverified investment advice while offering transparent **Thought Process Traceability** via Server-Sent Events (SSE).

---

## 🏗️ System Architecture

```text
[ Frontend Layer ]   : Next.js (React), Tailwind CSS, Plotly.js, Shadcn UI
         │
         ▼ (REST API / SSE Streaming with 2s Heartbeat & Supabase Auth)
[ Backend Layer ]    : Python FastAPI, Uvicorn
         │
         ├──> [ Dynamic Cache ]           : Redis Memory (Volatile-LRU + Flash Crash Auto-Purge)
         │
         ├──> [ Guardrail & Agent Engine] : Pydantic Layer + Native LLM Router (Market Context & Paraphrase)
         │
         ├──> [ Risk Engine ]             : FHS Engine + LightGBM (EVT Cap) + FX & Corporate Action Normalizer
         │
         ├──> [ Ingestion Redundancy ]    : Primary: Finnhub/RSS | Fallback: NewsAPI/YFinance
         │
         └──> [ External MLOps Worker ]   : Decoupled GitHub Actions / Background Worker
```

---

## ⚙️ Key Methodology & Formulations

### 1. Volatility Scaling & LightGBM EVT Cap
Daily asset returns $r_t = \ln(P_t / P_{t-1})$ are modeled via a hybrid GARCH(1,1) and LightGBM regressor with Extreme Value Theory (Generalized Pareto Distribution) upper bounds:
$$\hat{\sigma}_{t+1} = \min\left( \text{LightGBM}(X_{t-1}), \text{EVT\_Cap}(\sigma_{\text{GARCH}}) \right)$$

### 2. Filtered Historical Simulation (FHS) VaR & CVaR
Standardized residuals $e_t = \frac{r_t - \mu_t}{\sigma_t}$ are generated and rescaled to forecast future portfolio loss distributions:
$$\text{VaR}_{\alpha}(P) = -\text{Quantile}_{\alpha}\left( \left\{ \sum w_i \cdot \hat{\sigma}_{i,t+1} \cdot e_{i,\tau} \right\}_{\tau=1}^T \right)$$
$$\text{CVaR}_{\alpha}(P) = \mathbb{E}\left[ L \mid L \ge \text{VaR}_{\alpha}(P) \right]$$

---

## 📄 Documentation
- [PRD v1.2 (Production Ready)](docs/PRD%20-%20Autonomous%20Financial%20%26%20Market%20Risk%20Intelligence%20Agent%20%28v1.2%20Updated%29.md)
- [CRISP-DM Executive Audit Report](C:/Users/khamal/.gemini/antigravity/brain/a2e4640e-337b-439f-9dc8-0277686e662c/crisp_dm_executive_risk_report.md)
- [15-Slide Presentation Deck](C:/Users/khamal/.gemini/antigravity/brain/a2e4640e-337b-439f-9dc8-0277686e662c/presentation_deck.html)

---

## 📜 License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
