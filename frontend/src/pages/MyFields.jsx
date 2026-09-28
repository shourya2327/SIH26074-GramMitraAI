import React, { useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { InteractiveMap } from '../components/Map/InteractiveMap';
import { 
  Wheat, 
  MapPin, 
  Calendar, 
  Droplet, 
  Layers, 
  Trash2, 
  Edit3, 
  ExternalLink,
  PlusCircle,
  CheckCircle,
  Eye
} from 'lucide-react';

export const MyFields = ({ onNavigate }) => {
  const { savedFields, selectField, deleteField, activeField, addField } = useLocation();
  const [showAddModal, setShowAddModal] = useState(false);

  // New field state
  const [name, setName] = useState('');
  const [crop, setCrop] = useState('Wheat');
  const [area, setArea] = useState('2.5');
  const [soil, setSoil] = useState('Black Clay Loam');
  const [irrigation, setIrrigation] = useState('Drip Irrigation');
  const [sowingDate, setSowingDate] = useState('2025-11-15');

  const handleAddNewField = (e) => {
    e.preventDefault();
    const newF = {
      fieldName: name || `Khet ${savedFields.length + 1}`,
      cropName: crop,
      areaAcres: parseFloat(area),
      soilType: soil,
      irrigationType: irrigation,
      sowingDate: sowingDate,
      latitude: (selectedLocation?.latitude || 22.9734) + (Math.random() - 0.5) * 0.003,
      longitude: (selectedLocation?.longitude || 75.8267) + (Math.random() - 0.5) * 0.003,
      village: selectedLocation?.village || selectedLocation?.panchayat || "Local Farm",
      panchayat: selectedLocation?.panchayat || selectedLocation?.village || "Local Farm",
      block: selectedLocation?.block || "Local Block",
      district: selectedLocation?.district || "District",
      state: selectedLocation?.state || "State",
      boundary: [
        [22.9730, 75.8260],
        [22.9740, 75.8262],
        [22.9738, 75.8272],
        [22.9728, 75.8270]
      ]
    };
    addField(newF);
    setShowAddModal(false);
    setName('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
            🌾 My Farm Fields ({savedFields.length})
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)' }}>
            Manage your registered agricultural land plots, boundaries, crop cycles, and specific advisories.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="gm-btn gm-btn-primary"
          style={{ padding: '0.55rem 1.15rem' }}
        >
          <PlusCircle size={16} /> + Add New Field
        </button>
      </div>

      {/* Embedded Map for visual field overview */}
      <div className="gm-card" style={{ padding: '0.75rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={16} color="var(--color-primary-green)" />
          <span>Interactive Farm Overview (Green Polygons = Registered Fields)</span>
        </div>
        <InteractiveMap height="340px" showControls={true} allowDrawing={true} />
      </div>

      {/* Fields Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {savedFields.map(field => {
          const isSelected = activeField?.id === field.id;
          return (
            <div
              key={field.id}
              className="gm-card"
              style={{
                border: '1.5px solid',
                borderColor: isSelected ? 'var(--color-primary-green)' : 'var(--color-border)',
                backgroundColor: isSelected ? '#F6FAF6' : '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
                      {field.fieldName}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                      {field.village || field.panchayat}, {field.block} ({field.district})
                    </span>
                  </div>

                  <span className="gm-badge gm-badge-green" style={{ fontSize: '0.72rem' }}>
                    {field.areaAcres} Acres
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.65rem',
                  margin: '0.75rem 0',
                  padding: '0.75rem',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '8px',
                  fontSize: '0.78rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--color-secondary-text)', display: 'block' }}>Active Crop:</span>
                    <strong style={{ color: 'var(--color-dark-green)', fontSize: '0.85rem' }}>{field.cropName}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-secondary-text)', display: 'block' }}>Soil Type:</span>
                    <strong style={{ color: 'var(--color-dark-green)' }}>{field.soilType || 'Black Clay'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-secondary-text)', display: 'block' }}>Irrigation:</span>
                    <strong style={{ color: 'var(--color-dark-green)' }}>{field.irrigationType || 'Drip'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-secondary-text)', display: 'block' }}>Sowing Date:</span>
                    <strong style={{ color: 'var(--color-dark-green)' }}>{field.sowingDate || '15 Nov 2025'}</strong>
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)' }}>
                  Coordinates: Lat {field.latitude.toFixed(4)}°, Lon {field.longitude.toFixed(4)}°
                </div>
              </div>

              {/* Action Buttons for this Field */}
              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => selectField(field)}
                  className="gm-btn gm-btn-primary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                >
                  <Eye size={13} /> View Advisory
                </button>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => { selectField(field); onNavigate('smart-irrigation'); }}
                    className="gm-btn gm-btn-outline"
                    style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                    title="Smart Irrigation"
                  >
                    <Droplet size={13} color="#0284C7" />
                  </button>
                  <button
                    onClick={() => deleteField(field.id)}
                    className="gm-btn gm-btn-outline"
                    style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', color: '#DC2626', borderColor: '#FEE2E2' }}
                    title="Delete Field"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Field Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '1.75rem',
            width: '100%',
            maxWidth: '480px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.5rem' }}>
              🌾 Register New Agricultural Field
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', marginBottom: '1.25rem' }}>
              Fill in field attributes to enable crop-specific downscaled weather advisory.
            </p>

            <form onSubmit={handleAddNewField} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                  Field Name / Identifier
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Khet 4 - West Well Farm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                    Crop
                  </label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  >
                    <option value="Wheat">Wheat (गेहूँ)</option>
                    <option value="Soybean">Soybean (सोयाबीन)</option>
                    <option value="Gram / Chickpea">Gram (चना)</option>
                    <option value="Maize">Maize (मक्का)</option>
                    <option value="Cotton">Cotton (कपास)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                    Area (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                    Soil Type
                  </label>
                  <select
                    value={soil}
                    onChange={(e) => setSoil(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  >
                    <option value="Black Clay Loam">Black Clay Loam</option>
                    <option value="Deep Black Vertisol">Deep Black Vertisol</option>
                    <option value="Medium Black">Medium Black</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                    Irrigation Method
                  </label>
                  <select
                    value={irrigation}
                    onChange={(e) => setIrrigation(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  >
                    <option value="Drip Irrigation">Drip Irrigation</option>
                    <option value="Sprinkler">Sprinkler</option>
                    <option value="Flood / Furrow">Flood / Furrow</option>
                    <option value="Rainfed">Rainfed</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="gm-btn gm-btn-outline"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gm-btn gm-btn-primary"
                  style={{ padding: '0.5rem 1.25rem' }}
                >
                  Save Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
