# 📈 SmartBroker

## Summary
AI-driven investment framework for market analysis and automated income strategies.

## What this project is
SmartBroker is a Python-based research and simulation framework focused on **AI‑assisted income investing**. It provides a complete pipeline for downloading historical market data, engineering sophisticated technical and yield-related features, training machine learning models to predict risk-adjusted outperformance, and performing realistic backtests that account for taxes, commissions, and dividend reinvestment.

The project also includes automated notification utilities to bridge the gap between model predictions and real-time alerts.

## How it works

### Data Pipeline and Feature Engineering
The core of SmartBroker is a robust data ingestion and processing engine:

1. **Market Data Integration:** Uses financial APIs to fetch adjusted close prices, historical dividend records, and benchmark data (e.g., SPY) for a wide range of tickers.
2. **Technical Indicator Analysis:** Leverages specialized libraries to compute key metrics, including:
   - **Trend Analysis:** Moving averages (SMA 50/200) and relative distance metrics.
   - **Momentum & Strength:** Relative Strength Index (RSI) and volatility measures.
   - **Income Metrics:** Dynamic calculation of trailing 12-month dividend yields.
3. **Alpha Target Generation:** Calculates "Target Alpha" by comparing the forward returns of individual stocks against a benchmark, allowing the model to learn which features predict excess performance rather than just general market movement.

### AI Scoring and Strategy Logic
The project employs a supervised learning approach to identify high-potential investment candidates:

- **Predictive Modeling:** A `RandomForestRegressor` is trained on expanding windows of historical data. The model learns the relationship between technical features and future risk-adjusted returns.
- **Dynamic Risk Filtering:** Implements a "Kill Switch" logic where candidates failing certain technical criteria (e.g., trading below their 200-day moving average) are automatically disqualified, regardless of their AI score.
- **Portfolio Selection:** Top-scoring candidates that pass all risk filters are selected for the simulated portfolio, with capital allocated according to pre-defined strategy rules.

### Realistic Backtesting Engine
SmartBroker goes beyond simple price simulations by modeling real-world constraints:

- **Friction Modeling:** Accounts for fixed and variable trading commissions.
- **Tax Awareness:** Simulates the impact of capital gains and dividend taxes on overall portfolio growth.
- **Flexible Rebalancing:** Supports both monthly and weekly rebalancing frequencies. The weekly engine includes "smart rebalancing" logic that avoids unnecessary trades if the ideal portfolio basket remains stable, minimizing costs.
- **Income Tracking:** Specifically tracks net dividend income as a primary performance metric alongside capital appreciation.

### Automated Notifications
Integrated notification modules allow the system to transmit model signals and portfolio alerts directly to messaging platforms (like Telegram), enabling a seamless transition from research to monitoring.

## Technologies and tools
- **Language:** Python 3.13+
- **Data Science:** `pandas`, `NumPy`, and `scikit-learn` for modeling and analysis.
- **Financial Analysis:** `yfinance` for data sourcing and `pandas-ta` for technical indicators.
- **Integration:** Telegram Bot API for automated alerts and monitoring.
- **Visualization:** `matplotlib` for performance and risk-reward charting.
