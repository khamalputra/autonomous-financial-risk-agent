# **Product Requirement Document (PRD) — Updated v1.1**

**Nama Produk:** Autonomous Financial & Market Risk Intelligence Agent  
**Versi:** 1.1 (Updated Post-Audit)  
**Tanggal:** 5 Agustus 2026  
**Status:** Approved for Implementation  
**Target Platform:** Web Application (Responsive Desktop & Mobile)

---

## **1\. Visi Produk & Ringkasan Eksekutif**

### **1.1 Visi Produk**

Menyediakan platform inteligensi risiko pasar dan analisis portofolio berbasis AI otomatis yang menggabungkan kuantifikasi *volatilitas pasar* dan *Conditional Value at Risk (CVaR)* dengan *analisis sentimen berita finansial real-time* secara transparan, akurat, dan bebas dari *data leakage*.

### **1.2 Ringkasan Nilai Tambah (*Value Proposition*)**

* **Otomatisasi Sintesis Informasi & Transparansi Penalaran:** Mengubah ribuan berita finansial dan data harga historis menjadi analisis risiko ringkas dengan transparansi jejak penalaran AI Agent (*Thought Process Trace*).  
* **Kuantifikasi Risiko Komprehensif:** Mengombinasikan model GARCH, LightGBM, dan skor sentimen FinBERT untuk mengukur *Value at Risk (VaR 95%)*, *Expected Shortfall (CVaR)*, serta matriks kovariansi portofolio multi-aset.  
* **Kepatuhan & Pengamanan (*Compliance & Guardrails*):** Proteksi kepatuhan finansial otomatis (*Not Financial Advice disclaimer*) dan pencegahan halusinasi agent.  
* **Keandalan Tinggi & Hemat Komputasi:** Infrastruktur backend 100% kompatibel dengan **server CPU** serta dilengkapi *multi-source fallback pipeline* untuk menangani *downtime* API eksternal.

---

## **2\. Target Pengguna & Persona (*User Personas*)**

| Persona | Profil Pengguna | Kebutuhan Utama |
| :---- | :---- | :---- |
| **Quantitative Risk Analyst** | Analis risiko profesional di lembaga keuangan/fintech | Alat kalkulasi VaR/CVaR portofolio multi-aset, analisis *stress-testing*, bebas *lookahead bias*, serta dapat dipertanggungjawabkan (*explainable*). |
| **Retail Trader / Investor** | Investor saham/kripto aktif yang memantau portofolio harian | *Dashboard* visual interaktif, *chatbot* dengan memori percakapan, serta penjelasan penyebab pergerakan harga tajam. |

---

## **3\. Kriteria Keberhasilan Produk (*Product Success Metrics*)**

| Metrik | Target Indikator | Metode Pengukuran |
| :---- | :---- | :---- |
| **Efisiensi Analisis** | Penghematan waktu analisis risiko $\\ge 60%$ | Studi waktu sintesis informasi manual vs sistem. |
| **Kecepatan Akses** | Latensi *page load* dashboard $\< 2$ detik | Google Lighthouse / Performance Monitoring. |
| **Responsivitas Agent** | Mula respons *streaming* LLM $\< 1.5$ detik | Metrics Server-Sent Events (SSE). |
| **Akurasi Model NLP** | F1-Score klasifikasi sentimen FinBERT $\\ge 85%$ | Pengujian pada Test Dataset terisolasi. |
| **Akurasi Prediksi** | RMSE volatilitas LightGBM \< Model Baseline | Backtesting Walk-Forward 6 bulan. |
| **System Uptime** | Ketersediaan API $\\ge 99.5%$ | Health-check endpoint & Fallback metrics. |

---

## **4\. Persyaratan Fungsional (*Functional Requirements*)**

### **FR-1: Interactive Market & Risk Dashboard (Frontend UI)**

* **FR-1.1:** Menampilkan grafik candlestick interaktif harga aset (Plotly.js / Chart.js).  
* **FR-1.2:** Menampilkan kurva *Realized Volatility* (7d/14d/30d), *Prediction Intervals ($\\pm 1\\sigma$)*, dan grafik estimasi VaR (95%) serta Expected Shortfall (CVaR).  
* **FR-1.3:** Visualisasi *Gauge Meter* sentimen berita harian beserta rincian kata kunci/topik utama (*Word Cloud / Topic Breakdown*).  
* **FR-1.4:** **Interactive Stress-Testing / Scenario Simulator:** Fitur slider untuk menguji guncangan harga pasar (misal: $-5%, \-10%$) dan melihat perubahan VaR/CVaR secara langsung.

### **FR-2: Conversational AI Risk Agent (Chatbot UI)**

* **FR-2.1:** Antarmuka percakapan interaktif menggunakan teknik *Server-Sent Events (SSE)* untuk respons *text-streaming*.  
* **FR-2.2:** **Multi-Turn Session Memory:** Menyimpan histori percakapan berbasis sesi (Redis Memory) untuk kueri lanjutan.  
* **FR-2.3:** **Agent Thought Process UI (Traceability):** Menampilkan jejak langkah panggilian *tools* agent secara transparan (*collapsible UI*).  
* **FR-2.4:** **Financial Compliance Guardrail:** Penambahan otomatis sanggahan hukum (*Not Financial Advice*) dan pembatasan agar agent tidak memberikan rekomendasi beli/jual langsung.  
* **FR-2.5:** Menampilkan sumber rujukan berita/data (*citation links*) pada setiap klaim analisis.

### **FR-3: Pipelines Ingestion & NLP Sentimen (Backend NLP)**

* **FR-3.1:** **Multi-Source Ingestion & Fallback Redundancy:** Pengambilan berita dari NewsAPI dengan *automatic fallback* ke Finnhub/RSS Feeds jika terjadi *rate limit* atau *downtime*.  
* **FR-3.2:** Pembersihan data teks (penghapusan tag HTML, URL, dan *deduplication* berita serupa $\>85%$).  
* **FR-3.3:** Ekstraksi skor sentimen kontinu (`sentiment_compound`) dan probabilitas kelas menggunakan FinBERT yang dioptimasi untuk CPU (ONNX Runtime / INT8 Quantization).

### **FR-4: Predictive Volatility & Portfolio Risk Engine (Backend ML)**

* **FR-4.1:** Kalkulasi indikator teknikal (RSI, MACD, Log Returns).  
* **FR-4.2:** Pelatihan & inferensi model LightGBM Regressor untuk prediksi *Forward Volatility 5-Hari*.  
* **FR-4.3:** **Multi-Asset Portfolio Covariance Matrix:** Kalkulasi VaR dan CVaR terdispersi untuk portofolio multi-aset berdasarkan bobot pengguna.  
* **FR-4.4:** **Proteksi Data Leakage:** Penerapan pergeseran waktu *Strict 1-Lag Shift* ($t-1$) pada seluruh fitur input sebelum dipasangkan dengan target variabel ($t$).

### **FR-5: Automated Model Retraining & MLOps Pipeline**

* **FR-5.1:** Eksekusi pembaruan data & *retraining* model LightGBM secara berkala (setiap akhir pekan via APScheduler / GitHub Actions).  
* **FR-5.2:** **Model Registry & Metadata Store:** Pencatatan versi model (`v1.0`, `v1.1`), hyperparameter, dan skor evaluasi historis (Local MLflow/Metadata JSON).  
* **FR-5.3:** Evaluasi model baru secara otomatis menggunakan skema *Walk-Forward Out-of-Sample Validation*.  
* **FR-5.4:** Mekanisme *Hot-Reloading* file model (`.pkl` / `.onnx`) di memori FastAPI tanpa menghentikan layanan web (*zero downtime*).

### **FR-6: User Management & Export Capabilities**

* **FR-6.1:** **Authentication & Watchlist Saver:** Layanan pendaftaran/login pengguna (Supabase Auth) untuk menyimpan portofolio kustom.  
* **FR-6.2:** **Export Report (PDF & CSV):** Fitur ekspor ringkasan analisis risiko dan transkrip percakapan agent ke dalam dokumen PDF/CSV.

---

## **5\. Persyaratan Non-Fungsional (*Non-Functional Requirements*)**

* **NFR-1 (Kompatibilitas Komputasi):** Seluruh arsitektur backend wajib berjalan stabil pada **server CPU** (Spesifikasi acuan: 2 vCPU, 2-4 GB RAM).  
* **NFR-2 (Keamanan Data & Rate Limiting):** Validasi skema input (Pydantic), proteksi CORS, dan pembatasan Laju Akses (*Token Bucket Rate Limiting*) via Redis untuk melindungi endpoint LLM.  
* **NFR-3 (Keandalan / Reliability):** *Fail-safe mechanism* dengan data sampel historis jika seluruh API penyedia data mengalami kegagalan.  
* **NFR-4 (Keandalan Metodologi):** Bebas dari *Lookahead Bias* dan *Data Normalization Leakage* pada seluruh siklus pelatihan data.

---

## **6\. Arsitektur Sistem & Spesifikasi Teknologi**

\[ Frontend Layer \]   : Next.js (React), Tailwind CSS, Plotly.js, Shadcn UI (Vercel)

         │

         ▼ (REST API / SSE Streaming)

\[ Backend Layer \]    : Python FastAPI, Uvicorn, APScheduler (Render / Cloud Run)

         │

         ├──\> \[ ML / NLP Engine \] : LightGBM, FinBERT (ONNX CPU Runtime), MLflow Registry

         ├──\> \[ AI Agent Engine\]  : LangChain / CrewAI (External LLM API: Gemini/Groq)

         ├──\> \[ Redundancy Layer \]: Primary: NewsAPI/YFinance | Fallback: Finnhub/RSS

         └──\> \[ Storage Layer \]   : Supabase (PostgreSQL Auth) & Redis (Session Memory & Cache)

---

## **7\. Rencana Rilis & Matriks Prioritas Implementation Roadmap**

\[ Minggu 1 \- Prioritas Tinggi (Must-Have) \]

 \- Core Data Pipeline (Multi-Source Fallback)

 \- FinBERT Sentiment Extraction & Strict Lag Shift

 \- LightGBM Training Model (VaR & CVaR Calculation)

 \- Guardrails & NFA Disclaimer System

\[ Minggu 2 \- Prioritas Tinggi (Must-Have) \]

 \- Backend API (FastAPI) dengan Multi-Turn Redis Session Memory

 \- Integrasi AI Agent Tool Execution & Thought Process Traceability

\[ Minggu 3 \- Prioritas Sedang (Should-Have) \]

 \- Frontend Web App (Next.js) \+ Interactive Dashboard

 \- Stress-Testing Scenario Simulator & Topic Breakdown Chart

 \- PDF/CSV Report Export Feature

\[ Minggu 4 \- Prioritas Tambahan (Nice-to-Have) \]

 \- Supabase User Authentication & Saved Watchlists

 \- Automated Retraining Pipeline (Walk-Forward Validation & Model Registry)

 \- End-to-End Cloud Deployment (Vercel \+ Render)  
