import { useState } from 'react';
import { LoginScreen } from './components/login-screen';
import { HomeDashboard } from './components/home-dashboard';
import { CameraScreen } from './components/camera-screen';
import { ResultScreen } from './components/result-screen';
import { ExpertScreen } from './components/expert-screen';
import { HistoryScreen } from './components/history-screen';

type Screen = 'login' | 'home' | 'camera' | 'result' | 'expert' | 'history';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [farmerName, setFarmerName] = useState('');
  const [capturedPest, setCapturedPest] = useState<string>('');
  const [fromResult, setFromResult] = useState(false);

  const handleLogin = (name: string) => {
    setFarmerName(name);
    setCurrentScreen('home');
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
    setFromResult(false);
  };

  const handleCapture = (pestType: string) => {
    setCapturedPest(pestType);
    setCurrentScreen('result');
  };

  const handleAskExpert = () => {
    setFromResult(true);
    setCurrentScreen('expert');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleSelectPestFromHistory = (pestType: string) => {
    setCapturedPest(pestType);
    setCurrentScreen('result');
  };

  return (
    <div className="size-full">
      {currentScreen === 'login' && <LoginScreen onLogin={handleLogin} />}
      
      {currentScreen === 'home' && (
        <HomeDashboard
          farmerName={farmerName}
          onNavigate={handleNavigate}
          activeTab="home"
        />
      )}
      
      {currentScreen === 'camera' && (
        <CameraScreen onBack={handleBackToHome} onCapture={handleCapture} />
      )}
      
      {currentScreen === 'result' && (
        <ResultScreen
          pestType={capturedPest}
          onBack={handleBackToHome}
          onAskExpert={handleAskExpert}
        />
      )}
      
      {currentScreen === 'expert' && (
        <ExpertScreen onBack={handleBackToHome} hasAttachment={fromResult} />
      )}
      
      {currentScreen === 'history' && (
        <HistoryScreen
          onBack={handleBackToHome}
          onSelectPest={handleSelectPestFromHistory}
        />
      )}
    </div>
  );
}
