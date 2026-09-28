import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from '../context/LocationContext';
import { Volume2, Square, Globe, Sparkles, Check, Mic, Radio } from 'lucide-react';

export const VoiceAdvisoryPage = () => {
  const { language, setLanguage, playVoiceAdvisory, stopVoiceAdvisory, isPlayingVoice } = useLanguage();
  const { selectedLocation } = useLocation();

  const locName = selectedLocation?.village || selectedLocation?.panchayat || "आपके क्षेत्र";
  const locNameEn = selectedLocation?.village || selectedLocation?.panchayat || "your local area";

  const voiceScripts = {
    hi: {
      lang: "हिंदी (Hindi)",
      script: `नमस्ते किसान भाई। आज आपके क्षेत्र ${locName} में 14.5 मिमी वर्षा की संभावना है। गेहूँ और अन्य फसलों में आज किसी भी प्रकार की सिंचाई न करें। खेत के जल निकास नालों को साफ रखें ताकि वर्षा का पानी खेत में न भरे। अधिक जानकारी के लिए ग्राममित्र से जुड़े रहें।`
    },
    en: {
      lang: "English",
      script: `Greetings Farmer. Today, 14.5 mm rainfall is expected in ${locNameEn} area. Please avoid irrigation today to conserve power and protect crop roots from waterlogging. Ensure drainage channels are clear.`
    },
    mr: {
      lang: "मराठी (Marathi)",
      script: `नमस्कार शेतकरी बंधूंनो. आज आपल्या ${locName} परिसरात 14.5 मिमी पावसाची शक्यता आहे. आज पिकांना पाणी देण्याची गरज नाही. शेतात पाण्याचा निचरा व्यवस्थित ठेवा.`
    },
    gu: {
      lang: "ગુજરાતી (Gujarati)",
      script: `નમસ્તે ખેડૂત મિત્રો. આજે તમારા વિસ્તાર ${locName} માં 14.5 મીમી વરસાદની આગાહી છે. આજે પાકમાં પિયત આપવાની જરૂર નથી. ખેતરમાં પાણીના નિકાલની વ્યવસ્થા રાખો.`
    },
    ta: {
      lang: "தமிழ் (Tamil)",
      script: `வணக்கம் விவசாய தோழரே. இன்று உங்கள் ${locNameEn} பகுதியில் 14.5 மிமீ மழை பெய்ய வாய்ப்புள்ளது. இன்று பாசனம் செய்ய வேண்டாம். வயல் வடிகால் வாய்க்கால்களை சுத்தமாக வைத்திருங்கள்.`
    },
    te: {
      lang: "తెలుగు (Telugu)",
      script: `నమస్కారం రైతు సోదరులారా. ఈరోజు మీ ${locNameEn} పంచాయతీ పరిధిలో 14.5 మి.మీ వర్షం పడే అవకాశం ఉంది. ఈరోజు పంటలకు నీరు పెట్టవద్దు.`
    },
    kn: {
      lang: "ಕನ್ನಡ (Kannada)",
      script: `ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ. ಇಂದು ನಿಮ್ಮ ${locNameEn} ಪ್ರದೇಶದಲ್ಲಿ 14.5 ಮಿಮೀ ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ. ಇಂದು ಬೆಳೆಗಳಿಗೆ ನೀರಾವರಿ ಅಗತ್ಯವಿಲ್ಲ.`
    },
    bn: {
      lang: "বাংলা (Bengali)",
      script: `নমস্কার কৃষক বন্ধুরা। আজ আপনার ${locNameEn} এলাকায় 14.5 মিমি বৃষ্টিপাতের সম্ভাবনা রয়েছে। আজ খেতে সেচ দেওয়ার প্রয়োজন নেই। নিকাশী নালা পরিষ্কার রাখুন।`
    }
  };

  const activeVoiceItem = voiceScripts[language] || voiceScripts['hi'];

  const handlePlay = (langCode) => {
    if (isPlayingVoice) {
      stopVoiceAdvisory();
    } else {
      const scriptToPlay = voiceScripts[langCode]?.script || activeVoiceItem.script;
      playVoiceAdvisory(scriptToPlay, langCode);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2.5rem' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
            🎙 Voice & Local Language Advisory Hub
          </h1>
          <span className="gm-badge gm-badge-green">Web Speech TTS Engine</span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)' }}>
          High accessibility for all Indian farmers. Listen to localized weather and farming recommendations spoken aloud.
        </p>
      </div>

      {/* Main Voice Player Banner */}
      <div className="gm-card gm-card-primary" style={{
        padding: '2rem 1.75rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '1.25rem'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: isPlayingVoice ? '#EF4444' : 'var(--color-primary-green)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: '0 8px 20px rgba(76, 175, 80, 0.35)',
          cursor: 'pointer',
          transition: 'all 0.25s ease'
        }}
        onClick={() => handlePlay(language)}
        >
          {isPlayingVoice ? <Square size={30} /> : <Volume2 size={34} />}
        </div>

        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
            {isPlayingVoice ? 'Speaking Advisory Now...' : 'Click to Play Spoken Advisory'}
          </h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)', marginTop: '2px', display: 'block' }}>
            Language: <strong>{activeVoiceItem.lang}</strong> • Location: <strong>{selectedLocation.village || selectedLocation.panchayat || "Your Farm"}</strong>
          </span>
        </div>

        {/* Animated Waveform */}
        {isPlayingVoice && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '36px' }}>
            <span className="wave-bar" style={{ animationDelay: '0.1s' }} />
            <span className="wave-bar" style={{ animationDelay: '0.3s' }} />
            <span className="wave-bar" style={{ animationDelay: '0.5s' }} />
            <span className="wave-bar" style={{ animationDelay: '0.2s' }} />
            <span className="wave-bar" style={{ animationDelay: '0.4s' }} />
            <span className="wave-bar" style={{ animationDelay: '0.6s' }} />
            <span className="wave-bar" style={{ animationDelay: '0.15s' }} />
          </div>
        )}

        {/* Audio Script Display */}
        <div style={{
          maxWidth: '640px',
          width: '100%',
          backgroundColor: '#FFFFFF',
          padding: '1.25rem',
          borderRadius: '10px',
          border: '1px solid #DDE8DD',
          boxShadow: 'var(--shadow-sm)',
          fontSize: '0.98rem',
          lineHeight: 1.6,
          color: 'var(--color-dark-green)',
          fontWeight: 500
        }}>
          "{activeVoiceItem.script}"
        </div>
      </div>

      {/* Language Selection Grid */}
      <div className="gm-card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.85rem' }}>
          Select Indian Language & Test Voice
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.75rem'
        }}>
          {Object.entries(voiceScripts).map(([code, item]) => {
            const isSelected = language === code;
            return (
              <div
                key={code}
                onClick={() => {
                  setLanguage(code);
                  if (isPlayingVoice) stopVoiceAdvisory();
                }}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  border: '1.5px solid',
                  borderColor: isSelected ? 'var(--color-primary-green)' : 'var(--color-border)',
                  backgroundColor: isSelected ? 'var(--color-light-green)' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.9rem', color: isSelected ? 'var(--color-dark-green)' : 'var(--color-primary-text)' }}>
                    {item.lang}
                  </strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', display: 'block', marginTop: '2px' }}>
                    Code: {code}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLanguage(code);
                    handlePlay(code);
                  }}
                  className="gm-btn gm-btn-outline"
                  style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                >
                  <Volume2 size={13} /> Play
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
