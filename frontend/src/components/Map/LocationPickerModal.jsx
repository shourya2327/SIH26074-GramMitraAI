import React from 'react';
import { InteractiveMap } from './InteractiveMap';
import { LocationHierarchySelector } from '../Location/LocationHierarchySelector';
import { useLocation } from '../../context/LocationContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, MapPin, Check } from 'lucide-react';

export const LocationPickerModal = ({ isOpen, onClose }) => {
  const { selectedLocation } = useLocation();
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.65)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        backdropFilter: 'blur(4px)'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '880px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FAFDF9'
        }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📍 Select Any Farm Location or Panchayat
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)' }}>
              Search any place in India or click anywhere on the map to retrieve downscaled weather.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Close Modal"
          >
            <X size={20} color="var(--color-dark-green)" />
          </button>
        </div>

        {/* State -> District -> Block -> Panchayat Selector */}
        <div style={{ padding: '0.85rem 0.85rem 0 0.85rem' }}>
          <LocationHierarchySelector compact={true} />
        </div>

        {/* Map Body */}
        <div style={{ padding: '0.85rem' }}>
          <InteractiveMap height="360px" showControls={true} allowDrawing={false} />
        </div>

        {/* Footer with selected location preview & Confirm */}
        <div style={{
          padding: '0.85rem 1.5rem',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', display: 'block' }}>Selected Location:</span>
            <strong style={{ fontSize: '0.92rem', color: 'var(--color-dark-green)' }}>
              {selectedLocation.panchayat || selectedLocation.village || "Selected Area"}, {selectedLocation.block} ({selectedLocation.district}, {selectedLocation.state})
            </strong>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onClose}
              className="gm-btn gm-btn-outline"
              style={{ padding: '0.55rem 1.25rem' }}
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="gm-btn gm-btn-primary"
              style={{ padding: '0.55rem 1.5rem' }}
            >
              <Check size={16} /> Confirm & Use Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
