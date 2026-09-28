import React, { useState } from 'react';
import { InteractiveMap } from '../components/Map/InteractiveMap';
import { samplePanchayats } from '../utils/demoData';
import { useLocation } from '../context/LocationContext';
import { useWeather } from '../context/WeatherContext';
import { Map, Layers, CloudRain, Thermometer, Wind, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';

export const PanchayatMap = () => {
  const { updateLocationByCoords, selectedLocation } = useLocation();
  const { weather } = useWeather();
  const [activeLayer, setActiveLayer] = useState('risk'); // 'risk', 'rain', 'temp'

  const activeBlockName = selectedLocation?.block || selectedLocation?.district || "Local";
  const activeVillageName = selectedLocation?.village || selectedLocation?.panchayat || "Current Location";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2.5rem' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
            🗺 Panchayat Weather & Agro-Met Mapping
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)' }}>
            Cluster view across {activeBlockName} and neighboring agricultural zones with real-time risk classification.
          </p>
        </div>

        {/* Layer Filters */}
        <div style={{ display: 'flex', gap: '6px', backgroundColor: '#FFFFFF', padding: '4px', borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <button
            onClick={() => setActiveLayer('risk')}
            style={{
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeLayer === 'risk' ? '#FEE2E2' : 'transparent',
              color: activeLayer === 'risk' ? '#DC2626' : 'var(--color-secondary-text)'
            }}
          >
            ⚠️ Weather Risk Index
          </button>
          <button
            onClick={() => setActiveLayer('rain')}
            style={{
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeLayer === 'rain' ? '#E0F2FE' : 'transparent',
              color: activeLayer === 'rain' ? '#0284C7' : 'var(--color-secondary-text)'
            }}
          >
            🌧 Rainfall Inundation
          </button>
          <button
            onClick={() => setActiveLayer('temp')}
            style={{
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeLayer === 'temp' ? '#FFEDD5' : 'transparent',
              color: activeLayer === 'temp' ? '#EA580C' : 'var(--color-secondary-text)'
            }}
          >
            🌡 Temperature Gradients
          </button>
        </div>
      </div>

      {/* Main Map */}
      <div className="gm-card" style={{ padding: '0.75rem' }}>
        <InteractiveMap height="520px" showControls={true} allowDrawing={true} activeOverlay={activeLayer} />
      </div>

      {/* Risk Color Legend & Panchayat Quick List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {/* Color Legend */}
        <div className="gm-card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.75rem' }}>
            Risk Classification Legend
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
              <strong>Normal (Green):</strong> Rainfall &lt; 15mm, stable crop weather, optimal conditions.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#F59E0B', display: 'inline-block' }} />
              <strong>Moderate Risk (Yellow/Orange):</strong> Rainfall 15-35mm, pause spraying & top-dressing.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#EF4444', display: 'inline-block' }} />
              <strong>High/Severe (Red):</strong> Rainfall &gt; 35mm, convective gust alert, waterlogging risk.
            </div>
          </div>
        </div>

        {/* Nearby Panchayats List */}
        <div className="gm-card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.75rem' }}>
            {activeBlockName} Region Panchayats Overview
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* Active Selected Location Item */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'var(--color-light-green)',
                borderRadius: '6px',
                border: '1.5px solid var(--color-primary-green)'
              }}
            >
              <div>
                <strong style={{ fontSize: '0.88rem', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} color="#EF4444" /> {activeVillageName} (Selected)
                </strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)' }}>
                  {selectedLocation.elevation_m || 520}m MSL • {selectedLocation.district || 'District'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                  {weather ? `${weather.temperature}°C | ${weather.rainfall}mm` : 'Loading...'}
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '10px',
                  backgroundColor: (weather?.rainfall > 35) ? '#FEE2E2' : (weather?.rainfall > 15) ? '#FEF3C7' : '#DCFCE7',
                  color: (weather?.rainfall > 35) ? '#DC2626' : (weather?.rainfall > 15) ? '#D97706' : '#166534'
                }}>
                  {weather?.rainfall > 35 ? 'High Risk' : weather?.rainfall > 15 ? 'Moderate' : 'Normal'}
                </span>
              </div>
            </div>

            {/* Other Sample Regional Panchayats */}
            {samplePanchayats.map(p => (
              <div
                key={p.id}
                onClick={() => updateLocationByCoords(p.lat, p.lng)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.55rem 0.75rem',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-dark-green)' }}>{p.name}</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', marginLeft: '6px' }}>
                    {p.elevation}m MSL • {p.soil}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{p.temp}°C | {p.rainfall_mm}mm</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '10px',
                      backgroundColor: p.risk === 'High' ? '#FEE2E2' : p.risk === 'Moderate' ? '#FEF3C7' : '#DCFCE7',
                      color: p.risk === 'High' ? '#DC2626' : p.risk === 'Moderate' ? '#D97706' : '#16A34A'
                    }}
                  >
                    {p.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
