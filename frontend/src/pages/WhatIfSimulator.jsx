import React, { useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { useWeather } from '../context/WeatherContext';
import { FlaskConical, AlertTriangle, RefreshCw, Sparkles, Droplets, Bug, AlertCircle, CheckCircle } from 'lucide-react';

export const WhatIfSimulator = () => {
  const { selectedLocation } = useLocation();
  const { weather } = useWeather();

  // Baseline values dynamically obtained from live weather forecast
  const baseTemp = weather ? weather.temperature : 28.0;
  const baseRain = weather ? weather.rainfall : 12.0;
  const baseHumidity = weather ? weather.humidity : 65;
  const baseWind = weather ? weather.windSpeed : 12.0;

  // Simulator Sliders
  const [deltaTemp, setDeltaTemp] = useState(0);         // -5 to +8 °C
  const [deltaRainPct, setDeltaRainPct] = useState(30);   // -100% to +150%
  const [deltaHumidity, setDeltaHumidity] = useState(5);  // -30% to +30%
  const [deltaWindPct, setDeltaWindPct] = useState(0);    // -50% to +100%
  const [crop, setCrop] = useState('Wheat');

  // Computed simulated parameters
  const simTemp = Number((baseTemp + deltaTemp).toFixed(1));
  const simRain = Number((Math.max(0, baseRain * (1 + deltaRainPct / 100))).toFixed(1));
  const simHumidity = Math.min(100, Math.max(15, baseHumidity + deltaHumidity));
  const simWind = Number((Math.max(0, baseWind * (1 + deltaWindPct / 100))).toFixed(1));

  // Dynamic simulation impact assessment
  const simIrrigationNeeded = simRain < 12.0 && simTemp > 28.0;
  const simDiseaseRisk = simHumidity > 78 && simTemp >= 18 && simTemp <= 28 ? 'HIGH' : simHumidity > 68 ? 'MEDIUM' : 'LOW';
  const simWeatherHazard = simRain > 45.0 ? 'SEVERE - Waterlogging & Inundation' : simTemp > 38.0 ? 'HIGH - Heat Stress' : simWind > 35.0 ? 'MODERATE - Crop Lodging' : 'NORMAL';

  const resetSimulation = () => {
    setDeltaTemp(0);
    setDeltaRainPct(0);
    setDeltaHumidity(0);
    setDeltaWindPct(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2.5rem' }}>
      
      {/* Simulation Header with Prominent Simulation Disclaimer */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
            🧪 What-If Weather Simulator
          </h1>
          <span className="gm-badge gm-badge-purple">Scenario Modeling</span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)' }}>
          Hypothetical microclimate stress testing for {selectedLocation.panchayat || "Dharampuri"}. Simulate extreme conditions before they happen!
        </p>
      </div>

      {/* Prominent Disclaimer Banner */}
      <div style={{
        padding: '0.85rem 1.25rem',
        backgroundColor: '#EFF6FF',
        borderRadius: '8px',
        border: '1.5px solid #93C5FD',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.82rem',
        color: '#1E40AF'
      }}>
        <AlertCircle size={22} color="#2563EB" style={{ flexShrink: 0 }} />
        <span>
          <strong>SIMULATED SCENARIO NOTICE:</strong> All values displayed on this page are mathematical what-if simulations for farm contingency planning. They do <strong>NOT</strong> represent real live forecasts.
        </span>
      </div>

      {/* Simulator Control Sliders Grid */}
      <div className="gm-card" style={{ background: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
            Interactive Weather Variable Controls
          </h3>
          <button
            onClick={resetSimulation}
            className="gm-btn gm-btn-outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
          >
            <RefreshCw size={13} /> Reset to Live Forecast
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Temperature Slider */}
          <div style={{ padding: '1rem', backgroundColor: '#FFF7ED', borderRadius: '8px', border: '1px solid #FFEDD5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#C2410C' }}>Temperature Shift</span>
              <strong style={{ fontSize: '0.95rem', color: '#EA580C' }}>
                {deltaTemp >= 0 ? `+${deltaTemp}` : deltaTemp}°C ({simTemp}°C)
              </strong>
            </div>
            <input
              type="range"
              min="-6"
              max="8"
              step="0.5"
              value={deltaTemp}
              onChange={(e) => setDeltaTemp(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#EA580C' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
              <span>-6°C Cold dip</span>
              <span>Baseline: {baseTemp}°C</span>
              <span>+8°C Heatwave</span>
            </div>
          </div>

          {/* Rainfall Slider */}
          <div style={{ padding: '1rem', backgroundColor: '#F0F9FF', borderRadius: '8px', border: '1px solid #E0F2FE' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0369A1' }}>Rainfall Variation</span>
              <strong style={{ fontSize: '0.95rem', color: '#0284C7' }}>
                {deltaRainPct >= 0 ? `+${deltaRainPct}` : deltaRainPct}% ({simRain} mm)
              </strong>
            </div>
            <input
              type="range"
              min="-100"
              max="150"
              step="10"
              value={deltaRainPct}
              onChange={(e) => setDeltaRainPct(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#0284C7' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
              <span>-100% Drought</span>
              <span>Baseline: {baseRain}mm</span>
              <span>+150% Torrential</span>
            </div>
          </div>

          {/* Humidity Slider */}
          <div style={{ padding: '1rem', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#15803D' }}>Relative Humidity</span>
              <strong style={{ fontSize: '0.95rem', color: '#16A34A' }}>
                {deltaHumidity >= 0 ? `+${deltaHumidity}` : deltaHumidity}% ({simHumidity}%)
              </strong>
            </div>
            <input
              type="range"
              min="-35"
              max="25"
              step="5"
              value={deltaHumidity}
              onChange={(e) => setDeltaHumidity(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#16A34A' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
              <span>Dry spell</span>
              <span>Baseline: {baseHumidity}%</span>
              <span>Super-saturated</span>
            </div>
          </div>

          {/* Wind Speed Slider */}
          <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Wind Gusts</span>
              <strong style={{ fontSize: '0.95rem', color: '#1E293B' }}>
                {deltaWindPct >= 0 ? `+${deltaWindPct}` : deltaWindPct}% ({simWind} km/h)
              </strong>
            </div>
            <input
              type="range"
              min="-50"
              max="150"
              step="15"
              value={deltaWindPct}
              onChange={(e) => setDeltaWindPct(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#475569' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
              <span>Calm</span>
              <span>Baseline: {baseWind}km/h</span>
              <span>Gale Squall</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Consequence & Impact Matrix */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Irrigation Impact */}
        <div className="gm-card" style={{ borderLeft: `5px solid ${simIrrigationNeeded ? '#EF4444' : '#10B981'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-secondary-text)' }}>SIMULATED IRRIGATION</span>
            <span className={`gm-badge ${simIrrigationNeeded ? 'gm-badge-red' : 'gm-badge-green'}`} style={{ fontSize: '0.65rem' }}>
              {simIrrigationNeeded ? 'REQUIRED' : 'NOT REQUIRED'}
            </span>
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.5rem' }}>
            {simIrrigationNeeded ? 'Provide 18 mm Water' : 'Zero Irrigation Required'}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', lineHeight: 1.5 }}>
            {simRain > 12.0
              ? `Simulated rainfall of ${simRain} mm (+${deltaRainPct}%) adequately replenishes root zones. Running pumps would cause wasteful runoff and nutrient leaching.`
              : `Under ${simTemp}°C temp and meager ${simRain} mm precipitation, net evapotranspiration deficit requires supplementary drip/sprinkler run.`
            }
          </p>
        </div>

        {/* Disease Risk Impact */}
        <div className="gm-card" style={{ borderLeft: `5px solid ${simDiseaseRisk === 'HIGH' ? '#EF4444' : simDiseaseRisk === 'MEDIUM' ? '#F59E0B' : '#10B981'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-secondary-text)' }}>SIMULATED DISEASE RISK</span>
            <span className={`gm-badge ${simDiseaseRisk === 'HIGH' ? 'gm-badge-red' : simDiseaseRisk === 'MEDIUM' ? 'gm-badge-orange' : 'gm-badge-green'}`} style={{ fontSize: '0.65rem' }}>
              {simDiseaseRisk} RISK
            </span>
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.5rem' }}>
            {simDiseaseRisk === 'HIGH' ? 'Severe Fungal Incubation' : simDiseaseRisk === 'MEDIUM' ? 'Moderate Spore Activity' : 'Low Pathogen Threat'}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', lineHeight: 1.5 }}>
            {simHumidity > 78
              ? `Humid microclimate (${simHumidity}% RH) combined with ${simTemp}°C temp dramatically accelerates rust and leaf blight spore germination.`
              : `Dry atmospheric boundary layer keeps leaf wetness duration low, minimizing fungal infections.`
            }
          </p>
        </div>

        {/* Weather Hazard Assessment */}
        <div className="gm-card" style={{ borderLeft: `5px solid ${simWeatherHazard.startsWith('SEVERE') ? '#EF4444' : simWeatherHazard.startsWith('HIGH') ? '#F97316' : '#10B981'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-secondary-text)' }}>SIMULATED WEATHER HAZARD</span>
            <span className="gm-badge gm-badge-purple" style={{ fontSize: '0.65rem' }}>
              AI RISK
            </span>
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.5rem' }}>
            {simWeatherHazard}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', lineHeight: 1.5 }}>
            {simRain > 45.0
              ? `Flash runoff danger on non-bunded fields. Drainage channels would need to be dredged.`
              : simTemp > 38.0
              ? `Thermal threshold exceeded. Pollen sterility and canopy scorching would accelerate.`
              : `Within tolerable agronomic thresholds for central Indian plains.`
            }
          </p>
        </div>
      </div>
    </div>
  );
};
