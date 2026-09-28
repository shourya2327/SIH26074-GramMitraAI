import React, { useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import { useWeather } from '../context/WeatherContext';
import { Sprout, Volume2, Square, AlertCircle, CheckCircle, ArrowRight, ShieldAlert } from 'lucide-react';

export const CropAdvisory = () => {
  const { selectedLocation } = useLocation();
  const { playVoiceAdvisory, stopVoiceAdvisory, isPlayingVoice } = useLanguage();
  const { weather } = useWeather();

  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [growthStage, setGrowthStage] = useState('Crown Root Initiation (21 DAS)');

  const currentRain = weather ? weather.rainfall : 12.0;
  const currentTemp = weather ? weather.temperature : 26.0;

  const cropDatabase = {
    Wheat: {
      stages: ["Crown Root Initiation (21 DAS)", "Tillering Stage", "Late Jointing", "Flowering / Anthesis", "Milking / Dough Stage"],
      optTemp: "15 - 25°C",
      advisoryHi: currentRain > 2 
        ? `आगामी 24 घंटे में ${currentRain} मिमी वर्षा की संभावना है। गेहूँ की फसल में क्राउन रूट अवस्था पर अतिरिक्त सिंचाई स्थगित रखें तथा खेत के जल निकास नालों को खुला रखें।`
        : `वर्तमान तापमान ${currentTemp}°C और शुष्क मौसम रहने का अनुमान है। गेहूँ में क्राउन रूट अवस्था पर आवश्यकतानुसार हल्की सिंचाई कर सकते हैं।`,
      advisoryEn: currentRain > 2
        ? `Rainfall of ${currentRain} mm expected within 24 hours. Postpone irrigation at Crown Root Initiation stage to avoid saturated root rotting.`
        : `Moderate agricultural temperature of ${currentTemp}°C. Proceed with scheduled light irrigation at Crown Root Initiation stage.`,
      sprayingStatus: currentRain > 2 ? "DO NOT SPRAY (Rain washout risk)" : "SAFE TO SPRAY (Morning/Evening)",
      fertilizerStatus: currentRain > 2 ? "Postpone urea top-dressing until topsoil drains" : "Normal fertilizer application allowed"
    },
    Soybean: {
      stages: ["Vegetative V3", "Flowering R1", "Pod Formation R3", "Seed Fill R5", "Maturity R7"],
      optTemp: "20 - 30°C",
      advisoryHi: "सोयाबीन में फली निर्माण के दौरान खेत में जलभराव न होने दें। 24 घंटे में बारिश के कारण फफूंदनाशक का छिड़काव 2 दिन बाद करें।",
      advisoryEn: "Prevent standing water ponding during pod formation. Delay fungicide spray until 48 hours after rains cease.",
      sprayingStatus: "POSTPONE 48 HOURS",
      fertilizerStatus: "Ensure adequate surface furrow drainage"
    },
    "Gram / Chickpea": {
      stages: ["Seedling Branching", "Pre-Flowering", "Pod Development", "Pod Maturation"],
      optTemp: "14 - 24°C",
      advisoryHi: "चने की फसल में अधिक नमी से उकठा (Wilt) रोग का खतरा बढ़ जाता है। बारिश के कारण किसी भी प्रकार की सिंचाई तुरंत रोकें।",
      advisoryEn: "Excess soil moisture predisposes chickpea to Fusarium wilt. Suspend all irrigation cycles immediately.",
      sprayingStatus: "SAFE TO SPRAY AFTER RAIN",
      fertilizerStatus: "Avoid excess nitrogen"
    },
    Maize: {
      stages: ["Knee High (V6)", "Tasseling (VT)", "Silking (R1)", "Grain Fill (R3)"],
      optTemp: "18 - 32°C",
      advisoryHi: "मक्का में सिल्किंग अवस्था में मध्यम नमी लाभदायक है। आगामी बारिश से फसल को भरपूर पोषण मिलेगा, अतिरिक्त जल निकास सुनिश्चित करें।",
      advisoryEn: "Moderate rainfall is beneficial at silking. Ensure field drainage ditches are functional to prevent collar rotting.",
      sprayingStatus: "PAUSE",
      fertilizerStatus: "Apply potash after rain recedes"
    },
    Cotton: {
      stages: ["Square Formation", "Flowering", "Boll Development", "Boll Opening"],
      optTemp: "22 - 35°C",
      advisoryHi: "कपास में लगातार नम मौसम से रसचूसक कीटों और बॉल रॉट का खतरा बढ़ जाता है। बारिश रुकते ही चिपचिपे पीले ट्रैप लगाएं।",
      advisoryEn: "Continuous cloudy/wet weather encourages sucking pests and boll rot. Install yellow sticky traps once skies clear.",
      sprayingStatus: "SCHEDULE PEST SCOUTING",
      fertilizerStatus: "Inspect for aphid/whitefly colonies"
    }
  };

  const currentCropInfo = cropDatabase[selectedCrop] || cropDatabase['Wheat'];

  const handleVoicePlay = () => {
    if (isPlayingVoice) {
      stopVoiceAdvisory();
    } else {
      playVoiceAdvisory(currentCropInfo.advisoryHi, 'hi');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
            🌱 Crop-Specific AI Agricultural Advisory
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)' }}>
            Scientific, stage-specific decision support tailored to {selectedLocation.village || selectedLocation.panchayat || "your farm's"} weather conditions.
          </p>
        </div>

        {/* Voice Play Button */}
        <button
          onClick={handleVoicePlay}
          className="gm-btn gm-btn-primary"
          style={{ padding: '0.55rem 1.1rem', backgroundColor: isPlayingVoice ? '#EF4444' : 'var(--color-primary-green)' }}
        >
          {isPlayingVoice ? <Square size={16} /> : <Volume2 size={16} />}
          <span>{isPlayingVoice ? 'Stop Voice' : 'Listen in Hindi (आवाज में सुनें)'}</span>
        </button>
      </div>

      {/* Crop & Stage Selector Strip */}
      <div className="gm-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-dark-green)' }}>Select Crop:</span>
          {Object.keys(cropDatabase).map(c => (
            <button
              key={c}
              onClick={() => { setSelectedCrop(c); setGrowthStage(cropDatabase[c].stages[0]); }}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)' }}>Growth Stage:</span>
          <select
            value={growthStage}
            onChange={(e) => setGrowthStage(e.target.value)}
            style={{ padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.8rem', fontFamily: 'inherit' }}
          >
            {currentCropInfo.stages.map((stg, i) => (
              <option key={i} value={stg}>{stg}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Advisory Box */}
      <div className="gm-card gm-card-primary" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="gm-badge gm-badge-green" style={{ fontSize: '0.75rem' }}>
              🌾 {selectedCrop} • {growthStage}
            </span>
            <span className="gm-badge gm-badge-blue" style={{ fontSize: '0.75rem' }}>
              Optimal Temp: {currentCropInfo.optTemp}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
            Weather Synced • 24h Outlook
          </span>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '10px', border: '1px solid #DDE8DD', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.5rem' }}>
            🇮🇳 मुख्य कृषि परामर्श (हिंदी)
          </h3>
          <p style={{ fontSize: '0.98rem', color: 'var(--color-dark-green)', lineHeight: 1.6, fontWeight: 500 }}>
            "{currentCropInfo.advisoryHi}"
          </p>

          <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid #E8F5E9' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284C7' }}>English Translation:</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', marginTop: '2px', fontStyle: 'italic' }}>
              "{currentCropInfo.advisoryEn}"
            </p>
          </div>
        </div>

        {/* Operational Directives */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '0.85rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #DDE8DD' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', display: 'block', fontWeight: 700 }}>
              FOLIAR SPRAYING DIRECTIVE
            </span>
            <strong style={{ fontSize: '0.85rem', color: '#DC2626', display: 'block', marginTop: '2px' }}>
              {currentCropInfo.sprayingStatus}
            </strong>
          </div>

          <div style={{ padding: '0.85rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #DDE8DD' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', display: 'block', fontWeight: 700 }}>
              FERTILIZER / TOP-DRESSING
            </span>
            <strong style={{ fontSize: '0.85rem', color: 'var(--color-dark-green)', display: 'block', marginTop: '2px' }}>
              {currentCropInfo.fertilizerStatus}
            </strong>
          </div>

          <div style={{ padding: '0.85rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #DDE8DD' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', display: 'block', fontWeight: 700 }}>
              SOIL DRAINAGE STATUS
            </span>
            <strong style={{ fontSize: '0.85rem', color: '#16A34A', display: 'block', marginTop: '2px' }}>
              Drain furrows must remain clear
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
