import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { WeatherProvider } from './context/WeatherContext';
import { LanguageProvider } from './context/LanguageContext';

// Layout
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { LocationPickerModal } from './components/Map/LocationPickerModal';
import { GramMitraAgentModal } from './components/Agent/GramMitraAgentModal';

// Auth Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Dashboard & Functional Pages
import { Dashboard } from './pages/Dashboard';
import { WeatherForecast } from './pages/WeatherForecast';
import { PanchayatMap } from './pages/PanchayatMap';
import { MyFields } from './pages/MyFields';
import { AIHyperlocal } from './pages/AIHyperlocal';
import { RainfallPrediction } from './pages/RainfallPrediction';
import { MicroClimate } from './pages/MicroClimate';
import { ForecastConfidence } from './pages/ForecastConfidence';
import { WhatIfSimulator } from './pages/WhatIfSimulator';
import { ExplainableAI } from './pages/ExplainableAI';
import { CropAdvisory } from './pages/CropAdvisory';
import { SmartIrrigation } from './pages/SmartIrrigation';
import { DiseaseRisk } from './pages/DiseaseRisk';
import { ExtremeWeatherAlerts } from './pages/ExtremeWeatherAlerts';
import { ForecastVsActual } from './pages/ForecastVsActual';
import { FeedbackLearning } from './pages/FeedbackLearning';
import { VoiceAdvisoryPage } from './pages/VoiceAdvisoryPage';
import { SettingsPage } from './pages/Settings';

const MainAppContent = () => {
  const { isAuthenticated } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    if (authView === 'register') {
      return <Register onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <Login onSwitchToRegister={() => setAuthView('register')} />;
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'ai-agent') {
      setIsAgentModalOpen(true);
    }
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            onNavigate={(tab) => handleTabChange(tab)} 
            onOpenLocationModal={() => setIsLocationModalOpen(true)} 
          />
        );
      case 'ai-agent':
        return (
          <Dashboard 
            onNavigate={(tab) => handleTabChange(tab)} 
            onOpenLocationModal={() => setIsLocationModalOpen(true)} 
          />
        );
      case 'my-location':
      case 'panchayat-map':
        return <PanchayatMap />;
      case 'my-fields':
        return <MyFields onNavigate={(tab) => handleTabChange(tab)} />;
      case 'forecast':
        return <WeatherForecast />;
      case 'rainfall':
        return <RainfallPrediction />;
      case 'microclimate':
        return <MicroClimate />;
      case 'hyperlocal':
        return <AIHyperlocal />;
      case 'confidence':
        return <ForecastConfidence />;
      case 'explainable':
        return <ExplainableAI />;
      case 'simulator':
        return <WhatIfSimulator />;
      case 'crop-advisory':
        return <CropAdvisory />;
      case 'smart-irrigation':
        return <SmartIrrigation />;
      case 'disease-risk':
        return <DiseaseRisk />;
      case 'extreme-weather':
      case 'notifications':
        return <ExtremeWeatherAlerts />;
      case 'forecast-vs-actual':
        return <ForecastVsActual />;
      case 'feedback':
        return <FeedbackLearning />;
      case 'voice-advisory':
        return <VoiceAdvisoryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <Dashboard 
            onNavigate={(tab) => handleTabChange(tab)} 
            onOpenLocationModal={() => setIsLocationModalOpen(true)} 
          />
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg)' }}>
      {/* Top Navigation Header */}
      <Header
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Main Layout Body */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Main Workspace Content */}
        <main style={{
          flex: 1,
          padding: '1.5rem',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          overflowX: 'hidden'
        }}>
          {renderActivePage()}
        </main>
      </div>

      {/* Floating GramMitra AI Agent Launcher Button */}
      <button
        onClick={() => setIsAgentModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 800,
          backgroundColor: 'var(--color-dark-green)',
          color: '#FFFFFF',
          border: '2px solid #4CAF50',
          borderRadius: 'var(--radius-full)',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.28)',
          cursor: 'pointer',
          fontSize: '0.88rem',
          fontWeight: 800,
          transition: 'all 0.2s ease'
        }}
        title="Open GramMitra AI Farmer Advisory Agent"
      >
        <span style={{ fontSize: '1.2rem' }}>🤖</span>
        <span>AI Agent (कृषि मित्र)</span>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ADE80', display: 'inline-block' }} />
      </button>

      {/* Interactive GramMitra AI Agent Modal */}
      <GramMitraAgentModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
      />

      {/* Location Picker Modal with Google Maps */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <WeatherProvider>
          <LanguageProvider>
            <MainAppContent />
          </LanguageProvider>
        </WeatherProvider>
      </LocationProvider>
    </AuthProvider>
  );
}
