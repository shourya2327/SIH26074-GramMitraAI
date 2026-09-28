import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from '../../context/LocationContext';
import { useWeather } from '../../context/WeatherContext';
import {
  getStates,
  getDistricts,
  getBlocks,
  getPanchayats,
  getVillages,
  searchLocations,
  DEFAULT_VILLAGE
} from '../../services/locationDataService';
import { 
  MapPin, 
  RefreshCw, 
  Compass, 
  ChevronDown, 
  Search, 
  X, 
  Layers, 
  Check, 
  AlertCircle, 
  Mountain, 
  Sprout, 
  Activity,
  Hash
} from 'lucide-react';

export const LocationHierarchySelector = ({ compact = false, onVillageSelected = null, onPanchayatSelected = null }) => {
  const { selectedLocation, setSelectedLocation } = useLocation();
  const { loading: weatherLoading, refetchWeather } = useWeather();

  const states = getStates();

  // 5 Cascading dropdown states
  const [selectedState, setSelectedState] = useState(() => selectedLocation?.state || "Madhya Pradesh");
  const [selectedDistrict, setSelectedDistrict] = useState(() => selectedLocation?.district || "Indore");
  const [selectedBlock, setSelectedBlock] = useState(() => selectedLocation?.block || "Sanwer");
  const [selectedPanchayatName, setSelectedPanchayatName] = useState(() => selectedLocation?.panchayat || "Dharampuri");
  const [selectedVillageName, setSelectedVillageName] = useState(() => selectedLocation?.village || "Dharampuri");

  // Dependent lists
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [panchayats, setPanchayats] = useState([]);
  const [villages, setVillages] = useState([]);

  // Granular loading states for each hierarchy step
  const [loadingState, setLoadingState] = useState({
    districts: false,
    blocks: false,
    panchayats: false,
    villages: false
  });

  // Search box states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef(null);

  // Synchronize with external changes (e.g. Map click, GPS reverse geocode)
  useEffect(() => {
    if (selectedLocation) {
      if (selectedLocation.state && states.includes(selectedLocation.state)) {
        setSelectedState(selectedLocation.state);
      }
      if (selectedLocation.district) {
        setSelectedDistrict(selectedLocation.district);
      }
      if (selectedLocation.block) {
        setSelectedBlock(selectedLocation.block);
      }
      if (selectedLocation.panchayat) {
        setSelectedPanchayatName(selectedLocation.panchayat);
      }
      if (selectedLocation.village) {
        setSelectedVillageName(selectedLocation.village);
      }
    }
  }, [
    selectedLocation?.state, 
    selectedLocation?.district, 
    selectedLocation?.block, 
    selectedLocation?.panchayat, 
    selectedLocation?.village
  ]);

  // Load districts when selectedState changes
  useEffect(() => {
    setLoadingState(prev => ({ ...prev, districts: true }));
    const distList = getDistricts(selectedState);
    setDistricts(distList);
    setLoadingState(prev => ({ ...prev, districts: false }));
  }, [selectedState]);

  // Load blocks when selectedDistrict changes
  useEffect(() => {
    if (!selectedState || !selectedDistrict) {
      setBlocks([]);
      return;
    }
    setLoadingState(prev => ({ ...prev, blocks: true }));
    const blkList = getBlocks(selectedState, selectedDistrict);
    setBlocks(blkList);
    setLoadingState(prev => ({ ...prev, blocks: false }));
  }, [selectedState, selectedDistrict]);

  // Load panchayats when selectedBlock changes
  useEffect(() => {
    if (!selectedState || !selectedDistrict || !selectedBlock) {
      setPanchayats([]);
      return;
    }
    setLoadingState(prev => ({ ...prev, panchayats: true }));
    const pList = getPanchayats(selectedState, selectedDistrict, selectedBlock);
    setPanchayats(pList);
    setLoadingState(prev => ({ ...prev, panchayats: false }));
  }, [selectedState, selectedDistrict, selectedBlock]);

  // Load villages when selectedPanchayatName changes
  useEffect(() => {
    let isCancelled = false;
    if (!selectedState || !selectedDistrict || !selectedBlock || !selectedPanchayatName) {
      setVillages([]);
      return;
    }

    setLoadingState(prev => ({ ...prev, villages: true }));
    getVillages(selectedState, selectedDistrict, selectedBlock, selectedPanchayatName)
      .then(vList => {
        if (!isCancelled) {
          setVillages(vList);
          setLoadingState(prev => ({ ...prev, villages: false }));
        }
      })
      .catch(err => {
        if (!isCancelled) {
          console.error("Failed to load villages:", err);
          setVillages([]);
          setLoadingState(prev => ({ ...prev, villages: false }));
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedState, selectedDistrict, selectedBlock, selectedPanchayatName]);

  // Apply selected village data to global LocationContext
  const applyVillage = useCallback((village) => {
    if (!village) return;

    const formattedAddress = `${village.name}, ${village.panchayat || ''}, ${village.block || ''}, ${village.district || ''}, ${village.state || ''}`
      .replace(/,\s*,/g, ',')
      .replace(/^,\s*|,\s*$/g, '');

    const updated = {
      village: village.name,
      village_code: village.code || null,
      panchayat: village.panchayat || selectedPanchayatName,
      panchayat_code: village.panchayat_code || null,
      block: village.block || selectedBlock,
      block_code: village.block_code || null,
      district: village.district || selectedDistrict,
      district_code: village.district_code || null,
      state: village.state || selectedState,
      state_code: village.state_code || null,
      latitude: (typeof village.latitude === 'number' && !isNaN(village.latitude)) ? village.latitude : null,
      longitude: (typeof village.longitude === 'number' && !isNaN(village.longitude)) ? village.longitude : null,
      address: formattedAddress,
      elevation_m: (typeof village.elevation_m === 'number' && !isNaN(village.elevation_m)) ? village.elevation_m : null,
      soil_type: village.soil_type || null,
      ndvi: (typeof village.ndvi === 'number' && !isNaN(village.ndvi)) ? village.ndvi : null,
      distance_to_water_km: (typeof village.distance_to_water_km === 'number' && !isNaN(village.distance_to_water_km)) ? village.distance_to_water_km : null
    };

    setSelectedLocation(updated);

    if (onVillageSelected) onVillageSelected(updated);
    if (onPanchayatSelected) onPanchayatSelected(updated);
  }, [selectedPanchayatName, selectedBlock, selectedDistrict, selectedState, setSelectedLocation, onVillageSelected, onPanchayatSelected]);

  // Handle 1. State Change (Resets District, Block, Panchayat, Village)
  const handleStateChange = async (newState) => {
    setSelectedState(newState);

    // 1. Reset District
    const nextDistricts = getDistricts(newState);
    const nextDistrict = nextDistricts[0] || "";
    setSelectedDistrict(nextDistrict);

    // 2. Reset Block
    const nextBlocks = getBlocks(newState, nextDistrict);
    const nextBlock = nextBlocks[0] || "";
    setSelectedBlock(nextBlock);

    // 3. Reset Panchayat
    const nextPanchayats = getPanchayats(newState, nextDistrict, nextBlock);
    const nextPanchayat = nextPanchayats[0]?.name || "";
    setSelectedPanchayatName(nextPanchayat);

    // 4. Reset Village
    const nextVillages = await getVillages(newState, nextDistrict, nextBlock, nextPanchayat);
    const nextVillage = nextVillages[0] || null;
    if (nextVillage) {
      setSelectedVillageName(nextVillage.name);
      applyVillage(nextVillage);
    } else {
      setSelectedVillageName("");
    }
  };

  // Handle 2. District Change (Resets Block, Panchayat, Village)
  const handleDistrictChange = async (newDistrict) => {
    setSelectedDistrict(newDistrict);

    // 1. Reset Block
    const nextBlocks = getBlocks(selectedState, newDistrict);
    const nextBlock = nextBlocks[0] || "";
    setSelectedBlock(nextBlock);

    // 2. Reset Panchayat
    const nextPanchayats = getPanchayats(selectedState, newDistrict, nextBlock);
    const nextPanchayat = nextPanchayats[0]?.name || "";
    setSelectedPanchayatName(nextPanchayat);

    // 3. Reset Village
    const nextVillages = await getVillages(selectedState, newDistrict, nextBlock, nextPanchayat);
    const nextVillage = nextVillages[0] || null;
    if (nextVillage) {
      setSelectedVillageName(nextVillage.name);
      applyVillage(nextVillage);
    } else {
      setSelectedVillageName("");
    }
  };

  // Handle 3. Block Change (Resets Panchayat, Village)
  const handleBlockChange = async (newBlock) => {
    setSelectedBlock(newBlock);

    // 1. Reset Panchayat
    const nextPanchayats = getPanchayats(selectedState, selectedDistrict, newBlock);
    const nextPanchayat = nextPanchayats[0]?.name || "";
    setSelectedPanchayatName(nextPanchayat);

    // 2. Reset Village
    const nextVillages = await getVillages(selectedState, selectedDistrict, newBlock, nextPanchayat);
    const nextVillage = nextVillages[0] || null;
    if (nextVillage) {
      setSelectedVillageName(nextVillage.name);
      applyVillage(nextVillage);
    } else {
      setSelectedVillageName("");
    }
  };

  // Handle 4. Panchayat Change (Resets Village)
  const handlePanchayatChange = async (newPanchayatName) => {
    setSelectedPanchayatName(newPanchayatName);

    // 1. Reset Village
    const nextVillages = await getVillages(selectedState, selectedDistrict, selectedBlock, newPanchayatName);
    const nextVillage = nextVillages[0] || null;
    if (nextVillage) {
      setSelectedVillageName(nextVillage.name);
      applyVillage(nextVillage);
    } else {
      setSelectedVillageName("");
    }
  };

  // Handle 5. Village Change
  const handleVillageChange = (vName) => {
    setSelectedVillageName(vName);
    const target = villages.find(v => v.name === vName);
    if (target) {
      applyVillage(target);
    }
  };

  // Debounced Search Handler
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchLocations(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle Select from Search Box
  const handleSelectSearchResult = (result) => {
    setShowSearchResults(false);
    setSearchQuery("");

    // Populate all 5 hierarchy levels automatically
    if (result.state) setSelectedState(result.state);
    if (result.district) setSelectedDistrict(result.district);
    if (result.block) setSelectedBlock(result.block);
    if (result.panchayat) setSelectedPanchayatName(result.panchayat);
    if (result.village) setSelectedVillageName(result.village);

    applyVillage(result.villageData || {
      name: result.village,
      code: result.village_code,
      panchayat: result.panchayat,
      block: result.block,
      district: result.district,
      state: result.state,
      latitude: result.latitude,
      longitude: result.longitude,
      elevation_m: result.elevation_m,
      soil_type: result.soil_type,
      ndvi: result.ndvi
    });
  };

  // Close search suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Display coordinates helper
  const latDisplay = selectedLocation?.latitude !== null && selectedLocation?.latitude !== undefined
    ? `${selectedLocation.latitude.toFixed(4)}°N`
    : "Coordinates unavailable for this location";

  const lonDisplay = selectedLocation?.longitude !== null && selectedLocation?.longitude !== undefined
    ? `${selectedLocation.longitude.toFixed(4)}°E`
    : "Coordinates unavailable for this location";

  const elevationDisplay = selectedLocation?.elevation_m !== null && selectedLocation?.elevation_m !== undefined
    ? `${selectedLocation.elevation_m} m MSL`
    : "Data unavailable";

  const soilDisplay = selectedLocation?.soil_type || "Data unavailable";
  const ndviDisplay = (selectedLocation?.ndvi !== null && selectedLocation?.ndvi !== undefined) 
    ? selectedLocation.ndvi 
    : "Data unavailable";

  const villageCodeDisplay = selectedLocation?.village_code || "Data unavailable";

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-md)',
      padding: compact ? '0.75rem 1rem' : '1rem 1.25rem',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.85rem'
    }}>
      {/* Top Bar: Title, Hierarchy breadcrumb badge, and Refresh Forecast button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Compass size={18} color="var(--color-primary-green)" />
            <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--color-dark-green)', letterSpacing: '-0.01em' }}>
              संपूर्ण भारत पदानुक्रमित स्थान चयन / Complete India Location Hierarchy:
            </span>
          </div>
          <span style={{
            fontSize: '0.72rem',
            color: 'var(--color-secondary-text)',
            backgroundColor: '#F1F5F9',
            padding: '3px 9px',
            borderRadius: '4px',
            fontWeight: 600
          }}>
            State → District → Block → Panchayat → Village
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={refetchWeather}
            disabled={weatherLoading}
            className="gm-btn gm-btn-outline"
            style={{ padding: '0.35rem 0.85rem', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Refresh weather for currently selected village from Open-Meteo API"
          >
            <RefreshCw size={13} className={weatherLoading ? "spin-animation" : ""} />
            <span>{weatherLoading ? "Fetching weather..." : "Refresh Forecast"}</span>
          </button>
        </div>
      </div>

      {/* Global Location Search Box */}
      <div ref={searchContainerRef} style={{ position: 'relative', width: '100%' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            placeholder="🔍 पूरे भारत में खोजें / Search Village, Panchayat, Block, or District (e.g. Dharampuri, Sualkuchi, Watika, Indore)..."
            className="gm-input"
            style={{
              width: '100%',
              paddingLeft: '34px',
              paddingRight: searchQuery ? '32px' : '12px',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              fontSize: '0.84rem',
              backgroundColor: '#F8FAFC',
              borderColor: '#CBD5E1',
              borderRadius: '6px'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setShowSearchResults(false); }}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748B',
                padding: '4px'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && searchQuery.trim().length >= 2 && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            borderRadius: '6px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            border: '1px solid #E2E8F0',
            zIndex: 999,
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {isSearching ? (
              <div style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw size={14} className="spin-animation" />
                <span>स्थान खोजा जा रहा है... / Searching locations across India...</span>
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((res, index) => (
                <div
                  key={`${res.village}-${res.district}-${index}`}
                  onClick={() => handleSelectSearchResult(res)}
                  style={{
                    padding: '0.65rem 1rem',
                    borderBottom: index < searchResults.length - 1 ? '1px solid #F1F5F9' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0FDF4'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={15} color="var(--color-primary-green)" style={{ flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--color-dark-green)' }}>
                        {res.village} {res.village_hi && res.village_hi !== res.village ? `(${res.village_hi})` : ''}
                      </div>
                      <div style={{ fontSize: '0.73rem', color: '#64748B' }}>
                        {res.panchayat ? `GP: ${res.panchayat}` : ''} • Block: {res.block} • Dist: {res.district} • {res.state}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    {res.village_code && (
                      <span className="gm-badge gm-badge-blue" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                        ID: {res.village_code}
                      </span>
                    )}
                    {res.latitude && res.longitude && (
                      <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '2px' }}>
                        {res.latitude.toFixed(2)}°N, {res.longitude.toFixed(2)}°E
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#94A3B8', textAlign: 'center' }}>
                कोई स्थान नहीं मिला / No matching locations found.
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5 Cascading Dropdowns: State → District → Block → Panchayat → Village */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.75rem',
        alignItems: 'end'
      }}>
        {/* 1. State */}
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-secondary-text)', marginBottom: '4px' }}>
            1. राज्य / State:
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="gm-input"
              style={{
                width: '100%',
                padding: '0.45rem 1.8rem 0.45rem 0.65rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                appearance: 'none',
                backgroundColor: '#FAFCFA',
                cursor: 'pointer'
              }}
            >
              {states.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }} />
          </div>
        </div>

        {/* 2. District */}
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-secondary-text)', marginBottom: '4px' }}>
            2. जिला / District:
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              disabled={loadingState.districts || districts.length === 0}
              className="gm-input"
              style={{
                width: '100%',
                padding: '0.45rem 1.8rem 0.45rem 0.65rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                appearance: 'none',
                backgroundColor: '#FAFCFA',
                cursor: 'pointer'
              }}
            >
              {loadingState.districts ? (
                <option value="">Loading districts...</option>
              ) : districts.length === 0 ? (
                <option value="">No districts available</option>
              ) : (
                districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))
              )}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }} />
          </div>
        </div>

        {/* 3. Block */}
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-secondary-text)', marginBottom: '4px' }}>
            3. ब्लॉक / तहसील / Block:
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={selectedBlock}
              onChange={(e) => handleBlockChange(e.target.value)}
              disabled={loadingState.blocks || blocks.length === 0}
              className="gm-input"
              style={{
                width: '100%',
                padding: '0.45rem 1.8rem 0.45rem 0.65rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                appearance: 'none',
                backgroundColor: '#FAFCFA',
                cursor: 'pointer'
              }}
            >
              {loadingState.blocks ? (
                <option value="">Loading blocks...</option>
              ) : blocks.length === 0 ? (
                <option value="">No blocks available</option>
              ) : (
                blocks.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))
              )}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }} />
          </div>
        </div>

        {/* 4. Gram Panchayat */}
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-secondary-text)', marginBottom: '4px' }}>
            4. ग्राम पंचायत / Panchayat:
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={selectedPanchayatName}
              onChange={(e) => handlePanchayatChange(e.target.value)}
              disabled={loadingState.panchayats || panchayats.length === 0}
              className="gm-input"
              style={{
                width: '100%',
                padding: '0.45rem 1.8rem 0.45rem 0.65rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                appearance: 'none',
                backgroundColor: '#FAFCFA',
                cursor: 'pointer'
              }}
            >
              {loadingState.panchayats ? (
                <option value="">Loading Panchayats...</option>
              ) : panchayats.length === 0 ? (
                <option value="">No Panchayats available</option>
              ) : (
                panchayats.map(p => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))
              )}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }} />
          </div>
        </div>

        {/* 5. Village */}
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary-green)', marginBottom: '4px' }}>
            5. गाँव / ग्राम / Village:
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={selectedVillageName}
              onChange={(e) => handleVillageChange(e.target.value)}
              disabled={loadingState.villages || villages.length === 0}
              className="gm-input"
              style={{
                width: '100%',
                padding: '0.45rem 1.8rem 0.45rem 0.65rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--color-dark-green)',
                appearance: 'none',
                backgroundColor: '#F0FDF4',
                borderColor: 'var(--color-primary-green)',
                cursor: 'pointer'
              }}
            >
              {loadingState.villages ? (
                <option value="">Loading villages...</option>
              ) : villages.length === 0 ? (
                <option value="">No villages available</option>
              ) : (
                villages.map(v => (
                  <option key={v.id || v.name} value={v.name}>
                    📍 {v.name} {v.hindi_name && v.hindi_name !== v.name ? `(${v.hindi_name})` : ''}
                  </option>
                ))
              )}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-primary-green)' }} />
          </div>
        </div>
      </div>

      {/* Dynamic Village Metadata & Micro-Terrain Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.6rem',
        padding: '0.55rem 0.85rem',
        backgroundColor: '#F8FAFC',
        borderRadius: '6px',
        border: '1px dashed #CBD5E1',
        fontSize: '0.76rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', color: '#334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={14} color="#EA580C" />
            <span>
              <strong>Lat:</strong> {latDisplay}
            </span>
            <span>•</span>
            <span>
              <strong>Lon:</strong> {lonDisplay}
            </span>
          </div>

          <span>•</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Mountain size={14} color="#64748B" />
            <span>
              <strong>Elevation:</strong> {elevationDisplay}
            </span>
          </div>

          {villageCodeDisplay !== "Data unavailable" && (
            <>
              <span>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Hash size={13} color="#2563EB" />
                <span>
                  <strong>Village Code:</strong> {villageCodeDisplay}
                </span>
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span 
            className={soilDisplay === "Data unavailable" ? "gm-badge gm-badge-gray" : "gm-badge gm-badge-green"} 
            style={{ fontSize: '0.68rem', padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Sprout size={11} />
            <span>Soil: {soilDisplay}</span>
          </span>

          <span 
            className={ndviDisplay === "Data unavailable" ? "gm-badge gm-badge-gray" : "gm-badge gm-badge-blue"} 
            style={{ fontSize: '0.68rem', padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Activity size={11} />
            <span>NDVI: {ndviDisplay}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
