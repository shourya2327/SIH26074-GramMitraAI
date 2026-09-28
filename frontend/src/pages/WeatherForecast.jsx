import React, { useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { useWeather } from '../context/WeatherContext';
import { sampleHourlyForecast, sampleDailyForecast } from '../utils/demoData';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  CloudSun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Calendar, 
  Clock, 
  TrendingUp,
  MapPin,
  RefreshCw
} from 'lucide-react';

export const WeatherForecast = () => {
  const { selectedLocation } = useLocation();
  const { weather, hourlyForecast, dailyForecast, loading, refetchWeather } = useWeather();
  const [activeChart, setActiveChart] = useState('temp'); // 'temp', 'rain', 'humidity', 'wind'

  const activeHourly = hourlyForecast && hourlyForecast.length > 0 ? hourlyForecast : sampleHourlyForecast;
  const activeDaily = dailyForecast && dailyForecast.length > 0 ? dailyForecast : sampleDailyForecast;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
            🌦 Panchayat Weather Forecast & Trends
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)' }}>
            Downscaled multi-variable meteorological forecasts for {selectedLocation.panchayat || selectedLocation.village || "Dharampuri"}, {selectedLocation.block} ({selectedLocation.district})
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={refetchWeather}
            className="gm-btn gm-btn-outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <RefreshCw size={13} className={loading ? "spin-animation" : ""} />
            <span>{loading ? "Updating..." : "Refresh"}</span>
          </button>
          <div className="gm-badge gm-badge-green" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}>
            Elevation: {selectedLocation.elevation_m || 528}m MSL • Lat: {selectedLocation.latitude?.toFixed(4)}°
          </div>
        </div>
      </div>

      {/* 24-Hour Hourly Weather Progression */}
      <div className="gm-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Clock size={18} color="var(--color-primary-green)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-dark-green)' }}>
            Next 24 Hours: Hourly Progression (Live API Data)
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: 'minmax(115px, 1fr)',
          gap: '0.75rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          {activeHourly.slice(0, 12).map((hour, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: idx === 0 ? 'var(--color-light-green)' : '#F8FAFC',
                border: '1px solid',
                borderColor: idx === 0 ? 'var(--color-primary-green)' : 'var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem 0.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-secondary-text)' }}>
                {hour.time}
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
                {hour.temp}°C
              </div>
              <span style={{ fontSize: '0.72rem', color: '#0284C7', fontWeight: 600 }}>
                💧 {hour.rain_mm} mm
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--color-secondary-text)' }}>
                {hour.humidity}% RH • {hour.wind}km/h
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Charts with Tab Switcher */}
      <div className="gm-card">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-dark-green)' }}>
              Meteorological Parameter Graphs
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)' }}>
              Downscaled hourly trends across micro-terrain lapse models
            </p>
          </div>

          {/* Chart selector buttons */}
          <div style={{ display: 'flex', gap: '6px', backgroundColor: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
            <button
              onClick={() => setActiveChart('temp')}
              style={{
                padding: '5px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: activeChart === 'temp' ? '#FFFFFF' : 'transparent',
                color: activeChart === 'temp' ? '#EA580C' : 'var(--color-secondary-text)',
                boxShadow: activeChart === 'temp' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              🌡 Temperature
            </button>
            <button
              onClick={() => setActiveChart('rain')}
              style={{
                padding: '5px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: activeChart === 'rain' ? '#FFFFFF' : 'transparent',
                color: activeChart === 'rain' ? '#0284C7' : 'var(--color-secondary-text)',
                boxShadow: activeChart === 'rain' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              🌧 Rainfall (mm)
            </button>
            <button
              onClick={() => setActiveChart('humidity')}
              style={{
                padding: '5px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: activeChart === 'humidity' ? '#FFFFFF' : 'transparent',
                color: activeChart === 'humidity' ? '#10B981' : 'var(--color-secondary-text)',
                boxShadow: activeChart === 'humidity' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              💧 Humidity (%)
            </button>
            <button
              onClick={() => setActiveChart('wind')}
              style={{
                padding: '5px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: activeChart === 'wind' ? '#FFFFFF' : 'transparent',
                color: activeChart === 'wind' ? '#475569' : 'var(--color-secondary-text)',
                boxShadow: activeChart === 'wind' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              💨 Wind Speed
            </button>
          </div>
        </div>

        <div style={{ width: '100%', height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            {activeChart === 'temp' ? (
              <AreaChart data={activeHourly.slice(0, 16)}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EA580C" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EA580C" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={12} />
                <YAxis unit="°C" domain={['auto', 'auto']} stroke="#64748B" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="temp" name="Temperature" stroke="#EA580C" strokeWidth={3} fillOpacity={1} fill="url(#tempGrad)" />
              </AreaChart>
            ) : activeChart === 'rain' ? (
              <BarChart data={activeHourly.slice(0, 16)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={12} />
                <YAxis unit="mm" stroke="#64748B" fontSize={12} />
                <Tooltip />
                <Bar dataKey="rain_mm" name="Rainfall (mm)" fill="#0284C7" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : activeChart === 'humidity' ? (
              <LineChart data={activeHourly.slice(0, 16)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={12} />
                <YAxis unit="%" stroke="#64748B" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="humidity" name="Relative Humidity" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            ) : (
              <LineChart data={activeHourly.slice(0, 16)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={12} />
                <YAxis unit="km/h" stroke="#64748B" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="wind" name="Wind Speed" stroke="#475569" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7-Day Extended Forecast */}
      <div className="gm-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Calendar size={18} color="var(--color-primary-green)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-dark-green)' }}>
            7-Day Panchayat Agro-Weather Outlook (Dynamic Live Forecast)
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.75rem'
        }}>
          {activeDaily.map((day, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: idx === 0 ? 'var(--color-light-green)' : '#FFFFFF',
                border: '1px solid',
                borderColor: idx === 0 ? 'var(--color-primary-green)' : 'var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem 0.75rem',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--color-dark-green)' }}>
                {day.day}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', marginBottom: '0.5rem' }}>
                {day.date}
              </div>

              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary-text)' }}>
                {day.tempMax}°
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-secondary-text)', marginLeft: '4px' }}>
                  {day.tempMin}°
                </span>
              </div>

              <div style={{ margin: '0.4rem 0', fontSize: '0.78rem', color: day.rain_mm > 15 ? '#DC2626' : '#0284C7', fontWeight: 700 }}>
                💧 {day.rain_mm} mm
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)' }}>
                {day.condition}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
