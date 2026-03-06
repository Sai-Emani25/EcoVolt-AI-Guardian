import { EnergyData, EnvironmentData, Anomaly } from './types';

export const generateEnergyData = (): EnergyData[] => {
  const data: EnergyData[] = [];
  const now = new Date();
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000);
    data.push({
      timestamp: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      solar: Math.max(0, 50 + 40 * Math.sin((i / 24) * Math.PI * 2 - Math.PI / 2)),
      wind: 30 + Math.random() * 20,
      demand: 60 + Math.random() * 30,
      windSpeed: 12 + Math.random() * 8,
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
    });
  }
  return data;
};

export const generateEnvironmentData = (): EnvironmentData[] => {
  const data: EnvironmentData[] = [];
  const now = new Date();
  for (let i = 10; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000);
    data.push({
      timestamp: time.toLocaleTimeString([], { hour: '2-digit' }),
      pm25: 15 + Math.random() * 10,
      co2: 400 + Math.random() * 50,
      humidity: 45 + Math.random() * 10,
      temp: 22 + Math.random() * 5,
    });
  }
  return data;
};

export const MOCK_ANOMALIES: Anomaly[] = [
  {
    id: '1',
    type: 'Equipment',
    severity: 'High',
    message: 'Solar Inverter Failure at Sector 4 - Efficiency dropped by 85%',
    timestamp: '10 mins ago',
  },
  {
    id: '2',
    type: 'Pollution',
    severity: 'Medium',
    message: 'PM2.5 spike detected in Bangalore South Industrial Zone',
    timestamp: '45 mins ago',
  },
  {
    id: '3',
    type: 'Climate',
    severity: 'Low',
    message: 'Unusual wind pattern detected near Gadag Wind Farm',
    timestamp: '2 hours ago',
  },
];

export const TECHNICAL_REPORT_MARKDOWN = `
# Project: EcoVolt AI Guardian - Sustainable Tech & Environmental Monitoring

## 1. Problem Statement & Impact
Global energy systems are transitioning to renewables, but solar and wind are intermittent. Meanwhile, rapid urbanization in regions like **Karnataka, India** leads to critical air pollution and deforestation. 
**Impact Goals:**
- Reduce energy waste by **20%** through precise forecasting.
- Real-time monitoring of urban pollution (PM2.5) to trigger health alerts.
- Early detection of ecosystem degradation using satellite imagery.

## 2. Data Pipeline
1. **Collection:** 
   - **Weather:** OpenWeatherMap API (Solar radiation, wind speed).
   - **Pollution:** CPCB (Central Pollution Control Board) India real-time sensors.
   - **Imagery:** Copernicus Sentinel-2 (10m resolution) via Google Earth Engine.
2. **Cleaning:** Outlier removal using Z-score, interpolation for missing sensor data.
3. **Augmentation:** Synthetic data generation for rare anomaly events (e.g., extreme pollution spikes).

## 3. Model Architecture
### Energy Forecasting (LSTM)
\`\`\`python
import tensorflow as tf
from tensorflow.keras.layers import LSTM, Dense, Dropout

def build_forecasting_model(input_shape):
    model = tf.keras.Sequential([
        LSTM(64, return_sequences=True, input_shape=input_shape),
        Dropout(0.2),
        LSTM(32),
        Dense(16, activation='relu'),
        Dense(1) # Predicts next hour output
    ])
    model.compile(optimizer='adam', loss='mae')
    return model
\`\`\`

### Environmental Monitoring (U-Net for Deforestation)
\`\`\`python
# Simplified U-Net for Satellite Image Segmentation
def unet_block(inputs, filters):
    x = tf.keras.layers.Conv2D(filters, 3, padding="same", activation="relu")(inputs)
    x = tf.keras.layers.Conv2D(filters, 3, padding="same", activation="relu")(x)
    return x
# ... full architecture available in Colab notebook
\`\`\`

## 4. Deployment
- **Web App:** React/Vite dashboard for utility operators.
- **Edge:** Raspberry Pi 4 with DHT22 and SDS011 sensors for local air quality.
- **Cloud:** Google Cloud IoT Core for device management and BigQuery for historical analysis.

## 5. Metrics
- **Energy Forecast:** Mean Absolute Error (MAE) < 5% for 24h horizon.
- **Pollution Prediction:** R-squared > 0.85.
- **Deforestation Detection:** F1-Score > 0.92 on Sentinel-2 dataset.

## 6. Scalability & Ethics
- **Privacy:** Anonymizing precise GPS coordinates of small-scale farmers.
- **Bias:** Ensuring pollution models are trained on diverse urban/rural sensor distributions.
- **Scalability:** Horizontal scaling of inference workers using Kubernetes.
`;
