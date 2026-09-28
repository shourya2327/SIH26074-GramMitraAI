import React from 'react';
import { useLocation } from '../context/LocationContext';
import { useWeather } from '../context/WeatherContext';
import { sampleShapFeatures } from '../utils/demoData';
import { Brain, Sparkles, TrendingUp, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ExplainableAI = () => {
  const { selectedLocation } = useLocation();
  const { weather, downscalingFactors } = useWeather();

  const rainfallVal = weather ? weather.rainfall : 12.0;
  const rainProbVal = weather ? weather.rainProbability : 50;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2.5rem' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
            🧠 Explainable AI (XAI) & SHAP Feature Attribution
          </h1>
          <span className="gm-badge gm-badge-purple">TreeSHAP Engine</span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)' }}>
          Demystifying machine learning predictions for farmers and agriculture officers. Understand <strong>WHY</strong> the AI reached this forecast.
        </p>
      </div>

      {/* Target Forecast Banner */}
      <div className="gm-card" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF5FF 100%)', border: '1.5px solid #DDD6FE' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="gm-badge gm-badge-blue" style={{ marginBottom: '6px' }}>Target Variable Explained</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
              Panchayat Rainfall Forecast: {rainfallVal} mm ({rainProbVal}% Probability)
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
              Panchayat: <strong>{selectedLocation.panchayat || "Dharampuri"}</strong> • Elevation: {selectedLocation.elevation_m}m MSL • NDVI: {selectedLocation.ndvi}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="gm-badge gm-badge-purple" style={{ fontSize: '0.75rem' }}>
              Base Climatology: 4.2 mm
            </span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-ai-accent)', marginTop: '4px' }}>
              Net AI Shift: +10.3 mm
            </div>
          </div>
        </div>
      </div>

      {/* SHAP Feature Importance Bars (Waterfall/Importance Bar Visualizer) */}
      <div className="gm-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
              SHAP Physical Feature Contribution Breakdown
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)' }}>
              Percentage contribution of environmental attributes driving today's weather downscaling
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
            Method: Shapley Additive Explanations
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {sampleShapFeatures.map((feat, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-dark-green)' }}>
                  {idx + 1}. {feat.feature}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.78rem', color: feat.isPositive ? '#16A34A' : '#DC2626', fontWeight: 700 }}>
                    {feat.impact}
                  </span>
                  <span style={{ fontWeight: 800, color: 'var(--color-primary-text)' }}>
                    {feat.importance}%
                  </span>
                </div>
              </div>

              {/* Progress / SHAP Bar */}
              <div style={{
                height: '14px',
                width: '100%',
                backgroundColor: '#F1F5F9',
                borderRadius: '7px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{
                  height: '100%',
                  width: `${feat.importance * 2.3}%`,
                  backgroundColor: feat.isPositive ? '#4CAF50' : '#EF4444',
                  borderRadius: '7px',
                  transition: 'width 0.8s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plain Language Interpretation for Farmers (English + Hindi) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* English */}
        <div className="gm-card" style={{ borderLeft: '4px solid #0284C7' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0369A1', marginBottom: '0.5rem' }}>
            🇬🇧 Natural Language AI Explanation
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-dark-green)', lineHeight: 1.6, backgroundColor: '#F0F9FF', padding: '0.85rem', borderRadius: '8px' }}>
            "The primary driver behind today's 14.5 mm rainfall prediction in Dharampuri is <strong>high atmospheric humidity (72%)</strong>, combined with monsoon cloud convergence (68% cover) and <strong>orographic lift at 528m elevation</strong>. Dense crop vegetation (NDVI 0.62) also added positive evapotranspirational moisture feedback."
          </p>
        </div>

        {/* Hindi */}
        <div className="gm-card" style={{ borderLeft: '4px solid var(--color-primary-green)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.5rem' }}>
            🇮🇳 सरल हिंदी व्याख्या (किसान हित में)
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-dark-green)', lineHeight: 1.6, backgroundColor: '#F0FDF4', padding: '0.85rem', borderRadius: '8px' }}>
            "आज धर्मपुरी में 14.5 मिमी बारिश के पूर्वानुमान का मुख्य कारण <strong>वायुमंडल में 72% नमी</strong> तथा <strong>528 मीटर की ऊंचाई पर बनने वाला पर्वतीय दबाव</strong> है। खेतों में खड़ी हरी फसलों (NDVI 0.62) से भी स्थानीय हवा में नमी का स्तर बढ़ा है, जिससे बारिश की संभावना 78% हो गई है।"
          </p>
        </div>
      </div>
    </div>
  );
};
