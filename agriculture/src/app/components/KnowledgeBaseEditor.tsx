import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { BookOpen, Upload, Eye, Save } from 'lucide-react';
import { toast } from 'sonner';

const mockArticles = [
  {
    id: 1,
    title: 'Brown Planthopper Control Guide',
    category: 'Pest Control',
    status: 'published',
    lastUpdated: '2024-02-05',
    views: 342
  },
  {
    id: 2,
    title: 'Organic Fertilizer Best Practices',
    category: 'Best Practices',
    status: 'published',
    lastUpdated: '2024-02-03',
    views: 567
  },
  {
    id: 3,
    title: 'Rice Blast Disease Management',
    category: 'Pest Control',
    status: 'draft',
    lastUpdated: '2024-02-07',
    views: 0
  },
  {
    id: 4,
    title: 'Water Management for Paddy Fields',
    category: 'Best Practices',
    status: 'published',
    lastUpdated: '2024-01-28',
    views: 423
  },
];

export default function KnowledgeBaseEditor() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    image: null as File | null
  });

  const [previewMode, setPreviewMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.category && formData.content) {
      toast.success('Educational material published successfully!');
      setFormData({ title: '', category: '', content: '', image: null });
      setPreviewMode(false);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      toast.success('Image uploaded successfully');
    }
  };

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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="size-4 mr-2" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
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
                    Publish to Farmer App
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => toast.success('Draft saved')}
                  >
                    <Save className="size-4 mr-2" />
                    Save Draft
                  </Button>
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
              {mockArticles.map((article) => (
                <div
                  key={article.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
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
                      Updated: {article.lastUpdated}
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
                <span className="text-lg">{mockArticles.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#455A64]">Published</span>
                <span className="text-lg text-[#4CAF50]">
                  {mockArticles.filter(a => a.status === 'published').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#455A64]">Total Views</span>
                <span className="text-lg text-[#1976D2]">
                  {mockArticles.reduce((sum, a) => sum + a.views, 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
