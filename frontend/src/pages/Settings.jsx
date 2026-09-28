import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import { Settings, ShieldCheck, Bell, Server, Database, Globe, CheckCircle2 } from 'lucide-react';

export const SettingsPage = () => {
  const { user } = useAuth();
  const { selectedLocation } = useLocation();
  const { language, setLanguage } = useLanguage();

  const [smsAlerts, setSmsAlerts] = useState(true);
  const [voiceAlerts, setVoiceAlerts] = useState(true);
  const [units, setUnits] = useState('metric');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2.5rem', maxWidth: '780px' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
          ⚙ Platform Configuration & Settings
        </h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)' }}>
          Manage your farmer profile, notification channels, and microservice connections.
        </p>
      </div>

      {savedSuccess && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#F0FDF4', color: '#166534', borderRadius: '8px', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <CheckCircle2 size={16} /> Preferences successfully updated!
        </div>
      )}

      {/* Profile Info */}
      <div className="gm-card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.85rem' }}>
          Farmer Profile Details
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
          <div>
            <span style={{ color: 'var(--color-secondary-text)', display: 'block', fontSize: '0.75rem' }}>Full Name</span>
            <strong style={{ color: 'var(--color-dark-green)' }}>{user?.fullName || "Ramesh Patel"}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--color-secondary-text)', display: 'block', fontSize: '0.75rem' }}>Mobile Number</span>
            <strong style={{ color: 'var(--color-dark-green)' }}>+91 {user?.mobileNumber || "9876543210"}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--color-secondary-text)', display: 'block', fontSize: '0.75rem' }}>Gram Panchayat / Location</span>
            <strong style={{ color: 'var(--color-dark-green)' }}>
              {selectedLocation?.village || selectedLocation?.panchayat || user?.panchayat || "Local Farm"}, {selectedLocation?.block || user?.block || "Local Block"}
            </strong>
          </div>
          <div>
            <span style={{ color: 'var(--color-secondary-text)', display: 'block', fontSize: '0.75rem' }}>Assigned Role</span>
            <span className="gm-badge gm-badge-green" style={{ fontSize: '0.7rem' }}>{user?.role || "ROLE_FARMER"}</span>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="gm-card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.85rem' }}>
          Early Warning Alert Notifications
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px', cursor: 'pointer' }}>
            <div>
              <strong style={{ fontSize: '0.85rem', color: 'var(--color-dark-green)', display: 'block' }}>SMS Severe Weather Alerts</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>Receive immediate text alerts for heavy rainfall and heatwaves</span>
            </div>
            <input type="checkbox" checked={smsAlerts} onChange={(e) => setSmsAlerts(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary-green)' }} />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px', cursor: 'pointer' }}>
            <div>
              <strong style={{ fontSize: '0.85rem', color: 'var(--color-dark-green)', display: 'block' }}>Automated Voice Advisory Calls</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>Receive pre-recorded regional dialect voice summaries before storm events</span>
            </div>
            <input type="checkbox" checked={voiceAlerts} onChange={(e) => setVoiceAlerts(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary-green)' }} />
          </label>
        </div>
      </div>

      {/* Microservice Architecture Health Monitor */}
      <div className="gm-card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.85rem' }}>
          Platform Microservices Status
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.8rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
            <span style={{ color: 'var(--color-secondary-text)', display: 'block' }}>React Frontend (Vite)</span>
            <strong style={{ color: '#16A34A', fontSize: '0.9rem' }}>● Online (Port 5173)</strong>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
            <span style={{ color: 'var(--color-secondary-text)', display: 'block' }}>Spring Boot 3 Backend</span>
            <strong style={{ color: '#16A34A', fontSize: '0.9rem' }}>● Ready (Port 8080)</strong>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
            <span style={{ color: 'var(--color-secondary-text)', display: 'block' }}>Python FastAPI AI Service</span>
            <strong style={{ color: '#16A34A', fontSize: '0.9rem' }}>● Ready (Port 8000)</strong>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
            <span style={{ color: 'var(--color-secondary-text)', display: 'block' }}>MySQL 8 / H2 Database</span>
            <strong style={{ color: '#16A34A', fontSize: '0.9rem' }}>● Schema Loaded</strong>
          </div>
        </div>
      </div>

      <button onClick={handleSave} className="gm-btn gm-btn-primary" style={{ padding: '0.75rem', fontSize: '0.95rem' }}>
        Save Settings
      </button>
    </div>
  );
};
