import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('gm_lang') || 'hi'; // Default Hindi as requested for Indian farmers
  });

  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);

  useEffect(() => {
    localStorage.setItem('gm_lang', language);
  }, [language]);

  // Translation helper
  const t = (path) => {
    const keys = path.split('.');
    let current = translations[language] || translations['en'];
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English
        let fb = translations['en'];
        for (const k of keys) {
          fb = fb ? fb[k] : undefined;
        }
        return fb || path;
      }
    }
    return current;
  };

  // Text-To-Speech (TTS) voice player
  const playVoiceAdvisory = (text, customLang = null) => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser. Please use Chrome/Edge/Firefox.");
      return;
    }

    window.speechSynthesis.cancel(); // Cancel any existing playback

    const targetLang = customLang || language;
    const utterance = new SpeechSynthesisUtterance(text);

    // Map language code to BCP 47 tag
    const langTags = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      kn: 'kn-IN',
      bn: 'bn-IN'
    };
    utterance.lang = langTags[targetLang] || 'hi-IN';
    utterance.rate = 0.92; // Slightly slower, very clear for farmers
    utterance.pitch = 1.0;

    // Try finding Indian accent voice if available
    const voices = window.speechSynthesis.getVoices();
    const foundVoice = voices.find(v => v.lang.startsWith(targetLang) || v.lang.includes(langTags[targetLang]));
    if (foundVoice) {
      utterance.voice = foundVoice;
    }

    utterance.onstart = () => setIsPlayingVoice(true);
    utterance.onend = () => setIsPlayingVoice(false);
    utterance.onerror = () => setIsPlayingVoice(false);

    setCurrentUtterance(utterance);
    window.speechSynthesis.speak(utterance);
  };

  const stopVoiceAdvisory = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingVoice(false);
      setCurrentUtterance(null);
    }
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      playVoiceAdvisory,
      stopVoiceAdvisory,
      isPlayingVoice
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
