import { useEffect, useState } from 'react';
import { LoginScreen } from './components/login-screen';
import { HomeDashboard } from './components/home-dashboard';
import { CameraScreen } from './components/camera-screen';
import { ResultScreen } from './components/result-screen';
import { ExpertScreen } from './components/expert-screen';
import { HistoryScreen } from './components/history-screen';

type Screen = 'login' | 'home' | 'camera' | 'result' | 'expert' | 'history';

export default function App() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [farmerName, setFarmerName] = useState('');
  const [scanResult, setScanResult] = useState<null | {
    name: string;
    scientificName?: string | null;
    confidence: number;
    traditional: string[];
    chemical: string[];
    imageUrl?: string | null;
  }>(null);
  const [fromResult, setFromResult] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');

  const handleLogin = (name: string) => {
    setFarmerName(name);
    setCurrentScreen('home');
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
    setFromResult(false);
  };

  const handleCapture = async (file: File) => {
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    setScanning(true);
    setScanError('');
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await fetch(`${apiBase}/farmer/scan`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!res.ok) throw new Error('Failed to analyze image');
      const data = await res.json();
      const pest = data.pest;
      setScanResult({
        name: pest.name,
        scientificName: pest.scientific_name,
        confidence: pest.confidence,
        traditional: pest.traditional_methods || [],
        chemical: pest.chemical_methods || [],
        imageUrl: pest.image_url,
      });
      setCurrentScreen('result');
    } catch (err) {
      setScanError(err instanceof Error ? err.message : 'Scan failed');
    } finally {
      setScanning(false);
    }
  };

  const handleAskExpert = () => {
    setFromResult(true);
    setCurrentScreen('expert');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleSelectPestFromHistory = () => {
    setCurrentScreen('result');
  };

  useEffect(() => {
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    fetch(`${apiBase}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((me) => {
        setFarmerName(me.full_name || 'Farmer');
        setCurrentScreen('home');
      })
      .catch(() => {
        localStorage.removeItem('gg_token');
      });
  }, []);

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
        <CameraScreen onBack={handleBackToHome} onCapture={handleCapture} loading={scanning} error={scanError} />
      )}

      {currentScreen === 'result' && (
        <ResultScreen
          result={scanResult}
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
