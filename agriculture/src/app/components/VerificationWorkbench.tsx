import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ZoomIn, ZoomOut, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface ConsultationSummary {
  id: number;
  status: string;
  farmer_name?: string | null;
  farmer_region?: string | null;
  last_message?: string | null;
  scan_image_url?: string | null;
  scan_pest_name?: string | null;
  scan_confidence?: number | null;
  scan_crop_stage?: string | null;
}

interface ConsultationMessage {
  id: number;
  sender_role: string;
  body: string;
  created_at: string;
}

interface ConsultationDetail {
  id: number;
  status: string;
  farmer?: { name?: string | null; region?: string | null };
  scan_image_url?: string | null;
  scan_pest_name?: string | null;
  scan_confidence?: number | null;
  scan_crop_stage?: string | null;
  created_at: string;
  messages: ConsultationMessage[];
}

export default function VerificationWorkbench() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [expertNote, setExpertNote] = useState('');
  const [items, setItems] = useState<ConsultationSummary[]>([]);
  const [detail, setDetail] = useState<ConsultationDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const currentItem = items[currentIndex];
  const hasNext = currentIndex < items.length - 1;
  const hasPrev = currentIndex > 0;

  const loadList = async () => {
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/officer/consultations?status_filter=pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load verifications');
      const data = await res.json();
      setItems(data.items || []);
      setCurrentIndex(0);
      setDetail(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load verifications');
    } finally {
      setLoading(false);
    }
  };

  const loadDetail = async (consultationId: number) => {
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    setLoadingDetail(true);
    try {
      const res = await fetch(`${apiBase}/officer/consultations/${consultationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load consultation detail');
      const data = await res.json();
      setDetail(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load consultation detail');
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  useEffect(() => {
    if (!currentItem) return;
    setExpertNote('');
    setZoom(100);
    loadDetail(currentItem.id);
  }, [currentItem?.id]);

  const handleVerify = async (status: 'verified' | 'corrected') => {
    if (!currentItem) return;
    const note = expertNote.trim();
    if (status === 'corrected' && !note) {
      toast.error('Please provide correction details');
      return;
    }
    if (note.length > 5000) {
      toast.error('Expert note is too long');
      return;
    }
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    try {
      const form = new FormData();
      form.append('status', status);
      if (note) form.append('note', note);
      const res = await fetch(`${apiBase}/officer/consultations/${currentItem.id}/verify`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!res.ok) throw new Error('Failed to submit verification');
      toast.success(status === 'verified' ? 'Verification confirmed' : 'Correction submitted');
      await loadList();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit verification');
    }
  };

  const farmerName = detail?.farmer?.name || currentItem?.farmer_name || 'Farmer';
  const location = detail?.farmer?.region || currentItem?.farmer_region || 'Unknown';
  const image = detail?.scan_image_url || currentItem?.scan_image_url || '';
  const aiDetection = detail?.scan_pest_name || currentItem?.scan_pest_name || 'Unknown';
  const confidenceValue = typeof detail?.scan_confidence === 'number'
    ? detail.scan_confidence
    : typeof currentItem?.scan_confidence === 'number'
      ? currentItem.scan_confidence
      : null;
  const confidence = confidenceValue !== null ? Math.round(confidenceValue * 100) : 0;
  const description =
    detail?.messages?.find((msg) => msg.sender_role === 'farmer')?.body ||
    currentItem?.last_message ||
    'No description provided';
  const submittedAt = detail?.created_at || '';
  const crop = detail?.scan_crop_stage || currentItem?.scan_crop_stage || 'Unknown';

  const handleConfirm = () => handleVerify('verified');
  const handleCorrect = () => handleVerify('corrected');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Verification Workbench</h1>
          <p className="text-[#455A64]">Review and verify farmer pest reports</p>
        </div>
        <Badge className="bg-red-500 text-lg px-4 py-2">
          {items.length} Pending
        </Badge>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setCurrentIndex(currentIndex - 1);
          }}
          disabled={!hasPrev}
        >
          <ChevronLeft className="size-4 mr-2" />
          Previous
        </Button>
        <span className="text-sm text-[#455A64]">
          {items.length === 0 ? '0' : currentIndex + 1} of {items.length}
        </span>
        <Button
          variant="outline"
          onClick={() => {
            setCurrentIndex(currentIndex + 1);
          }}
          disabled={!hasNext}
        >
          Next
          <ChevronRight className="size-4 ml-2" />
        </Button>
      </div>

      {!loading && items.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-[#455A64]">
            No pending verifications right now.
          </CardContent>
        </Card>
      )}

      {/* Main Content - Two Column Layout */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Evidence */}
        <Card>
          <CardHeader>
            <CardTitle>Evidence Photo</CardTitle>
            <div className="flex items-center justify-between mt-2">
              <div>
                <p className="text-sm text-[#455A64]">Farmer: {farmerName}</p>
                <p className="text-sm text-[#455A64]">Location: {location}</p>
                <p className="text-sm text-[#455A64]">Submitted: {submittedAt || '—'}</p>
              </div>
              <Badge variant="outline">{crop}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                {image ? (
                  <img
                    src={image}
                    alt="Pest evidence"
                    className="w-full h-auto transition-transform duration-200"
                    style={{ transform: `scale(${zoom / 100})` }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-sm text-gray-500">
                    {loading || loadingDetail ? 'Loading image...' : 'No image available'}
                  </div>
                )}
              </div>
              
              {/* Zoom Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.max(50, zoom - 25))}
                  disabled={zoom <= 50}
                >
                  <ZoomOut className="size-4" />
                </Button>
                <span className="text-sm text-[#455A64] min-w-16 text-center">{zoom}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="size-4" />
                </Button>
              </div>

              {/* Farmer Description */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm mb-1">Farmer's Description:</p>
                <p className="text-sm text-[#455A64]">{description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Diagnosis */}
        <Card>
          <CardHeader>
            <CardTitle>Diagnosis & Action</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* AI Suggestion */}
            <div className="p-4 bg-blue-50 border-2 border-[#1976D2] rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="size-5 text-[#1976D2] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm mb-2">AI Detection System</p>
                  <p className="text-xl mb-2">{aiDetection}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-[#4CAF50]"
                        style={{ width: `${confidence}%` }}
                      />
                    </div>
                    <span className="text-sm">{confidence}%</span>
                  </div>
                  <p className="text-xs text-[#455A64] mt-2">Confidence Level</p>
                </div>
              </div>
            </div>

            {/* Expert Note Input */}
            <div className="space-y-2">
              <label className="text-sm">Expert Notes & Recommendations</label>
              <Textarea
                placeholder="Add specific advice, treatment recommendations, or corrections...
                
Example: 
- Confirmed Brown Planthopper infestation
- Recommend 5ml Neem oil per liter of water
- Spray early morning and evening for 7 days
- Monitor closely for next 2 weeks"
                value={expertNote}
                onChange={(e) => setExpertNote(e.target.value)}
                rows={8}
                className="resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                className="bg-[#4CAF50] hover:bg-[#45a049] h-14 text-base"
                onClick={handleConfirm}
                disabled={loading || loadingDetail || !currentItem}
              >
                <CheckCircle className="size-5 mr-2" />
                Confirm Verification
              </Button>
              <Button
                variant="outline"
                className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 h-14 text-base"
                onClick={handleCorrect}
                disabled={loading || loadingDetail || !currentItem}
              >
                <XCircle className="size-5 mr-2" />
                Correct Diagnosis
              </Button>
            </div>

            {/* Quick Treatment Suggestions */}
            <div className="space-y-2">
              <p className="text-sm">Quick Treatment Templates:</p>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto py-3 text-left"
                  onClick={() => setExpertNote('Confirmed diagnosis. Apply Neem oil solution (5ml per liter) twice daily for 7 days. Remove affected plants if severe.')}
                >
                  <span className="text-xs">Standard Pest Treatment Protocol</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto py-3 text-left"
                  onClick={() => setExpertNote('Disease confirmed. Remove infected leaves immediately. Apply recommended fungicide. Improve field drainage.')}
                >
                  <span className="text-xs">Fungal Disease Protocol</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto py-3 text-left"
                  onClick={() => setExpertNote('Unable to confirm from image. Please submit clearer photos showing: 1) Close-up of affected area 2) Whole plant view 3) Underside of leaves')}
                >
                  <span className="text-xs">Request Better Images</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      )}
    </div>
  );
}
