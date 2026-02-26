import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, Search } from 'lucide-react';

interface KnowledgeBaseListScreenProps {
  onBack: () => void;
  onSelect: (articleId: number) => void;
}

interface KnowledgeArticleSummary {
  id: number;
  title: string;
  category: string;
  cover_image_url?: string | null;
  views: number;
  updated_at: string;
}

export function KnowledgeBaseListScreen({ onBack, onSelect }: KnowledgeBaseListScreenProps) {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const [items, setItems] = useState<KnowledgeArticleSummary[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    setLoading(true);
    setError('');
    fetch(`${apiBase}/farmer/knowledge-base`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load articles');
        return res.json();
      })
      .then((data) => setItems(data.items || []))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load articles'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(items.map((item) => item.category).filter(Boolean));
    return ['all', ...Array.from(unique)];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, category]);

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
          <h2 className="flex-1 text-center text-xl font-bold text-white">Knowledge Base</h2>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 text-sm"
            style={{ borderColor: '#e0e0e0', backgroundColor: 'white' }}
          />
        </div>
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap"
              style={{
                backgroundColor: category === cat ? '#4CAF50' : 'white',
                color: category === cat ? 'white' : '#333',
                border: `1px solid ${category === cat ? '#4CAF50' : '#e0e0e0'}`,
              }}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-6 pb-6 space-y-3">
        {loading && <p className="text-sm text-gray-600">Loading...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="text-sm text-gray-600">No articles found.</p>
        )}
        {filtered.map((article) => (
          <button
            key={article.id}
            onClick={() => onSelect(article.id)}
            className="w-full bg-white rounded-xl p-4 shadow-md flex items-center gap-4 text-left"
          >
            <div className="w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F5F5F5' }}>
              {article.cover_image_url ? (
                <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover" />
              ) : (
                <BookOpen className="w-8 h-8" style={{ color: '#4CAF50' }} />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: '#333' }}>{article.title}</p>
              <p className="text-xs text-gray-500 mt-1">{article.category}</p>
              <p className="text-xs text-gray-400 mt-1">Updated: {article.updated_at}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
