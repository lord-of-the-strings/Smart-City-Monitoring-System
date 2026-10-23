export type AQICategory = 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';

export type TimeScope = 'all-700d' | 'test-106d' | 'stubble' | 'summer-peak';

export type TabView = 'air-quality' | 'energy-correlation' | 'ml-prediction';

export interface DelhiDailyRecord {
  date: string;
  pm25: number;
  pm10: number;
  temp: number;
  humidity: number;
  windspeed: number;
  precip: number;
  pressure: number;
  demandMean: number;
  demandPeak: number;
  peakLoadRatio: number;
  season: string;
  stubbleSeason: number;
  isWeekend: number;
  isHoliday: number;
  nextDayPM25: number | null;
  aqiCategory: string;
  sustainabilityScore: number;
  co: number;
  no2: number;
  so2: number;
  o3: number;
  dustLog: number;
}

export interface ModelBenchmark {
  id: string;
  name: string;
  shortCode: string;
  type: string;
  rmse: number;
  mae: number;
  r2: number;
  latencyMs: number;
  isBestRMSE?: boolean;
  isBestMAE?: boolean;
  isBestR2?: boolean;
  isBestLatency?: boolean;
  description: string;
}

export interface TestPredictionPoint {
  date: string;
  actual: number;
  persistence: number;
  lstm: number;
  randomForest: number;
  xgboost: number;
  ciUpper: number;
  ciLower: number;
  stubbleSeason: boolean;
  aqiCategory: string;
}

export interface MonthlyStat {
  month: string;
  pm25: number;
  temp: number;
  windspeed: number;
  demandMean: number;
  demandPeak: number;
  sustainabilityScore: number;
}

export interface DiurnalCurvePoint {
  time: string;
  summerDemand: number;
  winterDemand: number;
}

export interface CategoryDistribution {
  category: string;
  days: number;
  percentage: number;
  color: string;
  bg: string;
  border: string;
  range: string;
}
