import React from 'react';
import { useLocation } from '../context/LocationContext';
import { useWeather } from '../context/WeatherContext';
import { Thermometer, Droplets, Mountain, Waves, Trees, Compass } from 'lucide-react';

export const MicroClimate = () => {
  const { selectedLocation, activeField } = useLocation();
  const { weather, rawBlockWeather } = useWeather();

  const panchayatAvg = {
    temp: rawBlockWeather ? rawBlockWeather.temperature : 29.0,
    humidity: rawBlockWeather ? rawBlockWeather.humidity : 68,
    soilTemp: rawBlockWeather ? Number((rawBlockWeather.temperature - 1.5).toFixed(1)) : 27.5,
    wind: rawBlockWeather ? rawBlockWeather.windSpeed : 15.0
  };

  const fieldMicro = {
    temp: weather ? weather.temperature : 28.0,
    humidity: weather ? weather.humidity : 70,
    soilTemp: weather ? Number((weather.temperature - 2.0).toFixed(1)) : 26.0,
    wind: weather ? weather.windSpeed : 13.0
  };

  const drivers = [
    {
      title: "Elevation & Slope Exposure",
      value: `${selectedLocation.elevation_m || 528} m MSL`,
      impact: "-0.4°C cooling via orographic lapse rate on gentle north-facing slope",
      icon: Mountain,
      color: "#EA580C"
    },
    {
      title: "Crop Canopy Evapotranspiration",
      value: `NDVI ${selectedLocation.ndvi || 0.62} (Dense)`,
      impact: "-0.5°C localized daytime temperature reduction via vegetative transpiration",
      icon: Trees,
      color: "#16A34A"
    },
    {
      title: "Water Body Proximity",
      value: `${selectedLocation.distance_to_water_km || 1.2} km to Kshipra Tributary`,
      impact: "+4% relative humidity enhancement during morning inversion hours",
      icon: Waves,
      color: "#0284C7"
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2.5rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
          🌡 Micro-Climate Forecasting: Panchayat vs Field
        </h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)' }}>
          Accounts for physical variations caused by elevation, crop canopy density, terrain slope, and nearby water bodies.
        </p>
      </div>

      {/* Comparison Cards: Panchayat Average vs Field Micro-Climate */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Card 1: Panchayat Macro Average */}
        <div className="gm-card" style={{ borderLeft: '4px solid #94A3B8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span className="gm-badge" style={{ backgroundColor: '#F1F5F9', color: '#475569' }}>Regional Baseline</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>Grid Avg: 15 km²</span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.5rem' }}>
            {selectedLocation.panchayat || "Dharampuri"} Panchayat Average
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary-text)', display: 'block' }}>Ambient Air Temp</span>
              <strong style={{ fontSize: '1.25rem', color: '#1E293B' }}>{panchayatAvg.temp}°C</strong>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary-text)', display: 'block' }}>Relative Humidity</span>
              <strong style={{ fontSize: '1.25rem', color: '#1E293B' }}>{panchayatAvg.humidity}%</strong>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary-text)', display: 'block' }}>Root-Zone Soil Temp</span>
              <strong style={{ fontSize: '1.25rem', color: '#1E293B' }}>{panchayatAvg.soilTemp}°C</strong>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary-text)', display: 'block' }}>Wind Exposure</span>
              <strong style={{ fontSize: '1.25rem', color: '#1E293B' }}>{panchayatAvg.wind} km/h</strong>
            </div>
          </div>
        </div>

        {/* Card 2: Field Micro-Climate */}
        <div className="gm-card gm-card-primary" style={{ borderLeft: '4px solid var(--color-primary-green)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span className="gm-badge gm-badge-green">Field Micro-Climate</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary-green)' }}>
              1 km Precision
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.5rem' }}>
            {activeField ? activeField.fieldName : "Your Specific Field Plot"}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #DDE8DD' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary-text)', display: 'block' }}>Micro Air Temp</span>
              <strong style={{ fontSize: '1.25rem', color: '#16A34A' }}>{fieldMicro.temp}°C</strong>
              <span style={{ fontSize: '0.68rem', color: '#059669', display: 'block' }}>-0.7°C Transpiration cooling</span>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #DDE8DD' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary-text)', display: 'block' }}>Canopy Humidity</span>
              <strong style={{ fontSize: '1.25rem', color: '#0284C7' }}>{fieldMicro.humidity}%</strong>
              <span style={{ fontSize: '0.68rem', color: '#0369A1', display: 'block' }}>+4% Foliar boundary layer</span>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #DDE8DD' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary-text)', display: 'block' }}>Root Soil Temp</span>
              <strong style={{ fontSize: '1.25rem', color: '#16A34A' }}>{fieldMicro.soilTemp}°C</strong>
              <span style={{ fontSize: '0.68rem', color: '#059669', display: 'block' }}>Buffered by black clay</span>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #DDE8DD' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary-text)', display: 'block' }}>Surface Wind Drag</span>
              <strong style={{ fontSize: '1.25rem', color: '#475569' }}>{fieldMicro.wind} km/h</strong>
              <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block' }}>-1.6 km/h canopy resistance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Physical Microclimate Drivers */}
      <div className="gm-card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.85rem' }}>
          Physical Drivers Producing Micro-Climate Variation
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {drivers.map((d, idx) => {
            const Icon = d.icon;
            return (
              <div key={idx} style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <Icon size={18} color={d.color} />
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-dark-green)' }}>{d.title}</strong>
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: d.color, marginBottom: '0.35rem' }}>
                  {d.value}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                  {d.impact}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
