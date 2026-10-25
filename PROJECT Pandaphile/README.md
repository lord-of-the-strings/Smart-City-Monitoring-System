# Smart City Monitoring System
### Delhi Environmental Monitoring & Sustainability Analytics Platform (DESA)

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-v3.10-22c55e?style=flat-square)](https://recharts.org/)
[![Jupyter Notebook](https://img.shields.io/badge/Jupyter-SmartCity.ipynb-orange?style=flat-square&logo=jupyter)](notebook/SmartCity.ipynb)
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
| **Model Source** | [`notebook/SmartCity.ipynb`](notebook/SmartCity.ipynb) |
| **Evaluation Split** | Chronological 70% Train / 15% Validation / 15% Test (105 Days) |
| **Naïve Baseline** | Persistence (Tomorrow = Today): Test RMSE **17.937 $\mu\text{g/m}^3$** |
| **Top Model** | Random Forest Regressor: Test RMSE **17.185 $\mu\text{g/m}^3$**, $R^2 = 0.780$ |

---

## 🔬 Core Empirical Findings & Research Insights

### 1. Inverse Seasonality of Energy & Air Pollution ($r = -0.28$)
- **Power Demand Peak**: Reaches its maximum during the **June summer heatwaves** (June monthly average ~4,860 MW; all-time historic Delhi grid peak of **8,631.5 MW recorded on 19 June 2024**) driven by extreme residential and commercial air-conditioning cooling loads.
- **Particulate Peak**: Reaches its maximum during **November and January** (averaging 109 to 121 $\mu\text{g/m}^3$) driven by post-monsoon agricultural stubble burning (Oct–Nov) combined with winter nocturnal thermal inversions and calm boundary layers.
- **Thesis Conclusion**: The negative correlation between energy demand and PM2.5 is **seasonal, not causal**.

### 2. Atmospheric Dispersion Coupling
- **Temperature vs. PM2.5 ($r = -0.60$)**: Strong negative correlation. Low surface temperatures create nocturnal atmospheric inversions that trap ground-level vehicular and industrial emissions. Summer convective thermal plumes rapidly disperse particulates.
- **Wind Speed vs. PM2.5 ($r = -0.44$)**: Calm winds ($< 8\text{ km/h}$) cause toxic smog stagnation; breezes ($> 20\text{ km/h}$) effectively purge the air shed.

### 3. Notebook Machine Learning Benchmark & Ablation Study (`SmartCity.ipynb`)
- **Random Forest (300 estimators)** achieved the highest test accuracy (**RMSE 17.185 $\mu\text{g/m}^3$**, $R^2 = 0.780$), closely followed by **Ridge Regression (RMSE 17.433)** and **Bidirectional LSTM (RMSE 17.659)**.
- **Ablation Study Finding**: In Cell 8 of the notebook, an ablation experiment revealed that **"PM2.5 history only"** achieves **RMSE 16.873 $\mu\text{g/m}^3$ and $R^2 = 0.788$**, confirming that short-term 24-hr pollution is strongly dominated by autoregressive persistence ($r = 0.85$), while energy and weather operate over multi-day synoptic timescales.

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

## 📈 ML Predictive Model Benchmark (`SmartCity.ipynb`)

Evaluated across the 105-day chronological test partition (18 August 2024 to 30 November 2024):

| Model Architecture | Type | Test RMSE ($\mu\text{g/m}^3$) | MAE ($\mu\text{g/m}^3$) | $R^2$ Score | Rank |
|---|---|---|---|---|---|
| **Random Forest** | 300 Trees, min_samples_leaf=5 | **17.185** 🏆 | **12.506** 🏆 | **0.780** 🏆 | Top Performer |
| **Ridge Regression** | Regularized L2 Linear ($\alpha=100$) | **17.433** | **12.568** | **0.774** | Strong Linear Baseline |
| **LSTM Recurrent Network** | 32 units, Dropout 0.3, Dense 16 | **17.659** | **12.762** | **0.768** | 5-Seed Sequence Ensemble |
| **Persistence (Baseline)** | Naïve Tomorrow = Today | **17.937** | **12.950** | **0.760** | Benchmark to Beat |

### Feature Ablation Study (`SmartCity.ipynb` Cell 8):

| Feature Subset | Omitted Inputs | Test RMSE | MAE | $R^2$ |
|---|---|---|---|---|
| **PM2.5 history only** | Drop weather, energy & other gases | **16.873** | **12.422** | **0.788** |
| **Without other pollutants** | Drop PM10, $\text{NO}_2$, $\text{CO}$, $\text{SO}_2$, $\text{O}_3$, dust | **17.388** | **12.755** | **0.775** |
| **Without energy features** | Drop demand_mean, demand_peak | **17.549** | **12.679** | **0.771** |
| **Without weather features** | Drop temp, humidity, wind, precip, pressure | **17.634** | **12.743** | **0.768** |
| **All 18 features** | Full multi-domain integration | **17.659** | **12.749** | **0.768** |

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

```
data/
├── delhi_daily_master.csv                         # Master integrated dataset (700 rows, 34 columns)
├── powerdemand_5min_2021_to_2024_with weather.csv # 5-min power demand readings (393,440 rows)
├── delhi_air_quality_2023_2025_daily (1).csv      # Daily ground/atmospheric pollutant observations
└── kaggel_weather_2013_to_2024.csv                # Daily meteorological station series

notebook/
└── SmartCity.ipynb                                # Official model training, ablation & loss curves
```

---

## 💻 Tech Stack & Architecture

- **Framework**: Next.js 16.4 (App Router) + React 19.3
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS v4 (Obsidian/Zinc Dark Palette, Functional Emerald/Amber/Rose Alerts)
- **Visualization**: Recharts 3.10 (Composed Multi-Axis Charts, Scatter Matrices, Confidence Bands)
- **Machine Learning Integration**: Python 3, TensorFlow / Keras, Scikit-Learn

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
│   └── delhi/
│       ├── AirQualityKpis.tsx             # CPCB PM2.5, PM10, gases, temp/wind metrics
│       ├── AqiCategoryDistribution.tsx    # 700-day CPCB category breakdown
│       ├── TemporalAirQualityChart.tsx    # Multi-line PM2.5/PM10 vs NAAQS limits (60/100)
│       ├── DailyMasterTable.tsx           # Paginated, sortable 700-day master table
│       ├── EnergyTopMetrics.tsx           # 8,632 MW peak, mean demand, peak-load ratio
│       ├── SeasonalEnergyChart.tsx        # Inverse seasonal divergence overlay
│       ├── DiurnalDemandChart.tsx         # 5-min 24h diurnal curve (Summer vs Winter)
│       ├── MultiDomainCorrelationMatrix.tsx # Correlation cards & interactive scatter plot
│       ├── PredictionChart.tsx            # Test set actuals vs RF, LSTM, Ridge, Persistence
│       ├── ModelScorecard.tsx             # Leaderboard, ablation study & notebook plots
│       ├── NotebookPredictionsTable.tsx   # Day-by-day test set predictions table with CSV export
│       └── ScenarioSandbox.tsx            # Multi-domain what-if simulator & SHAP weights
├── lib/
│   ├── notebookModelData.ts               # Exact predictions & metrics from SmartCity.ipynb
│   ├── delhiData.ts                       # Typed dataset & precomputed empirical statistics
│   └── utils.ts                           # Tailwind merger & CSV exporter utilities
├── public/
│   ├── loss_curve.png                     # Extracted from SmartCity.ipynb Cell 7
│   └── predicted_vs_actual.png            # Extracted from SmartCity.ipynb Cell 7
└── types/
    └── dashboard.ts                       # Strongly-typed TypeScript interfaces
```

---

## 📄 License
This project is developed for environmental and energy analytics research under the **MIT License**.
