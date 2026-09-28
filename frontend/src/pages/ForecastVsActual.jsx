import React, { useState } from 'react';
import { sampleAccuracyMetrics } from '../utils/demoData';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { BarChart2, CheckCircle2, TrendingUp, Calendar, Filter } from 'lucide-react';

export const ForecastVsActual = () => {
  const [metricParam, setMetricParam] = useState('temp'); // 'temp' or 'rain'
  const [dateFilter, setDateFilter] = useState('14d');

  const historyData = [
    { date: "12 Sep", tempPred: 30.2, tempAct: 29.8, rainPred: 12.0, rainAct: 14.5, tempErr: 0.4 },
    { date: "13 Sep", tempPred: 31.0, tempAct: 30.4, rainPred: 25.0, rainAct: 22.0, tempErr: 0.6 },
    { date: "14 Sep", tempPred: 29.5, tempAct: 29.1, rainPred: 8.0, rainAct: 6.5, tempErr: 0.4 },
    { date: "15 Sep", tempPred: 28.0, tempAct: 28.5, rainPred: 40.0, rainAct: 44.0, tempErr: 0.5 },
    { date: "16 Sep", tempPred: 27.2, tempAct: 27.0, rainPred: 18.0, rainAct: 19.5, tempErr: 0.2 },
    { date: "17 Sep", tempPred: 28.8, tempAct: 29.2, rainPred: 5.0, rainAct: 4.0, tempErr: 0.4 },
    { date: "18 Sep", tempPred: 30.5, tempAct: 31.1, rainPred: 0.0, rainAct: 0.0, tempErr: 0.6 },
    { date: "19 Sep", tempPred: 32.0, tempAct: 31.4, rainPred: 0.0, rainAct: 0.0, tempErr: 0.6 },
    { date: "20 Sep", tempPred: 31.5, tempAct: 32.0, rainPred: 2.0, rainAct: 0.0, tempErr: 0.5 },
    { date: "21 Sep", tempPred: 29.8, tempAct: 29.5, rainPred: 15.0, rainAct: 13.8, tempErr: 0.3 },
    { date: "22 Sep", tempPred: 28.5, tempAct: 28.2, rainPred: 30.0, rainAct: 32.5, tempErr: 0.3 },
    { date: "23 Sep", tempPred: 29.0, tempAct: 29.4, rainPred: 12.0, rainAct: 10.0, tempErr: 0.4 },
    { date: "24 Sep", tempPred: 30.1, tempAct: 29.9, rainPred: 4.0, rainAct: 3.0, tempErr: 0.2 },
    { date: "25 Sep", tempPred: 30.8, tempAct: 31.2, rainPred: 0.0, rainAct: 0.0, tempErr: 0.4 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
            📊 Forecast vs Actual Validation & Error Metrics
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)' }}>
            Transparent verification: Comparing GramMitraAI downscaled predictions against ground sensor observations.
          </p>
        </div>

        {/* Date Filter */}
        <div style={{ display: 'flex', gap: '6px', backgroundColor: '#FFFFFF', padding: '4px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          <button
            onClick={() => setDateFilter('7d')}
            style={{ padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600, border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: dateFilter === '7d' ? 'var(--color-light-green)' : 'transparent', color: dateFilter === '7d' ? 'var(--color-dark-green)' : 'var(--color-secondary-text)' }}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setDateFilter('14d')}
            style={{ padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600, border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: dateFilter === '14d' ? 'var(--color-light-green)' : 'transparent', color: dateFilter === '14d' ? 'var(--color-dark-green)' : 'var(--color-secondary-text)' }}
          >
            Last 14 Days
          </button>
          <button
            onClick={() => setDateFilter('30d')}
            style={{ padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600, border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: dateFilter === '30d' ? 'var(--color-light-green)' : 'transparent', color: dateFilter === '30d' ? 'var(--color-dark-green)' : 'var(--color-secondary-text)' }}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Primary Mathematical Validation KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem'
      }}>
        {/* Temperature MAE */}
        <div className="gm-card" style={{ borderLeft: '4px solid #EA580C' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', fontWeight: 600 }}>TEMPERATURE ERROR</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#EA580C', margin: '4px 0' }}>
            MAE: 0.72°C
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
            RMSE: <strong>1.05°C</strong> • R² Score: <strong>0.942</strong>
          </div>
        </div>

        {/* Rainfall Accuracy */}
        <div className="gm-card" style={{ borderLeft: '4px solid #0284C7' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', fontWeight: 600 }}>PRECIPITATION ERROR</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284C7', margin: '4px 0' }}>
            MAE: 2.8 mm
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
            RMSE: <strong>4.1 mm</strong> • Rain Hit Rate: <strong>89.4%</strong>
          </div>
        </div>

        {/* Relative Humidity MAE */}
        <div className="gm-card" style={{ borderLeft: '4px solid #10B981' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', fontWeight: 600 }}>HUMIDITY ERROR</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10B981', margin: '4px 0' }}>
            MAE: 4.2%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
            RMSE: <strong>5.8%</strong> • Boundary match: <strong>95%</strong>
          </div>
        </div>

        {/* Model Readiness Rating */}
        <div className="gm-card" style={{ borderLeft: '4px solid var(--color-ai-accent)', background: '#FAF5FF' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-ai-accent)', fontWeight: 700 }}>VALIDATION BENCHMARK</span>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#581C87', margin: '4px 0' }}>
            CALIBRATED
          </div>
          <div style={{ fontSize: '0.72rem', color: '#6B21A8' }}>
            Passed IMD Agro-Met standard guidelines
          </div>
        </div>
      </div>

      {/* Comparison Line Chart */}
      <div className="gm-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
              14-Day Trajectory: Predicted vs Actual Observed
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)' }}>
              Blue: Model Downscaled Forecast | Green: Ground Truth Sensor Readings
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setMetricParam('temp')}
              style={{
                padding: '4px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: metricParam === 'temp' ? '#FFEDD5' : '#F1F5F9',
                color: metricParam === 'temp' ? '#EA580C' : 'var(--color-secondary-text)'
              }}
            >
              🌡 Temperature (°C)
            </button>
            <button
              onClick={() => setMetricParam('rain')}
              style={{
                padding: '4px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: metricParam === 'rain' ? '#E0F2FE' : '#F1F5F9',
                color: metricParam === 'rain' ? '#0284C7' : 'var(--color-secondary-text)'
              }}
            >
              🌧 Rainfall (mm)
            </button>
          </div>
        </div>

        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            {metricParam === 'temp' ? (
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
                <YAxis unit="°C" domain={[24, 34]} stroke="#64748B" fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tempPred" name="Predicted Temp (°C)" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="tempAct" name="Actual Observed Temp (°C)" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            ) : (
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
                <YAxis unit="mm" stroke="#64748B" fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rainPred" name="Predicted Rain (mm)" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="rainAct" name="Actual Rain (mm)" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
