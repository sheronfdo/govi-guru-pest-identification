import { useEffect, useState } from 'react';
import { ArrowLeft, MessageCircle, CheckCircle, Clock } from 'lucide-react';

interface ConsultationListScreenProps {
  onBack: () => void;
  onSelect: (consultationId: number) => void;
  onNew: () => void;
}

interface ConsultationItem {
  id: number;
  status: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  scanImageUrl: string | null;
}

export function ConsultationListScreen({ onBack, onSelect, onNew }: ConsultationListScreenProps) {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const [items, setItems] = useState<ConsultationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    setLoading(true);
    setError('');
    fetch(`${apiBase}/farmer/consultations`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load consultations');
        return res.json();
      })
      .then((data) => {
        const list = (data.items || []).map((item: any) => ({
          id: item.id,
          status: item.status,
          lastMessage: item.last_message || 'New consultation',
          lastMessageAt: item.last_message_at || '',
          scanImageUrl: item.scan_image_url || null,
        }));
        setItems(list);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load consultations'))
      .finally(() => setLoading(false));
  }, []);

  const getStatusMeta = (status: string) => {
    switch (status) {
      case 'replied':
        return { text: 'Replied', color: '#4CAF50', icon: CheckCircle };
      case 'closed':
        return { text: 'Closed', color: '#607D8B', icon: CheckCircle };
      default:
        return { text: 'Waiting', color: '#FF9800', icon: Clock };
    }
  };

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
          <h2 className="flex-1 text-center text-xl font-bold text-white">My Consultations</h2>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4">
          <MessageCircle className="w-10 h-10" style={{ color: '#4CAF50' }} />
          <div>
            <h3 className="text-lg font-bold" style={{ color: '#333' }}>Ask an Expert</h3>
            <p className="text-sm" style={{ color: '#666' }}>Review responses and continue the conversation</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: '#333' }}>Recent Conversations</h3>
          <button
            onClick={onNew}
            className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
          >
            New Request
          </button>
        </div>

        {loading && <p className="text-sm text-gray-600">Loading...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="text-sm text-gray-600">No consultations yet. Create your first request.</p>
        )}

        <div className="space-y-3">
          {items.map((item) => {
            const statusMeta = getStatusMeta(item.status);
            const StatusIcon = statusMeta.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className="w-full bg-white rounded-xl p-4 shadow-md flex items-center gap-4 transition-transform active:scale-98"
              >
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#F5F5F5' }}
                >
                  {item.scanImageUrl ? (
                    <img
                      src={item.scanImageUrl}
                      alt="Consultation"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <MessageCircle className="w-8 h-8" style={{ color: '#795548' }} />
                  )}
                </div>

                <div className="flex-1 text-left">
                  <h4 className="text-base font-bold mb-1" style={{ color: '#333' }}>
                    Consultation #{item.id}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-1">{item.lastMessage}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.lastMessageAt}</p>
                </div>

                <div className="flex items-center gap-2">
                  <StatusIcon className="w-5 h-5" style={{ color: statusMeta.color }} />
                  <span className="text-xs font-semibold" style={{ color: statusMeta.color }}>
                    {statusMeta.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
