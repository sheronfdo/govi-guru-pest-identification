import { useEffect, useState } from 'react';
import { LoginScreen } from './components/login-screen';
import { HomeDashboard } from './components/home-dashboard';
import { CameraScreen } from './components/camera-screen';
import { ResultScreen } from './components/result-screen';
import { ExpertScreen } from './components/expert-screen';
import { ConsultationListScreen } from './components/consultation-list-screen';
import { ConsultationDetailScreen } from './components/consultation-detail-screen';
import { HistoryScreen } from './components/history-screen';
import { ScanDetailScreen } from './components/scan-detail-screen';
import { ProfileScreen } from './components/profile-screen';
import { KnowledgeBaseListScreen } from './components/knowledge-base-list-screen';
import { KnowledgeArticleScreen } from './components/knowledge-article-screen';
import { FeedbackScreen } from './components/feedback-screen';

type Screen =
  | 'login'
  | 'home'
  | 'camera'
  | 'result'
  | 'expert'
  | 'history'
  | 'scan-detail'
  | 'consultations'
  | 'consultation-detail'
  | 'profile'
  | 'knowledge-base'
  | 'knowledge-article'
  | 'feedback';

export default function App() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [farmerName, setFarmerName] = useState('');
  const [scanResult, setScanResult] = useState<null | {
    name: string;
    scientificName?: string | null;
    cropStage?: string | null;
    confidence: number;
    traditional: string[];
    chemical: string[];
    imageUrl?: string | null;
  }>(null);
  const [scanMeta, setScanMeta] = useState<{
    id: number | null;
    imageUrl: string | null;
  }>({ id: null, imageUrl: null });
  const [fromResult, setFromResult] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedScanId, setSelectedScanId] = useState<number | null>(null);
  const [selectedConsultationId, setSelectedConsultationId] = useState<number | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);

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
    setUploadProgress(0);
    try {
      const data = await new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${apiBase}/farmer/scan`, true);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        };
        xhr.onload = () => {
          const parsedBody = (() => {
            if (!xhr.responseText) return null;
            try {
              return JSON.parse(xhr.responseText);
            } catch {
              return null;
            }
          })();

          if (xhr.status === 401) {
            localStorage.removeItem('gg_token');
            window.location.href = '/';
            reject(new Error('Unauthorized'));
            return;
          }
          if (xhr.status >= 200 && xhr.status < 300) {
            if (parsedBody && typeof parsedBody === 'object') {
              resolve(parsedBody);
            } else {
              reject(new Error('Invalid scan response from server'));
            }
          } else {
            const detail =
              parsedBody &&
              typeof parsedBody === 'object' &&
              'detail' in parsedBody &&
              typeof parsedBody.detail === 'string'
                ? parsedBody.detail
                : null;

            if (xhr.status === 422 && detail) {
              reject(new Error(detail));
              return;
            }

            reject(new Error(detail || 'Failed to analyze image'));
          }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        const form = new FormData();
        form.append('image', file);
        xhr.send(form);
      });
      const pest = data.pest;
      setScanResult({
        name: pest.name,
        scientificName: pest.scientific_name,
        cropStage: pest.crop_stage,
        confidence: pest.confidence,
        traditional: pest.traditional_methods || [],
        chemical: pest.chemical_methods || [],
        imageUrl: pest.image_url,
      });
      setScanMeta({
        id: data.scan_id ?? null,
        imageUrl: data.scan_image_url ?? null,
      });
      setCurrentScreen('result');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Scan failed';
      if (/no pest detected/i.test(message)) {
        setScanError('No pest detected. Please upload a clearer pest image and try again.');
      } else {
        setScanError(message);
      }
    } finally {
      setScanning(false);
      setUploadProgress(0);
    }
  };

  const handleAskExpert = () => {
    setFromResult(true);
    setCurrentScreen('expert');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('gg_token');
    setFarmerName('');
    setCurrentScreen('login');
  };

  const handleSelectPestFromHistory = (scanId: number) => {
    setSelectedScanId(scanId);
    setCurrentScreen('scan-detail');
  };

  const handleSelectConsultation = (consultationId: number) => {
    setSelectedConsultationId(consultationId);
    setCurrentScreen('consultation-detail');
  };

  const handleSelectArticle = (articleId: number) => {
    setSelectedArticleId(articleId);
    setCurrentScreen('knowledge-article');
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
        <CameraScreen
          onBack={handleBackToHome}
          onCapture={handleCapture}
          loading={scanning}
          error={scanError}
          progress={uploadProgress}
        />
      )}

      {currentScreen === 'result' && (
        <ResultScreen
          result={scanResult}
          onBack={handleBackToHome}
          onAskExpert={handleAskExpert}
        />
      )}

      {currentScreen === 'expert' && (
        <ExpertScreen
          onBack={handleBackToHome}
          scanId={fromResult ? scanMeta.id : null}
          scanImageUrl={fromResult ? scanMeta.imageUrl : null}
          scanContext={
            fromResult && scanResult
              ? {
                  name: scanResult.name,
                  confidence: scanResult.confidence,
                  cropStage: scanResult.cropStage || null,
                  scientificName: scanResult.scientificName || null,
                }
              : null
          }
          onSubmitted={() => setCurrentScreen('consultations')}
          onViewConsultations={() => setCurrentScreen('consultations')}
        />
      )}

      {currentScreen === 'history' && (
        <HistoryScreen
          onBack={handleBackToHome}
          onSelectPest={handleSelectPestFromHistory}
        />
      )}

      {currentScreen === 'scan-detail' && (
        <ScanDetailScreen scanId={selectedScanId} onBack={handleBackToHome} />
      )}

      {currentScreen === 'consultations' && (
        <ConsultationListScreen
          onBack={handleBackToHome}
          onSelect={handleSelectConsultation}
          onNew={() => setCurrentScreen('expert')}
        />
      )}

      {currentScreen === 'consultation-detail' && (
        <ConsultationDetailScreen
          consultationId={selectedConsultationId}
          onBack={() => setCurrentScreen('consultations')}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfileScreen onBack={handleBackToHome} onLogout={handleLogout} onFeedback={() => setCurrentScreen('feedback')} />
      )}

      {currentScreen === 'knowledge-base' && (
        <KnowledgeBaseListScreen onBack={handleBackToHome} onSelect={handleSelectArticle} />
      )}

      {currentScreen === 'knowledge-article' && (
        <KnowledgeArticleScreen articleId={selectedArticleId} onBack={() => setCurrentScreen('knowledge-base')} />
      )}

      {currentScreen === 'feedback' && (
        <FeedbackScreen onBack={() => setCurrentScreen('profile')} />
      )}
    </div>
  );
}
