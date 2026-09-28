import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useWeather } from '../context/WeatherContext';
import { ThumbsUp, ThumbsDown, CheckCircle2, RotateCcw, ShieldCheck, AlertCircle, MessageSquare } from 'lucide-react';

export const FeedbackLearning = () => {
  const { user } = useAuth();
  const { selectedLocation } = useLocation();
  const { weather } = useWeather();

  const [vote, setVote] = useState(null); // 'useful' or 'not-useful'
  const [observedWeather, setObservedWeather] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2.5rem' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
            🔄 Farmer Feedback & Controlled Self-Learning
          </h1>
          <span className="gm-badge gm-badge-green">Human-In-The-Loop AI</span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)' }}>
          Help improve GramMitraAI downscaling and crop advisory accuracy by sharing ground-truth field observations.
        </p>
      </div>

      {/* Controlled Retraining Pipeline Safeguard Banner */}
      <div style={{
        padding: '1rem 1.25rem',
        backgroundColor: '#F0FDF4',
        borderRadius: '8px',
        border: '1.5px solid #86EFAC',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem'
      }}>
        <ShieldCheck size={26} color="#16A34A" style={{ flexShrink: 0 }} />
        <div>
          <strong style={{ fontSize: '0.88rem', color: '#14532D', display: 'block' }}>
            Controlled Retraining Protocol Active
          </strong>
          <span style={{ fontSize: '0.78rem', color: '#166534', lineHeight: 1.5 }}>
            To safeguard agronomic safety, farmer feedback does <strong>not</strong> directly overwrite production ML weights automatically. Observations enter a staged validation pool, reviewed by Krishi Vigyan Kendra agronomists, before bi-weekly retrained model candidates are evaluated on hold-out test sets.
          </span>
        </div>
      </div>

      {/* Farmer Feedback Form */}
      <div className="gm-card" style={{ maxWidth: '680px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.35rem' }}>
          How accurate was today's weather & advisory in {selectedLocation.panchayat || "Dharampuri"}?
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)', marginBottom: '1.25rem' }}>
          Today's forecast predicted: {weather ? `${weather.rainfall} mm rainfall, ${weather.temperature}°C temp` : 'live weather parameters'} and advised appropriate irrigation actions.
        </p>

        {submitted ? (
          <div style={{ padding: '2rem 1.5rem', textAlign: 'center', backgroundColor: '#F8FAF8', borderRadius: '10px', border: '1px solid #C8E6C9' }}>
            <CheckCircle2 size={44} color="var(--color-primary-green)" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
              धन्यवाद! आपकी प्रतिक्रिया सुरक्षित रूप से दर्ज कर ली गई है।
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
              Your feedback has been logged into the GramMitraAI candidate retraining dataset (Batch #2026-B9).
            </p>
            <button
              onClick={() => { setSubmitted(false); setVote(null); setObservedWeather(''); setComment(''); }}
              className="gm-btn gm-btn-outline"
              style={{ marginTop: '1rem', padding: '0.45rem 1rem', fontSize: '0.8rem' }}
            >
              Submit Another Report
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Thumbs Up / Down */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '6px' }}>
                Was the advisory useful for your farm operations today?
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setVote('useful')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1.5px solid',
                    borderColor: vote === 'useful' ? 'var(--color-primary-green)' : 'var(--color-border)',
                    backgroundColor: vote === 'useful' ? 'var(--color-light-green)' : '#FFFFFF',
                    color: vote === 'useful' ? 'var(--color-dark-green)' : 'var(--color-secondary-text)',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.9rem'
                  }}
                >
                  <ThumbsUp size={18} color={vote === 'useful' ? 'var(--color-primary-green)' : '#64748B'} />
                  👍 Useful (उपयोगी थी)
                </button>

                <button
                  type="button"
                  onClick={() => setVote('not-useful')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1.5px solid',
                    borderColor: vote === 'not-useful' ? '#EF4444' : 'var(--color-border)',
                    backgroundColor: vote === 'not-useful' ? '#FEE2E2' : '#FFFFFF',
                    color: vote === 'not-useful' ? '#DC2626' : 'var(--color-secondary-text)',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.9rem'
                  }}
                >
                  <ThumbsDown size={18} color={vote === 'not-useful' ? '#EF4444' : '#64748B'} />
                  👎 Not Useful (अनुपयोगी)
                </button>
              </div>
            </div>

            {/* Ground Truth Observation */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                What weather actually happened on your field? (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. It rained heavily for 30 minutes (~20mm), advice to pause water was accurate!"
                value={observedWeather}
                onChange={(e) => setObservedWeather(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
              />
            </div>

            {/* Comments / suggestions */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                Any crop observations or remarks:
              </label>
              <textarea
                rows={3}
                placeholder="Write your feedback in Hindi, English, or your local language..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.85rem', fontFamily: 'inherit' }}
              />
            </div>

            <button
              type="submit"
              disabled={!vote}
              className="gm-btn gm-btn-primary"
              style={{ padding: '0.75rem', fontSize: '0.92rem' }}
            >
              Submit Feedback to Model Queue
            </button>
          </form>
        )}
      </div>

      {/* Model Retraining Pipeline Status Card */}
      <div className="gm-card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.75rem' }}>
          Candidate Model Retraining Pipeline Monitor
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.8rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
            <span style={{ color: 'var(--color-secondary-text)', display: 'block' }}>Staged Feedback Entries</span>
            <strong style={{ fontSize: '1.15rem', color: 'var(--color-dark-green)' }}>142 Observations</strong>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
            <span style={{ color: 'var(--color-secondary-text)', display: 'block' }}>Farmer Satisfaction</span>
            <strong style={{ fontSize: '1.15rem', color: '#16A34A' }}>92.4% Useful</strong>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
            <span style={{ color: 'var(--color-secondary-text)', display: 'block' }}>Active Production Model</span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--color-ai-accent)' }}>XGBoost-Ensemble-v2.4</strong>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
            <span style={{ color: 'var(--color-secondary-text)', display: 'block' }}>Validation Status</span>
            <strong style={{ fontSize: '0.95rem', color: '#0284C7' }}>Shadow Candidate-v2.5</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
