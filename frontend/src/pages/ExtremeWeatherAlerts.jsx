import React from 'react';
import { useLocation } from '../context/LocationContext';
import { sampleAlerts } from '../utils/demoData';
import { AlertTriangle, ShieldAlert, Clock, CheckCircle2, ChevronRight, Wind, CloudRain, SunMedium, Snowflake } from 'lucide-react';

export const ExtremeWeatherAlerts = () => {
  const { selectedLocation } = useLocation();

  const allAlerts = [
    {
      id: "ALT-2026-RAIN-01",
      type: "HEAVY_RAINFALL",
      severity: "ORANGE_ALERT",
      badgeColor: "#F59E0B",
      badgeBg: "#FEF3C7",
      icon: CloudRain,
      headline: "Moderate to Heavy Rainfall Warning (~20 - 45mm)",
      expectedTime: "Next 12 to 24 Hours",
      panchayat: selectedLocation.village || selectedLocation.panchayat || "Your Farm",
      description: `Convective moisture band moving across ${selectedLocation.block || 'local'} agricultural block. Localized accumulation will exceed root infiltration capacity on low-lying slopes.`,
      actions: [
        "Open field drainage furrows to avoid submergence of young seedling crowns.",
        "Delay all scheduled nitrogen top-dressing to prevent leaching losses.",
        "Secure harvested farm produce on elevated tarpaulin platforms.",
        "Disconnect electric pumps and inspect furrow bund integrity."
      ]
    },
    {
      id: "ALT-2026-WIND-02",
      type: "GUSTY_WINDS",
      severity: "YELLOW_WATCH",
      badgeColor: "#B45309",
      badgeBg: "#FFFBEB",
      icon: Wind,
      headline: "Sustained Surface Wind Gusts up to 32 km/h",
      expectedTime: "This Afternoon (14:00 - 18:00)",
      panchayat: selectedLocation.village || selectedLocation.panchayat || "Your Farm",
      description: "Pre-monsoon squall patterns may cause chemical spray drift and lodging in tall crops.",
      actions: [
        "Do NOT spray pesticides or liquid micronutrients during high wind hours.",
        "Provide earthing-up support for tall standing crops (maize, sugarcane)."
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2.5rem' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
            ⚠️ Extreme Weather Early Warning & Alert System
          </h1>
          <span className="gm-badge gm-badge-red">IMD Protocol Aligned</span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)' }}>
          Active alerts for {selectedLocation.panchayat || "Dharampuri"} ({selectedLocation.block}, {selectedLocation.district}).
        </p>
      </div>

      {/* Alert Severity Guide */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.75rem'
      }}>
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
          <strong style={{ fontSize: '0.82rem', color: '#16A34A', display: 'block' }}>🟢 GREEN: NO WARNING</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>Normal farm operations proceed</span>
        </div>
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#FFFBEB', borderRadius: '8px', border: '1px solid #FDE68A' }}>
          <strong style={{ fontSize: '0.82rem', color: '#D97706', display: 'block' }}>🟡 YELLOW: BE UPDATED</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>Weather watch; monitor forecast updates</span>
        </div>
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#FFF7ED', borderRadius: '8px', border: '1px solid #FED7AA' }}>
          <strong style={{ fontSize: '0.82rem', color: '#EA580C', display: 'block' }}>🟠 ORANGE: BE PREPARED</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>Severe weather likely; safeguard fields</span>
        </div>
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA' }}>
          <strong style={{ fontSize: '0.82rem', color: '#DC2626', display: 'block' }}>🔴 RED: TAKE ACTION</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>Extreme danger; emergency actions</span>
        </div>
      </div>

      {/* Active Warnings Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {allAlerts.map(alert => {
          const Icon = alert.icon;
          return (
            <div
              key={alert.id}
              className="gm-card"
              style={{
                borderLeft: `6px solid ${alert.badgeColor}`,
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: alert.badgeBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={22} color={alert.badgeColor} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          backgroundColor: alert.badgeBg,
                          color: alert.badgeColor
                        }}
                      >
                        {alert.severity.replace('_', ' ')}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                        Alert ID: {alert.id}
                      </span>
                    </div>

                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-dark-green)', marginTop: '4px' }}>
                      {alert.headline}
                    </h2>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', backgroundColor: '#F8FAFC', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                  <Clock size={15} color="var(--color-primary-green)" />
                  <span>Expected: {alert.expectedTime}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--color-primary-text)', lineHeight: 1.6 }}>
                {alert.description}
              </p>

              {/* Mitigation Action Checklist */}
              <div style={{ backgroundColor: '#F8FAF8', padding: '1rem', borderRadius: '8px', border: '1px solid #DDE8DD' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.5rem' }}>
                  Recommended Farmer Mitigation Actions:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {alert.actions.map((act, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--color-dark-green)' }}>
                      <CheckCircle2 size={16} color="var(--color-primary-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
