import { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ResultScreenProps {
  result: {
    name: string;
    scientificName?: string | null;
    confidence: number;
    traditional: string[];
    chemical: string[];
    imageUrl?: string | null;
  } | null;
  onBack: () => void;
  onAskExpert: () => void;
}

export function ResultScreen({ result, onBack, onAskExpert }: ResultScreenProps) {
  const [activeTab, setActiveTab] = useState<'traditional' | 'chemical'>('traditional');

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAFA' }}>
        <p className="text-gray-600">No scan result available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <div className="px-4 py-4" style={{ backgroundColor: '#4CAF50' }}>
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-2 rounded-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="flex-1 text-center text-xl font-bold text-white">Identification Result</h2>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Pest Image */}
        <div className="px-6 py-6">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <ImageWithFallback
              src={result.imageUrl || "https://images.unsplash.com/photo-1651131381902-f34030f4a2d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"}
              alt={result.name}
              className="w-full h-64 object-cover"
            />
          </div>
        </div>

        {/* Match Status */}
        <div className="px-6 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4">
            <CheckCircle className="w-10 h-10 flex-shrink-0" style={{ color: '#4CAF50' }} />
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#333' }}>{result.name}</h3>
              <p className="text-sm italic" style={{ color: '#666' }}>{result.scientificName || ''}</p>
              <p className="text-base font-semibold mt-1" style={{ color: '#4CAF50' }}>Match Found!</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
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

        {/* Solutions List */}
        <div className="px-6">
          <div className="bg-white rounded-xl p-5 shadow-md">
            <h4 className="text-lg font-bold mb-4" style={{ color: '#333' }}>
              {activeTab === 'traditional' ? 'Eco-Friendly Solutions' : 'Chemical Pesticides'}
            </h4>
            <ul className="space-y-4">
              {(activeTab === 'traditional' ? result.traditional : result.chemical).map((solution, index) => (
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
              ))}
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

        {/* Ask Expert Button */}
        <div className="px-6 mt-6">
          <button
            onClick={onAskExpert}
            className="w-full py-5 rounded-xl text-lg font-bold flex items-center justify-center gap-3 transition-transform active:scale-95"
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
          >
            <MessageCircle className="w-6 h-6" />
            Is this incorrect? Ask an Expert
          </button>
        </div>
      </div>
    </div>
  );
}
