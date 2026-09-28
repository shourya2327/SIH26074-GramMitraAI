import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from './LocationContext';
import { fetchPanchayatWeather } from '../services/weatherService';

const WeatherContext = createContext(null);

export const WeatherProvider = ({ children }) => {
  const { selectedLocation } = useLocation();

  const [weather, setWeather] = useState(null);
  const [rawBlockWeather, setRawBlockWeather] = useState(null);
  const [downscalingFactors, setDownscalingFactors] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);

  // Keep track of the last fetched location key to prevent redundant requests
  const lastCoordsRef = useRef('');

  const loadWeatherForLocation = useCallback(async (loc, force = false) => {
    if (!loc || typeof loc.latitude !== 'number' || typeof loc.longitude !== 'number') {
      setError("स्थान का चयन अमान्य है। / Selected location has invalid coordinates.");
      setLoading(false);
      return;
    }

    const coordsKey = `${loc.latitude.toFixed(4)},${loc.longitude.toFixed(4)},${loc.panchayat || ''}`;
    if (!force && coordsKey === lastCoordsRef.current && weather) {
      return; // already have data for this location
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchPanchayatWeather(loc);
      setWeather(result.weather);
      setRawBlockWeather(result.rawBlockWeather);
      setDownscalingFactors(result.downscalingFactors);
      setHourlyForecast(result.hourlyForecast);
      setDailyForecast(result.dailyForecast);
      setLastFetchedAt(new Date());
      lastCoordsRef.current = coordsKey;
      setError(null);
    } catch (err) {
      console.error("WeatherContext fetch error:", err);
      setError(err.message || "मौसम डेटा प्राप्त करने में विफल। / Failed to fetch dynamic weather data.");
      // Do NOT set fake weather here!
    } finally {
      setLoading(false);
    }
  }, [weather]);

  // Automatically fetch whenever selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      loadWeatherForLocation(selectedLocation);
    }
  }, [selectedLocation?.latitude, selectedLocation?.longitude, selectedLocation?.panchayat]);

  const refetchWeather = useCallback(() => {
    if (selectedLocation) {
      loadWeatherForLocation(selectedLocation, true);
    }
  }, [selectedLocation, loadWeatherForLocation]);

  return (
    <WeatherContext.Provider value={{
      weather,
      rawBlockWeather,
      downscalingFactors,
      hourlyForecast,
      dailyForecast,
      loading,
      error,
      refetchWeather,
      lastFetchedAt
    }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};
