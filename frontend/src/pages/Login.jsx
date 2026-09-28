import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, ShieldCheck, ArrowRight, UserPlus, LogIn, Phone, Lock, User, MapPin } from 'lucide-react';

export const Login = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [identifier, setIdentifier] = useState('9876543210');
  const [password, setPassword] = useState('farmer123');
  const [role, setRole] = useState('ROLE_FARMER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      login({
        id: 1,
        fullName: role === 'ROLE_OFFICER' ? 'Dr. Anita Sharma' : role === 'ROLE_ADMIN' ? 'Admin System' : 'Ramesh Patel',
        mobileNumber: identifier,
        email: identifier.includes('@') ? identifier : 'ramesh.farmer@grammitra.ai',
        role: role,
        preferredLanguage: 'hi',
        state: 'Central Region',
        district: 'Local District',
        block: 'Local Block',
        panchayat: 'Local Panchayat'
      }, 'demo-jwt-token-active-789');
      setLoading(false);
    }, 400);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: 'var(--color-bg)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        maxWidth: '920px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)'
      }} className="login-card-grid">
        
        {/* Left Side: Agriculture Branding Illustration & Tagline */}
        <div style={{
          background: 'linear-gradient(145deg, #23412A 0%, #152618 100%)',
          color: '#FFFFFF',
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle decorative circles */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(76,175,80,0.2) 0%, transparent 70%)'
          }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#4CAF50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                boxShadow: '0 4px 10px rgba(0,0,0,0.25)'
              }}>
                🌱
              </div>
              <div>
                <h1 style={{ fontSize: '1.55rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                  GramMitra<span style={{ color: '#81C784' }}>AI</span>
                </h1>
                <span className="gm-badge gm-badge-green" style={{ fontSize: '0.65rem' }}>AI Smart Farming Platform</span>
              </div>
            </div>

            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem', color: '#E8F5E9' }}>
              "Hyperlocal Weather. Smarter Farming. Better Decisions."
            </h2>

            <p style={{ fontSize: '0.9rem', color: '#C8E6C9', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              AI-driven downscaling from regional blocks to individual farmer fields. Get precision rainfall, microclimate forecast, smart irrigation planning, and crop disease risk in your local language.
            </p>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1rem', display: 'flex', gap: '1.5rem', fontSize: '0.78rem', color: '#A5D6A7' }}>
            <div>✓ Downscaled Weather</div>
            <div>✓ Smart Irrigation</div>
            <div>✓ Voice Advisory</div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.35rem' }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
              Enter your credentials to access your GramMitraAI dashboard.
            </p>
          </div>

          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#FFEBEE', color: '#C53030', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                Mobile Number or Email
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={17} color="#64748B" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 9876543210 or ramesh@farmer.in"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={17} color="#64748B" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            {/* Role Selection for Demo convenience */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                Login As Role
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                {[
                  { id: 'ROLE_FARMER', label: '🌾 Farmer' },
                  { id: 'ROLE_OFFICER', label: '📊 Officer' },
                  { id: 'ROLE_ADMIN', label: '⚙ Admin' }
                ].map(r => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    style={{
                      padding: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: role === r.id ? 'var(--color-primary-green)' : 'var(--color-border)',
                      backgroundColor: role === r.id ? 'var(--color-light-green)' : '#FFFFFF',
                      color: role === r.id ? 'var(--color-dark-green)' : 'var(--color-secondary-text)',
                      cursor: 'pointer'
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gm-btn gm-btn-primary"
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontSize: '0.95rem' }}
            >
              {loading ? 'Logging in...' : 'LOGIN TO DASHBOARD'} <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--color-secondary-text)' }}>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              style={{ background: 'none', border: 'none', color: 'var(--color-primary-green)', fontWeight: 700, cursor: 'pointer' }}
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-card-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
