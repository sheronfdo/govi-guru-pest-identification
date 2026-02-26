import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ScanDetailScreenProps {
  scanId: number | null;
  onBack: () => void;
}

export function ScanDetailScreen({ scanId, onBack }: ScanDetailScreenProps) {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const [data, setData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'traditional' | 'chemical'>('traditional');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!scanId) return;
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    setLoading(true);
    setError('');
    fetch(`${apiBase}/farmer/scans/${scanId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load scan');
        return res.json();
      })
      .then((result) => setData(result))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load scan'))
      .finally(() => setLoading(false));
  }, [scanId]);

  if (!scanId) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAFA' }}>
        <p className="text-gray-600">No scan selected</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="px-4 py-4" style={{ backgroundColor: '#4CAF50' }}>
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-2 rounded-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="flex-1 text-center text-xl font-bold text-white">Scan Details</h2>
          <div className="w-10" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {loading && <p className="text-center mt-6 text-gray-600">Loading...</p>}
        {error && <p className="text-center mt-6 text-red-600">{error}</p>}
        {data && (
          <>
            <div className="px-6 py-6">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <ImageWithFallback
                  src={data.image_url || data.pest.image_url || ''}
                  alt={data.pest.name}
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>

            <div className="px-6 mb-6">
              <div className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4">
                <CheckCircle className="w-10 h-10 flex-shrink-0" style={{ color: '#4CAF50' }} />
                <div>
                  <h3 className="text-xl font-bold" style={{ color: '#333' }}>{data.pest.name}</h3>
                  <p className="text-sm italic" style={{ color: '#666' }}>{data.pest.scientific_name || ''}</p>
                  <p className="text-xs text-gray-500 mt-1">Confidence: {Math.round(data.pest.confidence * 100)}%</p>
                  {data.pest.crop_stage && (
                    <p className="text-xs text-gray-500">Crop Stage: {data.pest.crop_stage}</p>
                  )}
                  <p className="text-xs text-gray-500">Scan Date: {data.date}</p>
                  <p className="text-xs text-gray-500">Status: {data.status}</p>
                </div>
              </div>
            </div>

            <div className="px-6 mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('traditional')}
                  className="flex-1 py-4 px-4 rounded-lg text-base font-bold transition-all"
                  style={{
                    backgroundColor: activeTab === 'traditional' ? '#795548' : 'white',
                    color: activeTab === 'traditional' ? 'white' : '#333',
                    border: `2px solid ${activeTab === 'traditional' ? '#795548' : '#e0e0e0'}`,
                  }}
                >
                  Traditional Methods
                </button>
                <button
                  onClick={() => setActiveTab('chemical')}
                  className="flex-1 py-4 px-4 rounded-lg text-base font-bold transition-all"
                  style={{
                    backgroundColor: activeTab === 'chemical' ? '#FF5722' : 'white',
                    color: activeTab === 'chemical' ? 'white' : '#333',
                    border: `2px solid ${activeTab === 'chemical' ? '#FF5722' : '#e0e0e0'}`,
                  }}
                >
                  Chemical Control
                </button>
              </div>
            </div>

            <div className="px-6">
              <div className="bg-white rounded-xl p-5 shadow-md">
                <h4 className="text-lg font-bold mb-4" style={{ color: '#333' }}>
                  {activeTab === 'traditional' ? 'Eco-Friendly Solutions' : 'Chemical Pesticides'}
                </h4>
                <ul className="space-y-4">
                  {(activeTab === 'traditional' ? data.pest.traditional_methods : data.pest.chemical_methods).map(
                    (solution: string, index: number) => (
                      <li key={index} className="flex gap-3">
                        <span
                          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: activeTab === 'traditional' ? '#795548' : '#FF5722' }}
                        >
                          {index + 1}
                        </span>
                        <p className="flex-1 text-base leading-relaxed pt-0.5" style={{ color: '#333' }}>
                          {solution}
                        </p>
                      </li>
                    )
                  )}
                </ul>

                {activeTab === 'chemical' && (
                  <div className="mt-6 p-4 rounded-lg flex gap-3" style={{ backgroundColor: '#FFF3E0' }}>
                    <AlertTriangle className="w-6 h-6 flex-shrink-0" style={{ color: '#FF5722' }} />
                    <p className="text-sm" style={{ color: '#666' }}>
                      <strong>Warning:</strong> Always wear protective equipment and follow dosage instructions carefully.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
