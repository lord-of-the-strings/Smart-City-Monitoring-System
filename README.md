# Smart-City-Monitoring-System
# Smart City Environmental Monitoring and Sustainability Analytics System

CS24204 IT Workshop

Team: Tejas Jhunjhunwala, Aadity Setu, Pranay Mallick, Swarnabh Guha, Krish Vatshal

## Overview

This project integrates Delhi air quality, weather and electricity demand data into one daily dataset, computes sustainability indicators, and trains models to predict next-day PM2.5.

- City: Delhi, India
- Resolution: daily
- Study window: 1 Jan 2023 to 30 Nov 2024 (700 days)
- Target: PM2.5 on the next day (µg/m³)
- Traffic is out of scope because no suitable daily Delhi series was available.

## Data

| Domain | Source file | Period | Frequency |
|---|---|---|---|
| Air quality | Delhi air quality (daily) | 2023 to 2025 | Daily |
| Weather | Kaggle weather dataset | 2013 to 2024 | Daily |
| Energy | Delhi power demand | 2021 to 2024 | 5 minutes |

Confirm and cite the original provider of each file before submission. The air quality data is probably modelled, not measured by ground sensors.

## Pipeline

1. Each source must be cleaned properly (duplicates, outliers, derived columns).
2. Aggregate energy demand to daily mean and peak. Days with under 80% coverage are interpolated.
3. Merge on date and keep the overlap window.
4. Add calendar features, lags and rolling means.
5. Compute the AQI category (CPCB breakpoints), peak-load ratio and a 0 to 100 sustainability score.
6. Split chronologically (70/15/15), fit the scaler on training days only, and build 7-day windows.

Output: `delhi_daily_master.csv` (700 rows, 34 columns).

## Model

- Input: 7 days of 18 features
- Output: change in PM2.5 from the last input day, added back to give next-day PM2.5
- LSTM: `LSTM(32) > Dropout(0.3) > Dense(16) > Dense(1)`, Adam, MSE, EarlyStopping
- Baselines: persistence, Ridge regression, Random Forest

## Results (test set, 106 days)

| Model | RMSE | MAE | R² |
|---|---|---|---|
| Persistence | 17.94 | 12.95 | 0.760 |
| Ridge | 17.43 | 12.57 | 0.774 |
| Random Forest | 17.20 | 12.52 | 0.780 |
| LSTM (5-seed mean) | 17.66 | 12.76 | 0.768 |

Errors are in µg/m³. With 700 days, simple models perform as well as the LSTM, and PM2.5 history carries most of the predictive information.


## Limitations

- Single location, 700 days, probably modelled air quality.
- The test period covers the autumn rise in pollution, which training only partly represents.
- 19 energy days in the study window are interpolated.
## Contributors
Thank you to everyone who has contributed to this project! See [CONTRIBUTORS.md](CONTRIBUTORS.md) for the full list.
