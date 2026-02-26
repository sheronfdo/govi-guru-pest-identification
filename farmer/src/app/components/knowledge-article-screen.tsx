import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface KnowledgeArticleScreenProps {
  articleId: number | null;
  onBack: () => void;
}

interface KnowledgeArticleDetail {
  id: number;
  title: string;
  category: string;
  content: string;
  cover_image_url?: string | null;
  views: number;
  created_at: string;
  updated_at: string;
}

export function KnowledgeArticleScreen({ articleId, onBack }: KnowledgeArticleScreenProps) {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const [data, setData] = useState<KnowledgeArticleDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!articleId) return;
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    setLoading(true);
    setError('');
    fetch(`${apiBase}/farmer/knowledge-base/${articleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load article');
        return res.json();
      })
      .then((detail) => setData(detail))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load article'))
      .finally(() => setLoading(false));
  }, [articleId]);

  if (!articleId) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAFA' }}>
        <p className="text-gray-600">No article selected</p>
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
          <h2 className="flex-1 text-center text-xl font-bold text-white">Knowledge Article</h2>
          <div className="w-10" />
        </div>
      </div>

      <div className="flex-1 px-6 py-6">
        {loading && <p className="text-sm text-gray-600">Loading...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {data && (
          <div className="space-y-4">
            {data.cover_image_url ? (
              <img
                src={data.cover_image_url}
                alt={data.title}
                className="w-full h-64 object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-64 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
                <BookOpen className="w-12 h-12" style={{ color: '#4CAF50' }} />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#333' }}>{data.title}</h3>
              <p className="text-sm text-gray-500">{data.category}</p>
              <p className="text-xs text-gray-400 mt-1">Updated: {data.updated_at}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#333' }}>
                {data.content}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
