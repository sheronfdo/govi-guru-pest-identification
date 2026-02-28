import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { BookOpen, Upload, Eye, Save, PlusCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface KnowledgeArticle {
  id: number;
  title: string;
  category: string;
  status: string;
  cover_image_url?: string | null;
  views: number;
  updated_at: string;
}

export default function KnowledgeBaseEditor() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    image: null as File | null
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const maxImageSize = 5 * 1024 * 1024;
  const allowedImageTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

  const loadArticles = async () => {
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/officer/knowledge-base`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load articles');
      const data = await res.json();
      setArticles(data.items || []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const resetForm = () => {
    setSelectedId(null);
    setFormData({ title: '', category: '', content: '', image: null });
    setPreviewMode(false);
  };

  const submitArticle = async (statusValue: 'published' | 'draft') => {
    const title = formData.title.trim();
    const category = formData.category.trim();
    const content = formData.content.trim();
    if (!title || !category || !content) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (title.length > 255) {
      toast.error('Title is too long');
      return;
    }
    if (content.length < 20) {
      toast.error('Content must be at least 20 characters');
      return;
    }
    if (content.length > 20000) {
      toast.error('Content is too long');
      return;
    }
    if (formData.image) {
      if (!allowedImageTypes.has(formData.image.type)) {
        toast.error('Image must be JPG, PNG, or WEBP');
        return;
      }
      if (formData.image.size > maxImageSize) {
        toast.error('Image must be 5MB or smaller');
        return;
      }
    }
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    const form = new FormData();
    form.append('title', title);
    form.append('category', category);
    form.append('content', content);
    form.append('status_value', statusValue);
    if (formData.image) form.append('image', formData.image);

    try {
      const url = selectedId
        ? `${apiBase}/officer/knowledge-base/${selectedId}`
        : `${apiBase}/officer/knowledge-base`;
      const method = selectedId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!res.ok) throw new Error('Failed to save article');
      toast.success(statusValue === 'published' ? 'Article published!' : 'Draft saved');
      await loadArticles();
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save article');
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    if (!confirm('Delete this article permanently?')) return;
    try {
      const res = await fetch(`${apiBase}/officer/knowledge-base/${selectedId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete article');
      toast.success('Article deleted');
      await loadArticles();
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete article');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitArticle('published');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!allowedImageTypes.has(file.type)) {
        toast.error('Image must be JPG, PNG, or WEBP');
        return;
      }
      if (file.size > maxImageSize) {
        toast.error('Image must be 5MB or smaller');
        return;
      }
      setFormData({ ...formData, image: file });
      toast.success('Image uploaded');
    }
  };

  const handleSelectArticle = async (article: KnowledgeArticle) => {
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    setSelectedId(article.id);
    setPreviewMode(false);
    try {
      const res = await fetch(`${apiBase}/officer/knowledge-base/${article.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load article');
      const full = await res.json();
      setFormData({
        title: full.title || '',
        category: full.category || '',
        content: full.content || '',
        image: null,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load article');
    }
  };

  const stats = useMemo(() => {
    const total = articles.length;
    const published = articles.filter((a) => a.status === 'published').length;
    const views = articles.reduce((sum, a) => sum + (a.views || 0), 0);
    return { total, published, views };
  }, [articles]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Knowledge Base Editor</h1>
        <p className="text-[#455A64]">Create and update educational materials for farmers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Create New Article</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  <Eye className="size-4 mr-2" />
                  {previewMode ? 'Edit' : 'Preview'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetForm}
                >
                  <PlusCircle className="size-4 mr-2" />
                  New
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!previewMode ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Article Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Complete Guide to Brown Planthopper Control"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pest-control">Pest Control</SelectItem>
                      <SelectItem value="best-practices">Best Practices</SelectItem>
                      <SelectItem value="crop-management">Crop Management</SelectItem>
                      <SelectItem value="fertilization">Fertilization</SelectItem>
                      <SelectItem value="water-management">Water Management</SelectItem>
                      <SelectItem value="disease-prevention">Disease Prevention</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content Body *</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your educational content here. Include:
- Problem identification
- Symptoms to look for
- Step-by-step treatment instructions
- Prevention tips
- Safety precautions"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={12}
                    className="resize-none"
                    required
                  />
                  <p className="text-xs text-[#455A64]">
                    {formData.content.length} characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Featured Image</Label>
                  <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" asChild>
                      <label htmlFor="image" className="cursor-pointer">
                        <Upload className="size-4 mr-2" />
                        Upload Image
                        <input
                          id="image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </Button>
                    {formData.image && (
                      <span className="text-sm text-[#455A64]">{formData.image.name}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-[#1976D2] hover:bg-[#1565C0]"
                  >
                    <BookOpen className="size-4 mr-2" />
                    {selectedId ? 'Update & Publish' : 'Publish to Farmer App'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => submitArticle('draft')}
                  >
                    <Save className="size-4 mr-2" />
                    {selectedId ? 'Update Draft' : 'Save Draft'}
                  </Button>
                  {selectedId && (
                    <Button
                      type="button"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={handleDelete}
                    >
                      <Trash2 className="size-4 mr-2" />
                      Delete
                    </Button>
                  )}
                </div>
              </form>
            ) : (
              // Preview Mode
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl mb-2">{formData.title || 'Article Title'}</h2>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-[#1976D2]">
                      {formData.category || 'Category'}
                    </Badge>
                    <span className="text-sm text-[#455A64]">
                      Published on {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {formData.image && (
                  <div className="rounded-lg overflow-hidden border">
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">
                    {formData.content || 'Article content will appear here...'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Published Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Published Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading && <p className="text-sm text-[#455A64]">Loading...</p>}
              {!loading && articles.map((article) => (
                <div
                  key={article.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleSelectArticle(article)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm line-clamp-2">{article.title}</h3>
                    <Badge
                      variant={article.status === 'published' ? 'secondary' : 'default'}
                      className={
                        article.status === 'published'
                          ? 'bg-[#4CAF50] ml-2'
                          : 'bg-orange-500 ml-2'
                      }
                    >
                      {article.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[#455A64]">{article.category}</p>
                    <p className="text-xs text-[#455A64]">
                      Updated: {article.updated_at}
                    </p>
                    {article.status === 'published' && (
                      <p className="text-xs text-[#1976D2]">
                        {article.views} views
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 pt-4 border-t space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#455A64]">Total Articles</span>
                <span className="text-lg">{stats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#455A64]">Published</span>
                <span className="text-lg text-[#4CAF50]">
                  {stats.published}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#455A64]">Total Views</span>
                <span className="text-lg text-[#1976D2]">
                  {stats.views}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
