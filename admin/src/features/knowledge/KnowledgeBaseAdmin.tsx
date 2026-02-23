import { useEffect, useMemo, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';

interface KnowledgeArticleSummary {
  id: number;
  title: string;
  category: string;
  status: string;
  cover_image_url?: string | null;
  views: number;
  updated_at: string;
}

export function KnowledgeBaseAdmin() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const [items, setItems] = useState<KnowledgeArticleSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadArticles = async () => {
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set('q', q.trim());
      if (statusFilter !== 'all') params.set('status_filter', statusFilter);
      const res = await fetch(`${apiBase}/admin/knowledge-base?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load articles');
      const data = await res.json();
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => loadArticles(), 300);
    return () => clearTimeout(handle);
  }, [q, statusFilter]);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    if (!confirm('Delete this article permanently?')) return;
    const res = await fetch(`${apiBase}/admin/knowledge-base/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const stats = useMemo(() => {
    const total = items.length;
    const published = items.filter((i) => i.status === 'published').length;
    const drafts = items.filter((i) => i.status === 'draft').length;
    return { total, published, drafts };
  }, [items]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Knowledge Base</h1>
        <p className="text-sm text-gray-600">Manage published and draft articles for farmers</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Total Articles</p>
          <p className="text-2xl font-semibold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Published</p>
          <p className="text-2xl font-semibold text-green-600">{stats.published}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Drafts</p>
          <p className="text-2xl font-semibold text-orange-600">{stats.drafts}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4 mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title or category..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Title</th>
              <th className="text-left px-4 py-3 font-medium">Category</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Views</th>
              <th className="text-left px-4 py-3 font-medium">Updated</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Loading articles...
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No articles found.
                </td>
              </tr>
            )}
            {!loading &&
              items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 text-gray-800">{item.title}</td>
                  <td className="px-4 py-3 text-gray-600">{item.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.views}</td>
                  <td className="px-4 py-3 text-gray-600">{item.updated_at}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 text-xs font-semibold"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
