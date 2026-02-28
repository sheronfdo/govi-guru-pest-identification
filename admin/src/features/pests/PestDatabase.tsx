import { useEffect, useState } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import { Card } from '../../shared/ui/card';
import { Button } from '../../shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../shared/ui/dialog';
import { toast } from 'sonner';
import { Input } from '../../shared/ui/input';
import { Label } from '../../shared/ui/label';
import { Textarea } from '../../shared/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../shared/ui/select';

export function PestDatabase() {
  const allowedImageTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
  const maxImageSize = 5 * 1024 * 1024;
  const allowedCropStages = new Set(['seedling', 'vegetative', 'reproductive', 'ripening']);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editPest, setEditPest] = useState<any | null>(null);
  const [viewPest, setViewPest] = useState<any | null>(null);
  const [deletePestId, setDeletePestId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const [pests, setPests] = useState<Array<{
    id: number;
    name: string;
    sinhalaName?: string | null;
    tamilName?: string | null;
    image?: string | null;
    cropStage?: string | null;
    chemical?: string | null;
    kem?: string | null;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nameEnglish: '',
    nameSinhala: '',
    nameTamil: '',
    cropStage: '',
    chemical: '',
    kem: '',
    imageFile: null as File | null,
  });
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const token = localStorage.getItem('gg_token');

  const loadPests = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams();
      if (search) query.set('q', search);
      query.set('page', String(page));
      query.set('limit', String(pageSize));
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/pests?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load pests');
      const data = await res.json();
      setTotal(data.total || 0);
      const mapped = (data.items || []).map((p: any) => ({
        id: p.id,
        name: p.name_en,
        sinhalaName: p.name_si,
        tamilName: p.name_ta,
        image: p.image_path || null,
        cropStage: p.crop_stage,
        chemical: p.chemical_methods,
        kem: p.kem_methods,
      }));
      setPests(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPests();
  }, [search, page, pageSize]);

  const handleCreatePest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const nameEnglish = formData.nameEnglish.trim();
    const nameSinhala = formData.nameSinhala.trim();
    const nameTamil = formData.nameTamil.trim();
    const cropStage = formData.cropStage.trim();
    const chemical = formData.chemical.trim();
    const kem = formData.kem.trim();
    if (!nameEnglish) {
      setError('English pest name is required');
      toast.error('English pest name is required');
      return;
    }
    if (cropStage && !allowedCropStages.has(cropStage)) {
      setError('Invalid crop stage selected');
      toast.error('Invalid crop stage selected');
      return;
    }
    if (formData.imageFile) {
      if (!allowedImageTypes.has(formData.imageFile.type)) {
        setError('Image must be JPG, PNG, or WEBP');
        toast.error('Image must be JPG, PNG, or WEBP');
        return;
      }
      if (formData.imageFile.size > maxImageSize) {
        setError('Image must be 5MB or smaller');
        toast.error('Image must be 5MB or smaller');
        return;
      }
    }
    setError('');
    try {
      const form = new FormData();
      form.append('name_en', nameEnglish);
      if (nameSinhala) form.append('name_si', nameSinhala);
      if (nameTamil) form.append('name_ta', nameTamil);
      if (cropStage) form.append('crop_stage', cropStage);
      if (chemical) form.append('chemical_methods', chemical);
      if (kem) form.append('kem_methods', kem);
      if (formData.imageFile) form.append('image', formData.imageFile);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/pests`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!res.ok) throw new Error('Failed to create pest');
      await res.json();
      setIsDialogOpen(false);
      setFormData({
        nameEnglish: '',
        nameSinhala: '',
        nameTamil: '',
        cropStage: '',
        chemical: '',
        kem: '',
        imageFile: null,
      });
      loadPests();
      toast.success('Pest created successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create pest');
      toast.error('Failed to create pest');
    }
  };

  const handleOpenEdit = (pest: any) => {
    setEditPest({
      id: pest.id,
      name_en: pest.name,
      name_si: pest.sinhalaName,
      name_ta: pest.tamilName,
      crop_stage: pest.cropStage || '',
      chemical_methods: pest.chemical || '',
      kem_methods: pest.kem || '',
      image: pest.image,
    });
    setEditImageFile(null);
  };

  const handleUpdatePest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editPest) return;
    const nameEn = (editPest.name_en || '').trim();
    if (!nameEn) {
      setError('English pest name is required');
      toast.error('English pest name is required');
      return;
    }
    if (editPest.crop_stage && !allowedCropStages.has(editPest.crop_stage)) {
      setError('Invalid crop stage selected');
      toast.error('Invalid crop stage selected');
      return;
    }
    if (editImageFile) {
      if (!allowedImageTypes.has(editImageFile.type)) {
        setError('Image must be JPG, PNG, or WEBP');
        toast.error('Image must be JPG, PNG, or WEBP');
        return;
      }
      if (editImageFile.size > maxImageSize) {
        setError('Image must be 5MB or smaller');
        toast.error('Image must be 5MB or smaller');
        return;
      }
    }
    const payload = {
      ...editPest,
      name_en: nameEn,
      name_si: (editPest.name_si || '').trim() || null,
      name_ta: (editPest.name_ta || '').trim() || null,
      crop_stage: (editPest.crop_stage || '').trim() || null,
      chemical_methods: (editPest.chemical_methods || '').trim() || null,
      kem_methods: (editPest.kem_methods || '').trim() || null,
      image: undefined,
    };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/pests/${editPest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update pest');
      if (editImageFile) {
        const imgForm = new FormData();
        imgForm.append('image', editImageFile);
        const imgRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/pests/${editPest.id}/image`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: imgForm,
        });
        if (!imgRes.ok) throw new Error('Failed to update image');
      }
      setEditPest(null);
      setEditImageFile(null);
      loadPests();
      toast.success('Pest updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update pest');
      toast.error('Failed to update pest');
    }
  };

  const handleDeletePest = async () => {
    if (!token || deletePestId == null) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/pests/${deletePestId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete pest');
      setDeletePestId(null);
      loadPests();
      toast.success('Pest deleted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete pest');
      toast.error('Failed to delete pest');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2" style={{ color: '#263238' }}>Pest Database</h1>
          <p className="text-gray-600">Manage pest information and control methods</p>
        </div>
        <Input
          className="w-72"
          placeholder="Search pests..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" style={{ backgroundColor: '#2E7D32' }}>
              <Plus className="w-4 h-4" />
              Add New Pest
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Pest</DialogTitle>
              <DialogDescription>
                Enter pest information in multiple languages and upload training images for AI identification.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-6 mt-4" onSubmit={handleCreatePest}>
              {/* Pest Names */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameEnglish">Pest Name (English)</Label>
                  <Input
                    id="nameEnglish"
                    placeholder="e.g., Brown Planthopper"
                    value={formData.nameEnglish}
                    onChange={(e) => setFormData({ ...formData, nameEnglish: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameSinhala">Pest Name (Sinhala)</Label>
                  <Input
                    id="nameSinhala"
                    placeholder="e.g., දුඹුරු කොළ මැසි"
                    value={formData.nameSinhala}
                    onChange={(e) => setFormData({ ...formData, nameSinhala: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameTamil">Pest Name (Tamil)</Label>
                  <Input
                    id="nameTamil"
                    placeholder="e.g., பழுப்பு வெட்டுக்கிளி"
                    value={formData.nameTamil}
                    onChange={(e) => setFormData({ ...formData, nameTamil: e.target.value })}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Upload Training Images</Label>
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer block">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop multiple images
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        if (!allowedImageTypes.has(file.type)) {
                          toast.error('Image must be JPG, PNG, or WEBP');
                          return;
                        }
                        if (file.size > maxImageSize) {
                          toast.error('Image must be 5MB or smaller');
                          return;
                        }
                      }
                      setFormData({ ...formData, imageFile: file });
                    }}
                  />
                </label>
                {formData.imageFile && (
                  <div className="mt-3 flex items-center gap-4">
                    <img
                      src={URL.createObjectURL(formData.imageFile)}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded"
                    />
                    <span className="text-sm text-gray-600">{formData.imageFile.name}</span>
                  </div>
                )}
              </div>

              {/* Affected Crop Stage */}
              <div className="space-y-2">
                <Label htmlFor="cropStage">Affected Crop Stage</Label>
                <Select
                  value={formData.cropStage}
                  onValueChange={(value) => setFormData({ ...formData, cropStage: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seedling">Seedling</SelectItem>
                    <SelectItem value="vegetative">Vegetative</SelectItem>
                    <SelectItem value="reproductive">Reproductive</SelectItem>
                    <SelectItem value="ripening">Ripening</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Control Methods Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Control Methods</h3>

                {/* Chemical Recommendations */}
                <div className="space-y-2">
                  <Label htmlFor="chemical">Chemical Recommendations</Label>
                  <Textarea
                    id="chemical"
                    rows={4}
                    placeholder="Enter chemical pesticides and their application guidelines..."
                    className="resize-none"
                    value={formData.chemical}
                    onChange={(e) => setFormData({ ...formData, chemical: e.target.value })}
                  />
                </div>

                {/* Traditional Kem Methods - Highlighted */}
                <div
                  className="p-4 rounded-lg space-y-2"
                  style={{ backgroundColor: '#F3E5D5' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 rounded" style={{ backgroundColor: '#8B4513' }}></div>
                    <Label htmlFor="kem" className="text-lg" style={{ color: '#8B4513' }}>
                      Traditional 'Kem' Methods 🌿
                    </Label>
                  </div>
                  <p className="text-sm text-gray-700 italic mb-2">
                    Indigenous knowledge and organic practices passed down through generations
                  </p>
                  <Textarea
                    id="kem"
                    rows={5}
                    placeholder="Enter traditional organic methods, natural pesticides, and indigenous practices... (e.g., neem oil, wood ash, botanical extracts)"
                    className="resize-none"
                    style={{ backgroundColor: '#FFFBF5' }}
                    value={formData.kem}
                    onChange={(e) => setFormData({ ...formData, kem: e.target.value })}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" style={{ backgroundColor: '#2E7D32' }}>
                  Save Pest Information
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pest Cards Grid */}
      <div className="grid grid-cols-4 gap-6">
        {pests.map((pest) => (
          <Card key={pest.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="h-40 overflow-hidden">
              {pest.image ? (
                <img
                  src={pest.image}
                  alt={pest.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-1">{pest.name}</h3>
              <p className="text-sm text-gray-600">{pest.sinhalaName}</p>
              <p className="text-sm text-gray-600">{pest.tamilName}</p>
              <div className="mt-3 flex items-center gap-3 text-sm">
                <button className="text-blue-600 hover:underline" onClick={() => setViewPest(pest)}>
                  View
                </button>
                <button className="text-blue-600 hover:underline" onClick={() => handleOpenEdit(pest)}>
                  Edit
                </button>
                <button className="text-red-600 hover:underline" onClick={() => setDeletePestId(pest.id)}>
                  Delete
                </button>
              </div>
            </div>
          </Card>
        ))}

        {/* Add New Card */}
        <Card
          className="flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-gray-50 transition-colors border-2 border-dashed"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-gray-600 font-medium">Add New Pest</p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Page size:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPage(1);
                setPageSize(Number(v));
              }}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="24">24</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <button
            className="px-3 py-2 rounded border"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button
            className="px-3 py-2 rounded border"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </Card>

      <Dialog open={!!editPest} onOpenChange={(open) => !open && setEditPest(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Pest</DialogTitle>
            <DialogDescription>Update pest information</DialogDescription>
            <div className="flex justify-end">
              <button
                className="text-sm text-red-600 hover:underline"
                onClick={() => setDeletePestId(editPest.id)}
              >
                Delete Pest
              </button>
            </div>
          </DialogHeader>
          {editPest && (
            <form className="space-y-4 mt-4" onSubmit={handleUpdatePest}>
              <div className="space-y-2">
                <Label>Image</Label>
                <div className="flex items-center gap-4">
                  {editImageFile ? (
                    <img
                      src={URL.createObjectURL(editImageFile)}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded"
                    />
                  ) : editPest.image ? (
                    <img src={editPest.image} alt="Current" className="w-24 h-24 object-cover rounded" />
                  ) : (
                    <div className="w-24 h-24 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                  <label className="text-sm text-blue-600 hover:underline cursor-pointer">
                    Replace Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) {
                          if (!allowedImageTypes.has(file.type)) {
                            toast.error('Image must be JPG, PNG, or WEBP');
                            return;
                          }
                          if (file.size > maxImageSize) {
                            toast.error('Image must be 5MB or smaller');
                            return;
                          }
                        }
                        setEditImageFile(file);
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Pest Name (English)</Label>
                  <Input
                    value={editPest.name_en || ''}
                    onChange={(e) => setEditPest({ ...editPest, name_en: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pest Name (Sinhala)</Label>
                  <Input
                    value={editPest.name_si || ''}
                    onChange={(e) => setEditPest({ ...editPest, name_si: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pest Name (Tamil)</Label>
                  <Input
                    value={editPest.name_ta || ''}
                    onChange={(e) => setEditPest({ ...editPest, name_ta: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Affected Crop Stage</Label>
                <Select
                  value={editPest.crop_stage || ''}
                  onValueChange={(value) => setEditPest({ ...editPest, crop_stage: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seedling">Seedling</SelectItem>
                    <SelectItem value="vegetative">Vegetative</SelectItem>
                    <SelectItem value="reproductive">Reproductive</SelectItem>
                    <SelectItem value="ripening">Ripening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Chemical Recommendations</Label>
                <Textarea
                  rows={4}
                  value={editPest.chemical_methods || ''}
                  onChange={(e) => setEditPest({ ...editPest, chemical_methods: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Traditional 'Kem' Methods</Label>
                <Textarea
                  rows={4}
                  value={editPest.kem_methods || ''}
                  onChange={(e) => setEditPest({ ...editPest, kem_methods: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditPest(null)}>
                  Cancel
                </Button>
                <Button type="submit" style={{ backgroundColor: '#2E7D32' }}>
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewPest} onOpenChange={(open) => !open && setViewPest(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Pest Details</DialogTitle>
          </DialogHeader>
          {viewPest && (
            <div className="space-y-4">
              {viewPest.image && (
                <img src={viewPest.image} alt={viewPest.name} className="w-full h-56 object-cover rounded-md" />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">English</p>
                  <p className="font-medium">{viewPest.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sinhala</p>
                  <p className="font-medium">{viewPest.sinhalaName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tamil</p>
                  <p className="font-medium">{viewPest.tamilName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Crop Stage</p>
                  <p className="font-medium">{viewPest.cropStage || '-'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Chemical Methods</p>
                <p className="text-sm">{viewPest.chemical || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Traditional Kem Methods</p>
                <p className="text-sm">{viewPest.kem || '-'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deletePestId !== null} onOpenChange={(open) => !open && setDeletePestId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Pest</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeletePestId(null)}>
              Cancel
            </Button>
            <Button onClick={handleDeletePest} className="bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {loading && <div className="text-sm text-gray-600">Loading pests...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}
