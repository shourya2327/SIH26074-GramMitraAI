import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, UserPlus, Phone, Lock, Mail, MapPin, Globe } from 'lucide-react';

export const Register = ({ onSwitchToLogin }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    state: '',
    district: '',
    block: '',
    panchayat: '',
    preferredLanguage: 'hi',
    role: 'ROLE_FARMER'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate backend call to Spring Boot /api/auth/register
    setTimeout(() => {
      login({
        id: Date.now(),
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        role: formData.role,
        preferredLanguage: formData.preferredLanguage,
        state: formData.state,
        district: formData.district,
        block: formData.block,
        panchayat: formData.panchayat
      }, 'demo-jwt-token-active-registered');
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: 'var(--color-bg)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem'
    }}>
      <div style={{
        maxWidth: '680px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)'
      }}>
        <button
          onClick={onSwitchToLogin}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'none',
            border: 'none',
            color: 'var(--color-primary-green)',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '1.25rem',
            fontSize: '0.85rem'
          }}
        >
          <ArrowLeft size={16} /> Back to Login
        </button>

        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.35rem' }}>
            🌾 Create New GramMitraAI Account
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
            Join India's AI-Powered Panchayat-Level Agricultural Platform.
          </p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: '#FFEBEE', color: '#C53030', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Ramesh Patel"
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobileNumber"
                required
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="9876543210"
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="farmer@example.com"
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                Preferred Language
              </label>
              <select
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
              >
                <option value="hi">हिंदी (Hindi)</option>
                <option value="en">English</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="bn">বাংলা (Bengali)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                Password *
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Administrative Hierarchy */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-secondary-text)', letterSpacing: '0.05em' }}>
              ADMINISTRATIVE PANCHAYAT LOCATION
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>State</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>District</label>
              <input type="text" name="district" value={formData.district} onChange={handleChange} style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>Block / Tehsil</label>
              <input type="text" name="block" value={formData.block} onChange={handleChange} style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>Gram Panchayat</label>
              <input type="text" name="panchayat" value={formData.panchayat} onChange={handleChange} style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }} />
            </div>
          </div>

          {/* Role selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
              Select Role
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { id: 'ROLE_FARMER', label: '🌾 Farmer' },
                { id: 'ROLE_OFFICER', label: '📊 Agri Officer' },
                { id: 'ROLE_ADMIN', label: '⚙ Admin' }
              ].map(r => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setFormData({ ...formData, role: r.id })}
                  style={{
                    padding: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: formData.role === r.id ? 'var(--color-primary-green)' : 'var(--color-border)',
                    backgroundColor: formData.role === r.id ? 'var(--color-light-green)' : '#FFFFFF',
                    color: formData.role === r.id ? 'var(--color-dark-green)' : 'var(--color-secondary-text)',
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
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.75rem', fontSize: '0.95rem' }}
          >
            {loading ? 'Creating Account...' : 'REGISTER & PROCEED TO DASHBOARD'}
          </button>
        </form>
      </div>
    </div>
  );
};
