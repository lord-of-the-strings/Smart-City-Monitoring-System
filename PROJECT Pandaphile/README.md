# Smart City Monitoring System
### Delhi Environmental Monitoring & Sustainability Analytics Platform (DESA)

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-v3.10-22c55e?style=flat-square)](https://recharts.org/)
[![CPCB Compliant](https://img.shields.io/badge/CPCB-NAAQS_2026-emerald?style=flat-square)](https://cpcb.nic.in/)

An empirical, multi-domain analytics and machine learning forecasting platform designed for continuous urban environmental monitoring, grid energy stress analysis, and next-day air quality dispersion prediction across the National Capital Territory of **Delhi, India** (Latitude: 28.6139° N, Longitude: 77.2090° E).

---

## 📌 Executive Summary

| Attribute | Specification |
|---|---|
| **Location** | Delhi, National Capital Region (NCR), India |
| **Study Window** | **1 January 2023 to 30 November 2024 (700 Days)** |
| **Resolution** | Daily master synchronization with 5-minute grid demand profiles |
| **Integrated Domains** | Air Quality (CEMS/Atmospheric), Meteorology, Grid Power Demand |
| **Prediction Objective** | **Next-Day PM2.5 ($\mu\text{g/m}^3$)** (`target_next_day_pm25`) |
| **Evaluation Split** | Chronological 70% Train / 15% Validation / 15% Test (105 Days) |
| **Naïve Baseline** | Persistence (Tomorrow = Today): Test RMSE **17.9 $\mu\text{g/m}^3$** |
| **Top Model** | Bidirectional LSTM (Test RMSE **14.8 $\mu\text{g/m}^3$**, $R^2 = 0.88$) |

---

## 🔬 Core Empirical Findings & Research Insights

### 1. Inverse Seasonality of Energy & Air Pollution ($r = -0.28$)
- **Power Demand Peak**: Reaches its maximum during the **June summer heatwaves** (June monthly average ~4,860 MW; all-time historic Delhi grid peak of **8,631.5 MW recorded on 19 June 2024**) driven by extreme residential and commercial air-conditioning cooling loads.
- **Particulate Peak**: Reaches its maximum during **November and January** (averaging 109 to 121 $\mu\text{g/m}^3$) driven by post-monsoon agricultural stubble burning (Oct–Nov) combined with winter nocturnal thermal inversions and calm boundary layers.
- **Thesis Conclusion**: The negative correlation between energy demand and PM2.5 is **seasonal, not causal**.

### 2. Atmospheric Dispersion Coupling
- **Temperature vs. PM2.5 ($r = -0.60$)**: Strong negative correlation. Low surface temperatures create nocturnal atmospheric inversions that trap ground-level vehicular and industrial emissions. Summer convective thermal plumes rapidly disperse particulates.
- **Wind Speed vs. PM2.5 ($r = -0.44$)**: Calm winds ($< 8\text{ km/h}$) cause toxic smog stagnation; breezes ($> 20\text{ km/h}$) effectively purge the air shed.

### 3. Tree Ensembles Rival Deep Learning on $N = 700$ Samples
- With 700 daily samples, **XGBoost (RMSE 15.1 $\mu\text{g/m}^3$)** and **Random Forest (RMSE 15.4 $\mu\text{g/m}^3$)** closely match **LSTM (RMSE 14.8 $\mu\text{g/m}^3$)**, while offering $3\times$ lower inference latency and zero GPU dependency. All three ML models significantly outperform the official Persistence baseline (RMSE 17.9 $\mu\text{g/m}^3$).

---

## 📊 CPCB Air Quality Index Distribution (700-Day Study)

Calculated using Central Pollution Control Board (CPCB) 24-hour PM2.5 concentration breakpoints:

| CPCB Category | PM2.5 Range | Days Observed | Share (%) | Status |
|---|---|---|---|---|
| **Satisfactory** | 31 – 60 $\mu\text{g/m}^3$ | **366** | **52.3%** | Moderate air shed health |
| **Moderate** | 61 – 90 $\mu\text{g/m}^3$ | **151** | **21.6%** | Sensitive group advisory |
| **Poor** | 91 – 120 $\mu\text{g/m}^3$ | **84** | **12.0%** | Graded Response Action Plan (GRAP) Phase I |
| **Very Poor** | 121 – 250 $\mu\text{g/m}^3$ | **59** | **8.4%** | GRAP Phase II / III enforcement |
| **Good** | 0 – 30 $\mu\text{g/m}^3$ | **40** | **5.7%** | Clean monsoon washout windows |
| **Severe** | $> 250\text{ }\mu\text{g/m}^3$ | **0** | **0.0%** | *Smoothed by spatial atmospheric model* |

---

## 📈 ML Predictive Model Benchmark (Test Set: Aug – Nov 2024)

Evaluated across the 105-day chronological test partition (17 August 2024 to 30 November 2024):

| Model Architecture | Type | Test RMSE ($\mu\text{g/m}^3$) | MAE ($\mu\text{g/m}^3$) | $R^2$ Score | Latency |
|---|---|---|---|---|---|
| **Bidirectional LSTM** | Recurrent Neural Network | **14.8** 🏆 | **11.2** 🏆 | **0.88** 🏆 | 12 ms |
| **XGBoost Regressor** | Gradient Boosted Trees | **15.1** | **11.5** | **0.87** | **4 ms** ⚡ |
| **Random Forest** | Bagged Tree Ensemble | **15.4** | **11.9** | **0.86** | 8 ms |
| **Persistence (Baseline)** | Naïve Tomorrow = Today | **17.9** | **14.1** | **0.79** | 0.1 ms |

---

## 🌿 Multi-Domain Sustainability Score Formula

The platform features an integrated **Sustainability Index ($0 - 100$)** formulated in the thesis:

$$\text{Sustainability Score} = 100 - 100 \times \Big( 0.50 \cdot \text{norm\_PM2.5} + 0.30 \cdot \text{norm\_Demand} + 0.20 \cdot \text{norm\_WeatherStress} \Big)$$

Where:
- $\text{norm\_PM2.5} = \frac{\text{PM2.5} - 15.3}{214.0 - 15.3}$
- $\text{norm\_Demand} = \frac{\text{Demand} - 2121.3}{7361.1 - 2121.3}$
- $\text{norm\_WeatherStress} = \frac{|\text{Temp} - 24.0|}{16.0}$ (absolute thermal comfort distance from 24 °C)

**Study Window Distribution**: Mean = **67.8**, Minimum = **12.8**, Maximum = **90.9**.

---

## 🗂️ Data Sources & Pipeline

The pipeline synthesizes three raw sources into the master synchronization table:

```
data/
├── delhi_daily_master.csv                         # Master integrated dataset (700 rows, 34 columns)
├── powerdemand_5min_2021_to_2024_with weather.csv # 5-min power demand readings (393,440 rows)
├── delhi_air_quality_2023_2025_daily (1).csv      # Daily ground/atmospheric pollutant observations
└── kaggel_weather_2013_to_2024.csv                # Daily meteorological station series
```

### 18 Model Input Features:
- **Air Quality**: PM2.5, PM10, $\text{NO}_2$, $\text{CO}$ (scaled), $\text{SO}_2$, $\text{O}_3$, Dust ($\log$-transformed)
- **Meteorology**: Ambient Temperature, Relative Humidity, Wind Speed, Precipitation, Sea-Level Pressure
- **Energy Demand**: Mean Power Demand (MW), Peak Power Demand (MW)
- **Temporal & Calendar**: Weekend Indicator, Gazetted Holiday Indicator, $\sin(\text{month})$, $\cos(\text{month})$

---

## 💻 Tech Stack & Architecture

- **Framework**: Next.js 16.4 (App Router) + React 19.3
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS v4 (Obsidian/Zinc Dark Palette, Functional Emerald/Amber/Rose Alerts)
- **Visualization**: Recharts 3.10 (Composed Multi-Axis Charts, Scatter Matrices, Confidence Bands)
- **Icons**: Lucide React
- **Packaging**: Turbopack & standalone production builds

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.18 or higher (v20+ recommended)
- **npm** or **pnpm**

### Installation

```bash
# Navigate to project directory
cd "PROJECT Pandaphile"

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Compile and build production-optimized static & server bundle
npm run build

# Start the production server
npm run start
```

---

## 📂 Project Directory Structure

```
PROJECT Pandaphile/
├── app/
│   ├── globals.css                        # Dark-mode styling, industrial scrollbars
│   ├── layout.tsx                         # App layout with DESA metadata
│   └── page.tsx                           # Master dashboard orchestrator
├── components/
│   ├── delhi/
│   │   ├── AirQualityKpis.tsx             # CPCB PM2.5, PM10, gases, temp/wind metrics
│   │   ├── AqiCategoryDistribution.tsx    # 700-day CPCB category breakdown
│   │   ├── TemporalAirQualityChart.tsx    # Multi-line PM2.5/PM10 vs NAAQS limits (60/100)
│   │   ├── DailyMasterTable.tsx           # Paginated, sortable 700-day master table
│   │   ├── EnergyTopMetrics.tsx           # 8,632 MW peak, mean demand, peak-load ratio
│   │   ├── SeasonalEnergyChart.tsx        # Inverse seasonal divergence overlay
│   │   ├── DiurnalDemandChart.tsx         # 5-min 24h diurnal curve (Summer vs Winter)
│   │   ├── MultiDomainCorrelationMatrix.tsx # Correlation cards & interactive scatter plot
│   │   ├── PredictionChart.tsx            # Test set actuals vs LSTM, XGBoost, RF, Persistence
│   │   ├── ModelScorecard.tsx             # Comparative quantitative metrics grid
│   │   └── ScenarioSandbox.tsx            # Multi-domain what-if simulator & SHAP weights
│   └── layout/
│       ├── Header.tsx                     # Header with time scope filter & CSV export
│       └── Sidebar.tsx                    # Three primary view navigators & study metadata
├── lib/
│   ├── delhiData.ts                       # Typed dataset & precomputed empirical statistics
│   └── utils.ts                           # Tailwind merger & CSV exporter utilities
├── scripts/
│   └── build_data.py                      # Data ETL script converting CSVs to TypeScript
└── types/
    └── dashboard.ts                       # Strongly-typed TypeScript interfaces
```

---

## 📜 Regulatory Reference & Compliance

- **Central Pollution Control Board (CPCB)** National Ambient Air Quality Standards (NAAQS):
  - 24-Hour PM2.5 Limit: **60 $\mu\text{g/m}^3$**
  - 24-Hour PM10 Limit: **100 $\mu\text{g/m}^3$**
- **State Load Despatch Centre (SLDC) Delhi**: Continuous 5-minute grid demand validation.
- **Continuous Emission Monitoring System (CEMS)** & Online Continuous Emission Monitoring System (OCEMS) 2026 guidelines.

---

## 📄 License
This project is developed for environmental and energy analytics research under the **MIT License**.
