export interface EnergyData {
  timestamp: string;
  solar: number;
  wind: number;
  demand: number;
  windSpeed: number;
  windDirection: string;
}

export interface EnvironmentData {
  timestamp: string;
  pm25: number;
  co2: number;
  humidity: number;
  temp: number;
}

export interface Anomaly {
  id: string;
  type: 'Equipment' | 'Pollution' | 'Climate';
  severity: 'Low' | 'Medium' | 'High';
  message: string;
  timestamp: string;
}
