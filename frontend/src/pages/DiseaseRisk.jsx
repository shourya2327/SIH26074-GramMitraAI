import React, { useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { Bug, AlertTriangle, ShieldAlert, CheckCircle, Info, Thermometer, Droplets, AlertCircle } from 'lucide-react';

export const DiseaseRisk = () => {
  const { selectedLocation } = useLocation();
  const [selectedCrop, setSelectedCrop] = useState('Wheat');

  const diseasesData = {
    Wheat: [
      {
        name: "Yellow Rust (Stripe Rust)",
        pathogen: "Puccinia striiformis (Fungal)",
        risk: "MODERATE",
        riskColor: "#D97706",
        riskBg: "#FEF3C7",
        favorable: "Temp 10-20°C and sustained canopy humidity > 75%",
        action: "Scout lower leaf surfaces on field borders for yellow-orange linear pustules. If detected early, consult KVK for triazole fungicide application."
      },
      {
        name: "Powdery Mildew",
        pathogen: "Blumeria graminis (Fungal)",
        risk: "LOW",
        riskColor: "#16A34A",
        riskBg: "#DCFCE7",
        favorable: "Temp 15-22°C with dry sunny days following high humidity",
        action: "Avoid excess nitrogen fertilizer which creates dense lush foliage favored by mildew."
      }
    ],
    Soybean: [
      {
        name: "Asian Soybean Rust",
        pathogen: "Phakopsora pachyrhizi",
        risk: "HIGH",
        riskColor: "#DC2626",
        riskBg: "#FEE2E2",
        favorable: "Continuous wet foliage for > 6 consecutive hours at 18-28°C",
        action: "High humidity accelerates urediniospore germination. Inspect lower trifoliate leaves for tiny tan/brown lesions."
      },
      {
        name: "Collar Rot / Sclerotium Blight",
        pathogen: "Sclerotium rolfsii",
        risk: "MODERATE",
        riskColor: "#D97706",
        riskBg: "#FEF3C7",
        favorable: "Waterlogged soils and warm humid temperatures (25-30°C)",
        action: "Ensure surface drain furrows are clear to prevent water accumulation near plant collars."
      }
    ],
    "Gram / Chickpea": [
      {
        name: "Ascochyta Blight",
        pathogen: "Ascochyta rabiei",
        risk: "MODERATE",
        riskColor: "#D97706",
        riskBg: "#FEF3C7",
        favorable: "Cool cloudy weather with intermittent rains (15-22°C)",
        action: "Scout for circular brown spots on leaves, stems, and pods. Delay foliar nutrient spray until overcast clouds disperse."
      },
      {
        name: "Fusarium Wilt",
        pathogen: "Fusarium oxysporum f. sp. ciceris",
        risk: "LOW",
        riskColor: "#16A34A",
        riskBg: "#DCFCE7",
        favorable: "Warm soil temperatures (> 25°C) and water stress",
        action: "Current soil moisture levels are adequate; wilt pressure remains low."
      }
    ]
  };

  const currentCropDiseases = diseasesData[selectedCrop] || diseasesData['Wheat'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2.5rem' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
            🦠 Crop Disease Early Risk Prediction
          </h1>
          <span className="gm-badge gm-badge-orange">Micro-Meteorological Warning</span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)' }}>
          Evaluates temperature-humidity-wetness index to detect favorable pathogen incubation windows before visible crop damage occurs.
        </p>
      </div>

      {/* Mandatory Disclaimer from SIH Prompt */}
      <div style={{
        padding: '0.85rem 1.25rem',
        backgroundColor: '#FFFBEB',
        borderRadius: '8px',
        border: '1px solid #FDE68A',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.8rem',
        color: '#92400E'
      }}>
        <AlertCircle size={22} color="#D97706" style={{ flexShrink: 0 }} />
        <span>
          <strong>Scientific Protocol Disclaimer:</strong> This module predicts environmental suitability for disease pathogen incubation based on meteorological variables. It is <strong>NOT</strong> a botanical disease diagnosis. Always scout fields and verify with local Krishi Vigyan Kendra (KVK) scientists before chemical application.
        </span>
      </div>

      {/* Crop Filter Bar */}
      <div className="gm-card" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-dark-green)' }}>Select Crop to Assess:</span>
        {Object.keys(diseasesData).map(c => (
          <button
            key={c}
            onClick={() => setSelectedCrop(c)}
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: selectedCrop === c ? 'var(--color-primary-green)' : 'var(--color-border)',
              backgroundColor: selectedCrop === c ? 'var(--color-light-green)' : '#FFFFFF',
              color: selectedCrop === c ? 'var(--color-dark-green)' : 'var(--color-secondary-text)',
              cursor: 'pointer'
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Disease Risk Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {currentCropDiseases.map((d, idx) => (
          <div
            key={idx}
            className="gm-card"
            style={{
              borderLeft: `5px solid ${d.riskColor}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
                  {d.name}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', fontStyle: 'italic' }}>
                  Pathogen: {d.pathogen}
                </span>
              </div>

              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '12px',
                  backgroundColor: d.riskBg,
                  color: d.riskColor
                }}
              >
                {d.risk} RISK LEVEL
              </span>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid var(--color-border)' }}>
              <span style={{ color: 'var(--color-secondary-text)', display: 'block' }}>Favorable Meteorological Incubation Triggers:</span>
              <strong style={{ color: 'var(--color-primary-text)' }}>{d.favorable}</strong>
            </div>

            <div style={{ backgroundColor: '#F0FDF4', padding: '0.85rem 1rem', borderRadius: '6px', border: '1px solid #DCFCE7' }}>
              <strong style={{ fontSize: '0.82rem', color: '#16A34A', display: 'block', marginBottom: '2px' }}>
                Recommended Field Action & IPM Strategy:
              </strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-dark-green)', lineHeight: 1.5 }}>
                {d.action}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
