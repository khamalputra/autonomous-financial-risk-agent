# **Product Requirement Document (PRD) — Updated v1.2 (Production Ready)**

**Nama Produk:** Autonomous Financial & Market Risk Intelligence Agent  
**Versi:** 1.2 (100% Production Ready & Hardened)  
**Tanggal:** 5 Agustus 2026  
**Status:** Approved for Implementation (Final Audit Passed)  
**Target Platform:** Web Application (Responsive Desktop & Mobile)

---

## **1. Visi Produk & Ringkasan Eksekutif**

### **1.1 Visi Produk**
Menyediakan platform inteligensi risiko pasar dan analisis portofolio berbasis AI otomatis yang menggabungkan kuantifikasi *volatilitas pasar* dan *Conditional Value at Risk (CVaR)* ter-kalibrasi dengan *analisis sentimen berita finansial real-time* secara transparan, akurat, bebas dari *data leakage*, dan dilindungi oleh *deterministic & legal guardrails*.

### **1.2 Ringkasan Nilai Tambah (*Value Proposition*)**
* **Otomatisasi Sintesis Informasi & Transparansi Penalaran:** Mengubah ribuan berita finansial dan data harga historis menjadi analisis risiko ringkas dengan transparansi jejak penalaran AI Agent (*Thought Process Trace*).  
* **Kuantifikasi Risiko Berbasis Fat-Tail & Extreme Value:** Mengombinasikan model GARCH, LightGBM (dengan proteksi ekstrapolasi EVT), dan skor sentimen FinBERT menggunakan skema **Filtered Historical Simulation (FHS)** untuk mengukur *Value at Risk (VaR 95%)* dan *Expected Shortfall (CVaR)* secara akurat bahkan saat krisis *Black Swan*.  
* **Penyetaraan Data & Aksi Korporasi Presisi:** Konversi otomatis kurs mata uang (*Unified Base Currency*) dan penyesuaian harga *Adjusted Close* untuk mencegah distorsi *Stock Split* dan fluktuasi valas.  
* **Kepatuhan Deterministik, Lisensi & Anti-Prompt Injection:** Proteksi kepatuhan finansial otomatis (*Not Financial Advice disclaimer*), kepatuhan lisensi berita (*Paraphrase-Only Citation*), dan pembatasan halusinasi agent menggunakan *Pydantic Output Validation Layer*.  
* **Keandalan Tinggi, Event-Driven Cache & Performa CPU:** Backend 100% kompatibel dengan **server CPU (2 vCPU, 4 GB RAM)** via strategi *event-driven cache invalidation*, *Redis volatile-lru eviction*, *decoupled retraining worker*, *SSE Keep-Alive*, dan *multi-source ingestion pipeline*.

---

## **2. Target Pengguna & Persona (*User Personas*)**

| Persona | Profil Pengguna | Kebutuhan Utama |
| :---- | :---- | :---- |
| **Quantitative Risk Analyst** | Analis risiko profesional di lembaga keuangan/fintech | Alat kalkulasi VaR/CVaR portofolio multi-aset berbasis *Filtered Historical Simulation*, analisis *stress-testing* skenario historis, proteksi *Black Swan EVT*, bebas *lookahead bias*, serta *explainable*. |
| **Retail Trader / Investor** | Investor saham/kripto aktif yang memantau portofolio harian | *Dashboard* visual interaktif, *chatbot* dengan memori percakapan aman (*sliding window*), penjelasan penyebab pergerakan harga tajam, dan edukasi batasan *tail risk*. |

---

## **3. Kriteria Keberhasilan Produk (*Product Success Metrics*)**

| Metrik | Target Indikator | Metode Pengukuran |
| :---- | :---- | :---- |
| **Efisiensi Analisis** | Penghematan waktu analisis risiko $\ge 60\%$ | Studi waktu sintesis informasi manual vs sistem. |
| **Kecepatan Akses** | Latensi *page load* dashboard $< 2$ detik | Google Lighthouse / Performance Monitoring. |
| **Responsivitas Agent** | Mula respons *streaming* LLM $< 1.5$ detik | Metrics Server-Sent Events (SSE) dengan Redis Pre-computation. |
| **Akurasi Model NLP** | F1-Score klasifikasi sentimen FinBERT $\ge 85\%$ | Pengujian pada Test Dataset terisolasi. |
| **Akurasi Prediksi** | RMSE volatilitas LightGBM $+$ EVT Cap $<$ Baseline | Backtesting Walk-Forward 6 bulan. |
| **Kepatuhan Guardrail & Legal** | 0% unverified buy/sell & 0% raw news copyright breach | Pydantic Schema & Copyright Audit Suite. |
| **System Uptime** | Ketersediaan API $\ge 99.5\%$ | Health-check endpoint & Fallback metrics. |

---

## **4. Persyaratan Fungsional (*Functional Requirements*)**

### **FR-1: Interactive Market & Risk Dashboard (Frontend UI)**

* **FR-1.1:** Menampilkan grafik candlestick interaktif harga aset (Plotly.js / Chart.js).  
* **FR-1.2:** Menampilkan kurva *Realized Volatility* (7d/14d/30d), *Prediction Intervals ($\pm 1\sigma$)*, dan grafik estimasi VaR (95%) serta Expected Shortfall (CVaR).  
* **FR-1.3:** Visualisasi *Gauge Meter* sentimen berita harian beserta rincian kata kunci/topik utama (*Word Cloud / Topic Breakdown*).  
* **FR-1.4: Multi-Factor Stress-Testing & Historical Scenario Simulator:** Fitur simulator skenario guncangan pasar berbasis preset krisis historis riil (misal: *2020 COVID Crash*, *2022 Tech Sell-off*) yang mengunci pergantian korelasi dan lonjakan volatilitas multi-aset secara simultan, di samping slider kustom.
* **FR-1.5: Tail-Risk Educational Tooltip:** Penambahan label edukasi eksplisit pada UI VaR/CVaR: *"VaR 95% menunjukkan ambang kerugian minimal pada 5% kondisi terburuk. Kerugian riil tail risk dapat melebihi angka VaR ini (Lihat nilai CVaR)."*

### **FR-2: Conversational AI Risk Agent (Chatbot UI)**

* **FR-2.1: SSE Streaming with Heartbeat & Market Status Context:** 
  * Antarmuka percakapan interaktif menggunakan *Server-Sent Events (SSE)* dengan pulsa *heartbeat ping* otomatis setiap 2 detik untuk mencegah *serverless gateway timeout (504)*.  
  * **Market Status Awareness:** Injeksi variabel status bursa otomatis pada konteks Agent (`[Market Status: OPEN/CLOSED]`) agar Agent menyadari jika bursa sedang tutup di akhir pekan/hari libur.  
* **FR-2.2: Bounded Multi-Turn Session Memory:** Menyimpan histori percakapan berbasis sesi di Redis dengan skema *Sliding Window Truncation* (maksimal 8 turn) dan pencatatan ringkasan otomatis untuk mencegah pembengkakan token dan biaya API.  
* **FR-2.3: Agent Thought Process UI (Traceability):** Menampilkan jejak langkah pemanggilan *tools* agent secara transparan (*collapsible UI*).  
* **FR-2.4: Deterministic Guardrail & Financial Compliance:** Filtering masukan/keluaran berbasis skema Pydantic untuk mencegat *Prompt Injection*, memblokir rekomendasi beli/jual secara mutlak, serta menempelkan sanggahan hukum (*Not Financial Advice*).  
* **FR-2.5: Copyright-Compliant Paraphrase Citations:** Tampilan rujukan berita **wajib hanya menggunakan judul berita, nama penerbit, URL link asli, dan 1–2 kalimat sintesis/parafasa buatan FinBERT**, melarang keras penayangan atau penyimpanan paragraf utuh artikel berita demi mematuhi ToS API & hak cipta penerbit.

### **FR-3: Pipelines Ingestion & NLP Sentimen (Backend NLP)**

* **FR-3.1: Primary Data Pipeline & Fallback Redundancy:** Pengambilan berita utama menggunakan Finnhub API & RSS Feeds langsung (untuk performa real-time dan bebas batasan delay), dengan NewsAPI dan yfinance sebagai skema *secondary fallback*.  
* **FR-3.2: Hybrid Deduplication & Event-Driven Redis Invalidation:** 
  * Deduplikasi berita serupa $>85\%$ menggunakan metode ringan **MinHash LSH / Fuzzy String Matching**.  
  * **Event-Driven Cache Invalidation:** Jika pendeteksi harga mencatat fluktuasi tajam aset $>3\%$ dalam kurun waktu 5 menit (*Flash Crash detection*), Redis akan secara otomatis menghapus (*purge*) cache sentimen/volatilitas aset tersebut untuk dikalkulasi ulang secara real-time.  
* **FR-3.3: Strict Timezone Cutoff & Lag Shift:** Penerapan batas waktu harian (*Strict Cutoff 23:59 UTC*) pada pengelompokan berita harian sebelum menghitung *Strict 1-Lag Shift ($t-1$)* untuk menghilangkan *Lookahead Bias*.

### **FR-4: Predictive Volatility & Portfolio Risk Engine (Backend ML)**

* **FR-4.1: Corporate Action Adjustment & FX Base Currency Conversion:** 
  * Seluruh data harga historis wajib menggunakan **Adjusted Close Price** (ter-penyesuaian *Stock Split* & dividen) untuk mencegah lonjakan volatilitas palsu.  
  * Konversi otomatis return seluruh aset ke **Unified Base Currency (USD)** menggunakan data kurs harian sebelum kalkulasi matriks kovariansi portofolio multi-mata uang.  
* **FR-4.2: LightGBM Extrapolation Guardrail (Extreme Value Theory):** Penggabungan modul *Extreme Value Theory (EVT / Generalized Pareto Distribution)* sebagai penutup (*cap scaling factor*) untuk prediksi volatilitas LightGBM saat kondisi *Black Swan*, sehingga model tidak terpotong pada batas historis pelatihan.  
* **FR-4.3: Filtered Historical Simulation (FHS) & Cold-Start Proxy Fallback:** 
  * Kalkulasi VaR (95%) dan CVaR menggunakan skema FHS ter-kalibrasi GARCH/LightGBM.  
  * **Cold-Start Fallback:** Jika aset baru melantai (misal saham IPO atau token kripto baru dengan sampel data historis $<60$ hari), sistem secara otomatis mengalihkan kalkulasi ke *Sector-Proxy Imputed Volatility Model* dan menampilkan status *"Insufficient Sample Size for Pure FHS"* di UI.  
* **FR-4.4: Mismatched Calendar Alignment:** Penanganan khusus sinkronisasi data antar aset dengan jam perdagangan berbeda (misal: Kripto 24/7 vs Saham 09:30-16:00 EST) via pencocokan tanggal kalender kerja bursa.

### **FR-5: Decoupled MLOps & Operational Safety**

* **FR-5.1: Decoupled Retraining Execution:** Pembaruan data & *retraining* model LightGBM dijalankan pada **proses background terpisah** (misal: GitHub Actions Cron / Independent Celery Worker), terisolasi penuh dari proses Uvicorn FastAPI agar tidak mengganggu *event loop*.  
* **FR-5.2: Model Registry & Metadata Store:** Pencatatan versi model (`v1.0`, `v1.1`, `v1.2`), hyperparameter, dan skor evaluasi historis (Local MLflow/Metadata JSON).  
* **FR-5.3:** Evaluasi model baru secara otomatis menggunakan skema *Walk-Forward Out-of-Sample Validation*.  
* **FR-5.4: Atomic Model Hot-Reloading:** Penukaran file model (`.pkl` / `.onnx`) di memori FastAPI menggunakan operasi file atomik (`os.replace`) dan *thread locking* untuk mencegah *Race Condition* saat inferensi berlangsung.

### **FR-6: User Management & Export Capabilities**

* **FR-6.1: Authentication & Watchlist Isolation:** Layanan autentikasi (Supabase Auth / Guest Session UUID) diimplementasikan sejak awal arsitektur untuk memisahkan memori sesi dan *watchlist* portofolio pengguna secara aman (*multi-tenant*).  
* **FR-6.2: Export Report (PDF & CSV):** Fitur ekspor ringkasan analisis risiko dan transkrip percakapan agent ke dalam dokumen PDF/CSV (dengan kepatuhan lisensi parafasa berita).

---

## **5. Persyaratan Non-Fungsional (*Non-Functional Requirements*)**

* **NFR-1 (Kompatibilitas Komputasi & Memory Eviction):** Seluruh backend berjalan stabil pada **server CPU** (2 vCPU, 4 GB RAM). Redis dikonfigurasi dengan batas `maxmemory 512mb` dan kebijakan `maxmemory-policy volatile-lru` untuk mencegah *Memory Exhaustion Crash (OOM)*.  
* **NFR-2 (Keamanan Data, Guardrails & Network Heartbeat):** Validasi skema input/output (Pydantic), proteksi CORS, *Token Bucket Rate Limiting* via Redis, dan SSE Heartbeat (2s) untuk mencegah serverless gateway timeout.  
* **NFR-3 (Keandalan / Reliability & Fallback):** *Fail-safe mechanism* dengan data sampel historis dan *Cold-start Sector Proxy* jika data API atau sampel historis terbatas.  
* **NFR-4 (Kepatuhan Metodologis & Legal):** Bebas dari *Lookahead Bias*, *Corporate Action Distortion*, *FX Mismatch*, *Extrapolation Error*, dan bebas dari pelanggaran hak cipta penerbit berita.

---

## **6. Arsitektur Sistem & Spesifikasi Teknologi**

```text
[ Frontend Layer ]   : Next.js (React), Tailwind CSS, Plotly.js, Shadcn UI (Vercel)
         │
         ▼ (REST API / SSE Streaming dengan Heartbeat 2s & Supabase Auth)
[ Backend Layer ]    : Python FastAPI, Uvicorn (Render / Cloud Run)
         │
         ├──> [ Dynamic Cache ]           : Redis Memory (Volatile-LRU Eviction + Flash Crash Auto-Purge)
         │
         ├──> [ Guardrail & Agent Engine] : Pydantic Layer + Native LLM Router (Market Context & Paraphrase)
         │
         ├──> [ Risk Engine ]             : FHS Engine + LightGBM (EVT Cap) + FX & Corporate Action Normalizer
         │
         ├──> [ Ingestion Redundancy ]    : Primary: Finnhub/RSS | Fallback: NewsAPI/YFinance
         │
         └──> [ External MLOps Worker ]   : Decoupled GitHub Actions / Background Worker (APScheduler)
```

---

## **7. Rencana Rilis & Matriks Prioritas Implementation Roadmap**

### **[ Minggu 1 - Prioritas Tinggi (Core Risk & Ingestion Foundation) ]**
* Core Ingestion Pipeline (Finnhub API / RSS Direct Stream + Adjusted Close + FX Conversion).  
* Hybrid News Deduplication (MinHash LSH) & Event-Driven Flash Crash Cache Purge.  
* Strict Timezone Cutoff ($t-1$) & Feature Engineering.  
* LightGBM Training + EVT Extrapolation Cap & Cold-Start Proxy Risk Engine.  
* Filtered Historical Simulation (FHS) VaR/CVaR Calculation Engine.  
* Deterministic Pydantic Output Guardrails & NFA Disclaimer System.

### **[ Minggu 2 - Prioritas Tinggi (Auth, API & Agent) ]**
* Supabase Authentication & Guest Session UUID Infrastructure.  
* Backend API (FastAPI) dengan Multi-Turn Redis Session Memory (*Volatile-LRU*).  
* Lightweight Agent Router + SSE Streaming dengan Heartbeat Keep-Alive (2s) & Market Status Context.  
* Transparansi Agent Thought Process UI & Copyright-Compliant Citation.

### **[ Minggu 3 - Prioritas Sedang (Frontend & Simulation) ]**
* Frontend Web App (Next.js) + Interactive Dashboard (Plotly.js) + Tail-Risk Tooltip.  
* Multi-Factor Stress-Testing Historical Scenario Simulator & Topic Breakdown Chart.  
* PDF/CSV Report Export Feature.

### **[ Minggu 4 - Prioritas Tambahan (Decoupled MLOps & Cloud Deploy) ]**
* Supabase Saved Watchlists & User Profile Settings.  
* Decoupled Automated Retraining Pipeline (GitHub Actions Cron + Walk-Forward Validation).  
* Atomic Model Hot-Reloading (`os.replace`) & Thread-Safe Memory Refresher.  
* End-to-End Cloud Deployment & Stress Testing (Vercel + Render).
