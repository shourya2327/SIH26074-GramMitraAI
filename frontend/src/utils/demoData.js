export const initialLocation = {
  latitude: 22.9734,
  longitude: 75.8267,
  address: "Dharampuri Village, Sanwer Road",
  village: "Dharampuri",
  panchayat: "Dharampuri",
  block: "Sanwer",
  district: "Indore",
  state: "Madhya Pradesh",
  elevation_m: 528.0,
  ndvi: 0.62,
  distance_to_water_km: 1.2
};

export const samplePanchayats = [
  {
    id: 1,
    name: "Dharampuri",
    block: "Sanwer",
    district: "Indore",
    state: "Madhya Pradesh",
    lat: 22.9734,
    lng: 75.8267,
    elevation: 528,
    temp: 28.5,
    humidity: 72,
    rainfall_mm: 18.5,
    risk: "Moderate",
    soil: "Black Clay Loam",
    ndvi: 0.62
  },
  {
    id: 2,
    name: "Kshipra",
    block: "Sanwer",
    district: "Indore",
    state: "Madhya Pradesh",
    lat: 22.9912,
    lng: 75.8645,
    elevation: 535,
    temp: 27.2,
    humidity: 84,
    rainfall_mm: 38.0,
    risk: "High",
    soil: "Deep Black Vertisol",
    ndvi: 0.58
  },
  {
    id: 3,
    name: "Ajnod",
    block: "Sanwer",
    district: "Indore",
    state: "Madhya Pradesh",
    lat: 22.9450,
    lng: 75.8010,
    elevation: 515,
    temp: 29.8,
    humidity: 64,
    rainfall_mm: 6.2,
    risk: "Normal",
    soil: "Medium Black",
    ndvi: 0.54
  },
  {
    id: 4,
    name: "Betma",
    block: "Depalpur",
    district: "Indore",
    state: "Madhya Pradesh",
    lat: 22.6841,
    lng: 75.6178,
    elevation: 545,
    temp: 28.0,
    humidity: 70,
    rainfall_mm: 12.0,
    risk: "Moderate",
    soil: "Clay Loam",
    ndvi: 0.65
  },
  {
    id: 5,
    name: "Manpur",
    block: "Mhow",
    district: "Indore",
    state: "Madhya Pradesh",
    lat: 22.4285,
    lng: 75.6420,
    elevation: 580,
    temp: 26.5,
    humidity: 78,
    rainfall_mm: 22.5,
    risk: "Moderate",
    soil: "Laterite Loam",
    ndvi: 0.70
  }
];

export const sampleFields = [
  {
    id: 1,
    fieldName: "Khet 1 - North Canal Plot",
    latitude: 22.9741,
    longitude: 75.8273,
    areaAcres: 3.2,
    cropName: "Wheat",
    sowingDate: "2025-11-15",
    soilType: "Black Clay Loam",
    irrigationType: "Drip Irrigation",
    village: "Dharampuri",
    panchayat: "Dharampuri",
    block: "Sanwer",
    district: "Indore",
    state: "Madhya Pradesh",
    boundary: [
      [22.9738, 75.8268],
      [22.9745, 75.8270],
      [22.9743, 75.8279],
      [22.9736, 75.8276]
    ]
  },
  {
    id: 2,
    fieldName: "Khet 2 - East Ridge Farm",
    latitude: 22.9715,
    longitude: 75.8290,
    areaAcres: 4.5,
    cropName: "Soybean",
    sowingDate: "2025-06-25",
    soilType: "Medium Black",
    irrigationType: "Sprinkler",
    village: "Dharampuri",
    panchayat: "Dharampuri",
    block: "Sanwer",
    district: "Indore",
    state: "Madhya Pradesh",
    boundary: [
      [22.9710, 75.8285],
      [22.9720, 75.8288],
      [22.9718, 75.8296],
      [22.9708, 75.8292]
    ]
  },
  {
    id: 3,
    fieldName: "Khet 3 - Kshipra River Basin",
    latitude: 22.9920,
    longitude: 75.8650,
    areaAcres: 2.1,
    cropName: "Gram / Chickpea",
    sowingDate: "2025-11-20",
    soilType: "Deep Black Vertisol",
    irrigationType: "Flood / Furrow",
    village: "Kshipra",
    panchayat: "Kshipra",
    block: "Sanwer",
    district: "Indore",
    state: "Madhya Pradesh",
    boundary: [
      [22.9915, 75.8645],
      [22.9925, 75.8647],
      [22.9922, 75.8655],
      [22.9913, 75.8652]
    ]
  }
];

// NOTE: sampleWeather is deprecated. Real dynamic weather is provided by weatherService.js and useWeather()
export const sampleWeather = {
  temperature: 28.5,
  feelsLike: 30.2,
  rainfall: 14.5,
  humidity: 72,
  windSpeed: 14.2,
  windDirection: "WSW (240°)",
  pressure: 1011.0,
  cloudCover: 68,
  uvIndex: 5.4,
  rainProbability: 78,
  condition: "Scattered Monsoon Showers",
  elevation_m: 528.0,
  downscalingConfidence: 85
};

export const sampleHourlyForecast = [
  { time: "06:00", temp: 24.2, humidity: 88, rainProb: 15, rain_mm: 0.0, wind: 9.5 },
  { time: "09:00", temp: 27.5, humidity: 76, rainProb: 35, rain_mm: 0.8, wind: 12.0 },
  { time: "12:00", temp: 31.0, humidity: 62, rainProb: 65, rain_mm: 4.5, wind: 15.5 },
  { time: "15:00", temp: 32.5, humidity: 58, rainProb: 80, rain_mm: 8.2, wind: 17.0 },
  { time: "18:00", temp: 29.8, humidity: 72, rainProb: 55, rain_mm: 3.0, wind: 13.5 },
  { time: "21:00", temp: 27.0, humidity: 82, rainProb: 30, rain_mm: 0.5, wind: 10.2 },
  { time: "00:00", temp: 25.4, humidity: 86, rainProb: 15, rain_mm: 0.0, wind: 8.5 },
  { time: "03:00", temp: 24.0, humidity: 90, rainProb: 10, rain_mm: 0.0, wind: 7.8 }
];

export const sampleDailyForecast = [
  { day: "Mon (Today)", date: "26 Sep", tempMin: 23.5, tempMax: 32.5, rain_mm: 14.5, rainProb: 78, condition: "Scattered Rain", icon: "rain" },
  { day: "Tue", date: "27 Sep", tempMin: 22.8, tempMax: 31.0, rain_mm: 22.0, rainProb: 85, condition: "Moderate Showers", icon: "thunder" },
  { day: "Wed", date: "28 Sep", tempMin: 23.0, tempMax: 33.0, rain_mm: 5.2, rainProb: 40, condition: "Partly Cloudy", icon: "cloud" },
  { day: "Thu", date: "29 Sep", tempMin: 24.2, tempMax: 34.5, rain_mm: 0.0, rainProb: 10, condition: "Clear Sunny", icon: "sun" },
  { day: "Fri", date: "30 Sep", tempMin: 23.8, tempMax: 33.2, rain_mm: 2.1, rainProb: 25, condition: "Passing Showers", icon: "rain-light" },
  { day: "Sat", date: "01 Oct", tempMin: 22.5, tempMax: 30.5, rain_mm: 32.0, rainProb: 82, condition: "Heavy Rain Gusts", icon: "heavy-rain" },
  { day: "Sun", date: "02 Oct", tempMin: 22.0, tempMax: 29.8, rain_mm: 12.5, rainProb: 65, condition: "Light Rain", icon: "rain" }
];

export const sampleAlerts = [
  {
    id: "ALT-2026-01",
    severity: "ORANGE_ALERT",
    headline: "Moderate to Heavy Rainfall Warning (~20-40mm)",
    expectedTime: "Next 12 - 24 hours",
    description: "Convective rain cells detected over local agricultural blocks. Potential water accumulation in low-lying crop fields.",
    actions: [
      "Open farm field drain furrows immediately to avoid water stagnation",
      "Do NOT apply top-dress urea or foliar chemicals today",
      "Ensure farm tractor and equipment are parked under shelter"
    ]
  }
];

export const sampleShapFeatures = [
  { feature: "Atmospheric Humidity (72%)", importance: 38.5, impact: "+7.8 mm (Moisture convergence)", isPositive: true },
  { feature: "Regional Cloud Cover (68%)", importance: 24.2, impact: "+5.1 mm (Trough movement)", isPositive: true },
  { feature: "Orographic Elevation (528m MSL)", importance: 16.4, impact: "+3.2 mm (Lapse uplift)", isPositive: true },
  { feature: "Vegetation Transpiration (NDVI 0.62)", importance: 12.1, impact: "+1.9 mm (Canopy moisture)", isPositive: true },
  { feature: "Surface Wind Shear (14.2 km/h)", importance: 8.8, impact: "-1.4 mm (Advection dispersion)", isPositive: false }
];

export const sampleAccuracyMetrics = {
  sampleSize: 128,
  temperature: {
    mae: "0.72°C",
    rmse: "1.05°C",
    r2: "0.942",
    rating: "EXCELLENT"
  },
  rainfall: {
    mae: "2.8 mm",
    rmse: "4.1 mm",
    hitRate: "89.4%",
    rating: "VERY HIGH"
  },
  humidity: {
    mae: "4.2%",
    rmse: "5.8%",
    rating: "RELIABLE"
  }
};
