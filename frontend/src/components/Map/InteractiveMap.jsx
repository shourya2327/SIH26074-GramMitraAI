import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from '../../context/LocationContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  MapPin, 
  Layers, 
  Navigation, 
  Search, 
  PlusCircle, 
  Compass, 
  Maximize2, 
  Check, 
  Trash2,
  Eye,
  Info,
  Globe
} from 'lucide-react';

const isValidCoord = (c) => typeof c === 'number' && !isNaN(c) && isFinite(c);

export const InteractiveMap = ({
  height = "440px",
  showControls = true,
  allowDrawing = true,
  activeOverlay = "all", // 'rain', 'temp', 'risk', 'all'
  onFieldCreated = null
}) => {
  const { 
    selectedLocation, 
    updateLocationByCoords, 
    savedFields, 
    addField, 
    calculatePolygonAreaAcres 
  } = useLocation();
  const { t } = useLanguage();

  const mapContainerRef = useRef(null);
  const leafletMap = useRef(null);
  const markerRef = useRef(null);
  const fieldsLayerGroupRef = useRef(null);
  const dynamicRiskGroupRef = useRef(null);
  const currentTileLayerRef = useRef(null);

  const [mapType, setMapType] = useState('hybrid'); // 'hybrid', 'street', 'satellite', 'terrain', 'osm'
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState([]);
  const [currentDrawnAcres, setCurrentDrawnAcres] = useState(0);

  // Field creation modal state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newFieldName, setNewFieldName] = useState('My New Field');
  const [newCropName, setNewCropName] = useState('Wheat');
  const [newSoilType, setNewSoilType] = useState('Black Clay Loam');
  const [newIrrigationType, setNewIrrigationType] = useState('Drip Irrigation');

  // Google Map Tile Providers
  const tileProviders = {
    // Google Hybrid: Satellite imagery with road networks and village / landmark labels
    hybrid: {
      name: 'Google Hybrid',
      url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      attribution: '&copy; Google Maps',
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    },
    // Google Maps Roadmap
    street: {
      name: 'Google Maps',
      url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      attribution: '&copy; Google Maps',
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    },
    // Google Pure Satellite
    satellite: {
      name: 'Google Satellite',
      url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      attribution: '&copy; Google Maps',
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    },
    // Google Terrain
    terrain: {
      name: 'Google Terrain',
      url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
      attribution: '&copy; Google Maps',
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    },
    // OpenStreetMap
    osm: {
      name: 'OpenStreetMap',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMap.current) {
      const initialLat = isValidCoord(selectedLocation?.latitude) ? selectedLocation.latitude : 22.9734;
      const initialLng = isValidCoord(selectedLocation?.longitude) ? selectedLocation.longitude : 75.8267;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: false,
        attributionControl: true
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Default tile layer: Google Hybrid for high-detail village/farm mapping
      const baseTile = L.tileLayer(tileProviders.hybrid.url, {
        attribution: tileProviders.hybrid.attribution,
        maxZoom: tileProviders.hybrid.maxZoom,
        subdomains: tileProviders.hybrid.subdomains
      }).addTo(map);
      currentTileLayerRef.current = baseTile;

      // Group for saved fields
      fieldsLayerGroupRef.current = L.layerGroup().addTo(map);
      // Group for dynamic local microclimate/risk circles
      dynamicRiskGroupRef.current = L.layerGroup().addTo(map);

      // Main pin marker for selected location
      const pinIcon = L.divIcon({
        className: 'custom-pin-icon',
        html: `
          <div style="
            position: relative;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              position: absolute;
              width: 14px;
              height: 14px;
              background-color: rgba(239, 68, 68, 0.4);
              border-radius: 50%;
              animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
            <div style="
              background-color: #EF4444; 
              width: 28px; 
              height: 28px; 
              border-radius: 50% 50% 50% 0; 
              transform: rotate(-45deg); 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              box-shadow: 0 4px 10px rgba(0,0,0,0.35); 
              border: 2px solid #FFFFFF;
            ">
              <span style="transform: rotate(45deg); font-size: 14px; line-height: 1;">📍</span>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      markerRef.current = L.marker([initialLat, initialLng], {
        icon: pinIcon,
        draggable: true,
        title: "Drag me or click anywhere on the map!"
      }).addTo(map);

      markerRef.current.on('dragend', async (e) => {
        const { lat, lng } = e.target.getLatLng();
        await updateLocationByCoords(lat, lng);
      });

      // Map Click Handler: Click ANY location on map!
      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        if (map._isDrawing) {
          // Add point to drawn boundary
          map._drawnCoords = map._drawnCoords || [];
          map._drawnCoords.push([lat, lng]);
          setDrawnPoints([...map._drawnCoords]);
          
          if (map._tempPolygon) map.removeLayer(map._tempPolygon);
          if (map._drawnCoords.length >= 2) {
            map._tempPolygon = L.polygon(map._drawnCoords, {
              color: '#16A34A',
              fillColor: '#4ADE80',
              fillOpacity: 0.45,
              weight: 3
            }).addTo(map);
          }

          if (map._drawnCoords.length >= 3) {
            const acres = calculatePolygonAreaAcres(map._drawnCoords);
            setCurrentDrawnAcres(acres);
          }
        } else {
          // Normal click - drop pin and reverse geocode real village
          markerRef.current.setLatLng([lat, lng]);
          await updateLocationByCoords(lat, lng);
        }
      });

      leafletMap.current = map;

      // Invalidate size to guarantee no blank/grey tile areas
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }

    return () => {
      // Map instance preserved
    };
  }, []);

  // Update center and marker when selectedLocation changes
  useEffect(() => {
    if (!leafletMap.current || !selectedLocation) return;
    const lat = selectedLocation.latitude;
    const lng = selectedLocation.longitude;
    if (!isValidCoord(lat) || !isValidCoord(lng)) return;

    try {
      const currentCenter = leafletMap.current.getCenter();
      if (currentCenter && isValidCoord(currentCenter.lat) && isValidCoord(currentCenter.lng)) {
        const dist = Math.abs(currentCenter.lat - lat) + Math.abs(currentCenter.lng - lng);
        if (dist > 0.0001) {
          leafletMap.current.setView([lat, lng], leafletMap.current.getZoom() || 14);
        }
      } else {
        leafletMap.current.setView([lat, lng], 14);
      }
    } catch (err) {
      console.warn("Leaflet setView safely caught:", err);
    }

    if (markerRef.current) {
      try {
        markerRef.current.setLatLng([lat, lng]);
      } catch (err) {
        console.warn("Marker setLatLng safely caught:", err);
      }
    }
  }, [selectedLocation]);

  // Render Saved Fields & Dynamic Local Agro-Met Overlays around selected coordinates
  useEffect(() => {
    if (!leafletMap.current) return;
    const map = leafletMap.current;

    // 1. Render Saved Farm Fields
    if (fieldsLayerGroupRef.current) {
      fieldsLayerGroupRef.current.clearLayers();
      savedFields.forEach(f => {
        if (f.boundary && f.boundary.length >= 3) {
          const poly = L.polygon(f.boundary, {
            color: '#15803D',
            fillColor: '#22C55E',
            fillOpacity: 0.35,
            weight: 2
          });
          poly.bindPopup(`
            <div style="font-family: inherit; font-size: 13px; line-height: 1.4;">
              <strong style="color: #166534; font-size: 14px;">🌾 ${f.fieldName}</strong><br/>
              <span>Crop: <strong>${f.cropName}</strong></span><br/>
              <span>Area: <strong>${f.areaAcres} Acres</strong></span><br/>
              <span>Soil: ${f.soilType || 'Black Clay Loam'}</span><br/>
              <span style="color: #64748B; font-size: 11px;">${f.village || f.panchayat || ''}</span>
            </div>
          `);
          fieldsLayerGroupRef.current.addLayer(poly);
        }
      });
    }

    // 2. Render Dynamic Local Agro-Met Risk Zones around currently selected coordinates (never fixed to Sanwer!)
    if (dynamicRiskGroupRef.current && selectedLocation) {
      dynamicRiskGroupRef.current.clearLayers();
      const lat = selectedLocation.latitude;
      const lng = selectedLocation.longitude;
      if (!isValidCoord(lat) || !isValidCoord(lng)) return;
      const locName = selectedLocation.village || selectedLocation.panchayat || "Active Farm Zone";

      // Center Zone Circle (Current Farm Field)
      const centerCircle = L.circle([lat, lng], {
        radius: 900,
        color: '#10B981',
        fillColor: '#10B981',
        fillOpacity: 0.22,
        weight: 2
      });
      centerCircle.bindPopup(`
        <div style="font-family: inherit; font-size: 12px;">
          <strong style="color: #065F46; font-size: 13px;">📍 ${locName}</strong><br/>
          <span>Tehsil/Block: <strong>${selectedLocation.block || 'Local Area'}</strong></span><br/>
          <span>District: <strong>${selectedLocation.district || ''}</strong></span><br/>
          <span>Elevation: <strong>${selectedLocation.elevation_m || 520}m MSL</strong></span><br/>
          <span>NDVI Index: <strong>${selectedLocation.ndvi || 0.62}</strong></span><br/>
          <span style="display: inline-block; margin-top: 4px; padding: 2px 6px; background: #DCFCE7; color: #166534; border-radius: 4px; font-weight: 700;">Weather Risk: Normal</span>
        </div>
      `);
      dynamicRiskGroupRef.current.addLayer(centerCircle);

      // Neighboring Microclimate Sector East
      const eastCircle = L.circle([lat + 0.012, lng + 0.015], {
        radius: 1100,
        color: '#F59E0B',
        fillColor: '#F59E0B',
        fillOpacity: 0.18,
        weight: 1.5,
        dashArray: '4, 4'
      });
      eastCircle.bindPopup(`
        <div style="font-family: inherit; font-size: 12px;">
          <strong style="color: #92400E;">Neighboring Drainage Sector</strong><br/>
          <span>Moderate Risk Index (Runoff sensitivity)</span>
        </div>
      `);
      dynamicRiskGroupRef.current.addLayer(eastCircle);
    }
  }, [savedFields, selectedLocation, activeOverlay]);

  // Switch Google Maps Layer
  const handleSwitchLayer = (type) => {
    if (!leafletMap.current || !tileProviders[type]) return;
    const map = leafletMap.current;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const provider = tileProviders[type];
    const newLayer = L.tileLayer(provider.url, {
      attribution: provider.attribution,
      maxZoom: provider.maxZoom,
      subdomains: provider.subdomains || []
    }).addTo(map);

    currentTileLayerRef.current = newLayer;
    setMapType(type);
  };

  // Current GPS location trigger
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          await updateLocationByCoords(latitude, longitude);
          if (leafletMap.current) {
            leafletMap.current.setView([latitude, longitude], 15);
          }
        },
        (err) => {
          alert("Location access denied or unavailable. Please click anywhere directly on the map to set your location.");
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Search location handler using OpenStreetMap Nominatim
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ", India")}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        const item = data[0];
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        await updateLocationByCoords(lat, lon);
        if (leafletMap.current) {
          leafletMap.current.setView([lat, lon], 14);
        }
        setSearchQuery('');
      } else {
        alert(`Location "${searchQuery}" not found. You can navigate the map and click directly on your farm.`);
      }
    } catch (err) {
      alert("Search service currently busy. You can click anywhere on the Google Map directly.");
    } finally {
      setIsSearching(false);
    }
  };

  // Drawing Mode Controls
  const toggleDrawingMode = () => {
    if (!leafletMap.current) return;
    const nextState = !isDrawingMode;
    setIsDrawingMode(nextState);
    leafletMap.current._isDrawing = nextState;
    if (nextState) {
      leafletMap.current._drawnCoords = [];
      setDrawnPoints([]);
      setCurrentDrawnAcres(0);
    } else {
      if (leafletMap.current._tempPolygon) {
        leafletMap.current.removeLayer(leafletMap.current._tempPolygon);
      }
    }
  };

  const handleFinishBoundary = () => {
    if (drawnPoints.length < 3) {
      alert("Please click at least 3 points on the map to trace your field's border.");
      return;
    }
    setShowSaveModal(true);
  };

  const handleConfirmSaveField = () => {
    const area = currentDrawnAcres > 0 ? currentDrawnAcres : 2.5;
    const fallbackLat = isValidCoord(selectedLocation?.latitude) ? selectedLocation.latitude : 22.9734;
    const fallbackLng = isValidCoord(selectedLocation?.longitude) ? selectedLocation.longitude : 75.8267;
    const centerPoint = drawnPoints.length > 0 ? drawnPoints[0] : [fallbackLat, fallbackLng];

    const newFieldObj = {
      fieldName: newFieldName,
      cropName: newCropName,
      soilType: newSoilType,
      irrigationType: newIrrigationType,
      areaAcres: area,
      latitude: centerPoint[0],
      longitude: centerPoint[1],
      village: selectedLocation.village || selectedLocation.panchayat || "Local Farm",
      panchayat: selectedLocation.panchayat || selectedLocation.village || "Local Farm",
      block: selectedLocation.block || "Tehsil",
      district: selectedLocation.district || "District",
      state: selectedLocation.state || "State",
      boundary: drawnPoints.length > 0 ? drawnPoints : [
        [centerPoint[0] - 0.001, centerPoint[1] - 0.001],
        [centerPoint[0] + 0.001, centerPoint[1] - 0.001],
        [centerPoint[0] + 0.001, centerPoint[1] + 0.001],
        [centerPoint[0] - 0.001, centerPoint[1] + 0.001]
      ]
    };

    addField(newFieldObj);
    if (onFieldCreated) onFieldCreated(newFieldObj);

    setShowSaveModal(false);
    setIsDrawingMode(false);
    if (leafletMap.current) {
      leafletMap.current._isDrawing = false;
      if (leafletMap.current._tempPolygon) {
        leafletMap.current.removeLayer(leafletMap.current._tempPolygon);
      }
    }
    setDrawnPoints([]);
    alert(`Field "${newFieldName}" (${area} Acres) successfully saved to My Fields!`);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: height, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
      
      {/* Top Map Controls Bar */}
      {showControls && (
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          zIndex: 400,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          {/* Search Bar */}
          <form 
            onSubmit={handleSearch} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: '#FFFFFF', 
              borderRadius: 'var(--radius-full)', 
              padding: '4px 12px', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: '1px solid var(--color-border)',
              pointerEvents: 'auto',
              minWidth: '260px',
              maxWidth: '380px'
            }}
          >
            <Search size={16} color="var(--color-secondary-text)" />
            <input
              type="text"
              placeholder={t('searchLocation') || "Search village, tehsil or district..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                padding: '6px 8px',
                fontSize: '0.85rem',
                width: '100%',
                fontFamily: 'inherit'
              }}
            />
            <button 
              type="submit" 
              className="gm-btn gm-btn-primary" 
              style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: 'var(--radius-full)' }}
              disabled={isSearching}
            >
              {isSearching ? '...' : 'Search'}
            </button>
          </form>

          {/* Map Layer Switcher: Google Hybrid, Google Maps, Satellite */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'auto', flexWrap: 'wrap' }}>
            <div style={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: 'var(--radius-full)', 
              padding: '2px', 
              display: 'flex', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)', 
              border: '1px solid var(--color-border)' 
            }}>
              <button
                type="button"
                onClick={() => handleSwitchLayer('hybrid')}
                style={{
                  padding: '5px 11px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: mapType === 'hybrid' ? 'var(--color-primary-green)' : 'transparent',
                  color: mapType === 'hybrid' ? '#FFFFFF' : 'var(--color-primary-text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Google Satellite with Village & Road Labels"
              >
                🛰 Google Hybrid
              </button>
              <button
                type="button"
                onClick={() => handleSwitchLayer('street')}
                style={{
                  padding: '5px 11px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: mapType === 'street' ? 'var(--color-primary-green)' : 'transparent',
                  color: mapType === 'street' ? '#FFFFFF' : 'var(--color-primary-text)'
                }}
                title="Google Standard Map"
              >
                🗺 Map
              </button>
              <button
                type="button"
                onClick={() => handleSwitchLayer('satellite')}
                style={{
                  padding: '5px 11px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: mapType === 'satellite' ? 'var(--color-primary-green)' : 'transparent',
                  color: mapType === 'satellite' ? '#FFFFFF' : 'var(--color-primary-text)'
                }}
                title="Google Pure Satellite Imagery"
              >
                Satellite
              </button>
              <button
                type="button"
                onClick={() => handleSwitchLayer('terrain')}
                style={{
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: mapType === 'terrain' ? 'var(--color-primary-green)' : 'transparent',
                  color: mapType === 'terrain' ? '#FFFFFF' : 'var(--color-primary-text)'
                }}
                title="Google Terrain with Contour Relief"
              >
                Terrain
              </button>
            </div>

            {/* Current GPS button */}
            <button
              type="button"
              onClick={handleCurrentLocation}
              className="gm-btn gm-btn-outline"
              style={{ backgroundColor: '#FFFFFF', padding: '6px 12px', fontSize: '0.75rem', borderRadius: 'var(--radius-full)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
              title="Locate my actual farm with device GPS"
            >
              <Navigation size={14} color="var(--color-primary-green)" />
              <span>GPS</span>
            </button>

            {/* Field Boundary Drawing Mode */}
            {allowDrawing && (
              <button
                type="button"
                onClick={toggleDrawingMode}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: isDrawingMode ? '#EF4444' : '#FFFFFF',
                  color: isDrawingMode ? '#FFFFFF' : 'var(--color-dark-green)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                {isDrawingMode ? '✕ Cancel' : '✏ Draw Field'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Drawing Mode Active Status Ribbon */}
      {isDrawingMode && (
        <div style={{
          position: 'absolute',
          top: '68px',
          left: '12px',
          right: '12px',
          zIndex: 400,
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid #16A34A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backdropFilter: 'blur(4px)'
        }}>
          <div>
            <span style={{ fontWeight: 700, color: 'var(--color-dark-green)', fontSize: '0.85rem' }}>
              📍 Click corners of your field on the map ({drawnPoints.length} points plotted)
            </span>
            {currentDrawnAcres > 0 && (
              <span style={{ marginLeft: '12px', fontWeight: 800, color: '#16A34A', fontSize: '0.85rem' }}>
                Calculated Area: {currentDrawnAcres} Acres
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                if (leafletMap.current) {
                  leafletMap.current._drawnCoords = [];
                  if (leafletMap.current._tempPolygon) leafletMap.current.removeLayer(leafletMap.current._tempPolygon);
                }
                setDrawnPoints([]);
                setCurrentDrawnAcres(0);
              }}
              style={{ padding: '4px 8px', fontSize: '0.75rem', border: '1px solid #DDE8DD', borderRadius: '4px', cursor: 'pointer', background: '#F8FAFC' }}
            >
              Reset Points
            </button>
            <button
              onClick={handleFinishBoundary}
              disabled={drawnPoints.length < 3}
              className="gm-btn gm-btn-primary"
              style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: '4px' }}
            >
              ✓ Complete & Save Field
            </button>
          </div>
        </div>
      )}

      {/* Map Target Pin & Coordinate Box at Bottom Left */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        zIndex: 400,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '8px 14px',
        borderRadius: 'var(--radius-sm)',
        boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
        border: '1px solid var(--color-border)',
        fontSize: '0.78rem',
        maxWidth: '380px',
        backdropFilter: 'blur(5px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: 'var(--color-dark-green)' }}>
          <MapPin size={15} color="#EF4444" />
          <span>
            {selectedLocation.village || selectedLocation.panchayat || "Selected Location"}
            {selectedLocation.block ? `, ${selectedLocation.block}` : ''}
            {selectedLocation.district ? ` (${selectedLocation.district})` : ''}
          </span>
        </div>
        <div style={{ color: 'var(--color-secondary-text)', fontSize: '0.72rem', marginTop: '2px' }}>
          Lat: {isValidCoord(selectedLocation?.latitude) ? selectedLocation.latitude.toFixed(4) : '22.9734'}° N, Lon: {isValidCoord(selectedLocation?.longitude) ? selectedLocation.longitude.toFixed(4) : '75.8267'}° E • {selectedLocation?.elevation_m || 520}m MSL
        </div>
        <div style={{ marginTop: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setShowSaveModal(true)}
            style={{
              padding: '3px 9px',
              fontSize: '0.72rem',
              fontWeight: 700,
              backgroundColor: 'var(--color-light-green)',
              color: 'var(--color-dark-green)',
              border: '1px solid #C8E6C9',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            + Save as My Field
          </button>
          <span style={{ fontSize: '0.68rem', color: '#16A34A', fontWeight: 600 }}>
            ✓ Click anywhere to relocate
          </span>
        </div>
      </div>

      {/* The Leaflet Map Div */}
      <div 
        ref={mapContainerRef} 
        style={{ width: '100%', height: '100%', minHeight: '300px', backgroundColor: '#E2E8F0' }} 
      />

      {/* Save Field Modal Form */}
      {showSaveModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '460px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--color-border)'
          }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-dark-green)', marginBottom: '0.5rem', fontWeight: 800 }}>
              🌾 Add & Save New Field
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', marginBottom: '1rem' }}>
              Location: <strong>{selectedLocation?.village || selectedLocation?.panchayat || "Local Farm"}</strong> ({isValidCoord(selectedLocation?.latitude) ? selectedLocation.latitude : '22.9734'}, {isValidCoord(selectedLocation?.longitude) ? selectedLocation.longitude : '75.8267'})
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', display: 'block', marginBottom: '3px' }}>
                  Field Name
                </label>
                <input
                  type="text"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', display: 'block', marginBottom: '3px' }}>
                    Crop Sown
                  </label>
                  <select
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  >
                    <option value="Wheat">Wheat (गेहूँ)</option>
                    <option value="Soybean">Soybean (सोयाबीन)</option>
                    <option value="Gram / Chickpea">Gram (चना)</option>
                    <option value="Maize">Maize (मक्का)</option>
                    <option value="Cotton">Cotton (कपास)</option>
                    <option value="Vegetables">Vegetables (सब्जियां)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', display: 'block', marginBottom: '3px' }}>
                    Area (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={currentDrawnAcres > 0 ? currentDrawnAcres : 2.5}
                    onChange={(e) => setCurrentDrawnAcres(parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', display: 'block', marginBottom: '3px' }}>
                    Soil Type
                  </label>
                  <select
                    value={newSoilType}
                    onChange={(e) => setNewSoilType(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  >
                    <option value="Black Clay Loam">Black Clay Loam</option>
                    <option value="Deep Black Vertisol">Deep Black Vertisol</option>
                    <option value="Medium Black">Medium Black</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Clay Loam">Clay Loam</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', display: 'block', marginBottom: '3px' }}>
                    Irrigation Method
                  </label>
                  <select
                    value={newIrrigationType}
                    onChange={(e) => setNewIrrigationType(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  >
                    <option value="Drip Irrigation">Drip Irrigation</option>
                    <option value="Sprinkler">Sprinkler</option>
                    <option value="Flood / Furrow">Flood / Furrow</option>
                    <option value="Rainfed">Rainfed (बारानी)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="gm-btn gm-btn-outline"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSaveField}
                  className="gm-btn gm-btn-primary"
                  style={{ padding: '0.5rem 1.25rem' }}
                >
                  Save Field
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
