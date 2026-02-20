import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ZoomIn, ZoomOut, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const mockVerifications = [
  {
    id: 1,
    farmer: 'Sunil Perera',
    location: 'Kurunegala',
    image: 'https://images.unsplash.com/photo-1611633166749-4d35b1daa67d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMHBsYW50aG9wcGVyJTIwcGVzdHxlbnwxfHx8fDE3NzA1NjE4NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    aiDetection: 'Brown Planthopper',
    confidence: 88,
    description: 'Found insects on rice plants causing yellowing',
    submittedAt: '2024-02-08 09:30 AM',
    crop: 'Rice'
  },
  {
    id: 2,
    farmer: 'Kamala Jayawardena',
    location: 'Anuradhapura',
    image: 'https://images.unsplash.com/photo-1758903178566-81b9026340ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9wJTIwZGlzZWFzZSUyMGxlYWZ8ZW58MXx8fHwxNzcwNTYxODUyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    aiDetection: 'Leaf Blight',
    confidence: 92,
    description: 'Brown spots appearing on leaves rapidly',
    submittedAt: '2024-02-08 08:15 AM',
    crop: 'Paddy'
  },
  {
    id: 3,
    farmer: 'Ranjan Fernando',
    location: 'Polonnaruwa',
    image: 'https://images.unsplash.com/photo-1505216980056-a7b7b1c6e000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwcGVzdCUyMGRhbWFnZXxlbnwxfHx8fDE3NzA1NjE4NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    aiDetection: 'Rice Blast',
    confidence: 85,
    description: 'Diamond-shaped lesions on leaves',
    submittedAt: '2024-02-08 07:45 AM',
    crop: 'Rice'
  }
];

export default function VerificationWorkbench() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [expertNote, setExpertNote] = useState('');
  
  const currentItem = mockVerifications[currentIndex];
  const hasNext = currentIndex < mockVerifications.length - 1;
  const hasPrev = currentIndex > 0;

  const handleConfirm = () => {
    toast.success(`Verification confirmed for ${currentItem.farmer}'s report`);
    if (hasNext) {
      setCurrentIndex(currentIndex + 1);
      setExpertNote('');
      setZoom(100);
    }
  };

  const handleCorrect = () => {
    if (!expertNote.trim()) {
      toast.error('Please provide correction details');
      return;
    }
    toast.success(`Correction submitted for ${currentItem.farmer}'s report`);
    if (hasNext) {
      setCurrentIndex(currentIndex + 1);
      setExpertNote('');
      setZoom(100);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Verification Workbench</h1>
          <p className="text-[#455A64]">Review and verify farmer pest reports</p>
        </div>
        <Badge className="bg-red-500 text-lg px-4 py-2">
          {mockVerifications.length} Pending
        </Badge>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setCurrentIndex(currentIndex - 1);
            setExpertNote('');
            setZoom(100);
          }}
          disabled={!hasPrev}
        >
          <ChevronLeft className="size-4 mr-2" />
          Previous
        </Button>
        <span className="text-sm text-[#455A64]">
          {currentIndex + 1} of {mockVerifications.length}
        </span>
        <Button
          variant="outline"
          onClick={() => {
            setCurrentIndex(currentIndex + 1);
            setExpertNote('');
            setZoom(100);
          }}
          disabled={!hasNext}
        >
          Next
          <ChevronRight className="size-4 ml-2" />
        </Button>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Evidence */}
        <Card>
          <CardHeader>
            <CardTitle>Evidence Photo</CardTitle>
            <div className="flex items-center justify-between mt-2">
              <div>
                <p className="text-sm text-[#455A64]">Farmer: {currentItem.farmer}</p>
                <p className="text-sm text-[#455A64]">Location: {currentItem.location}</p>
                <p className="text-sm text-[#455A64]">Submitted: {currentItem.submittedAt}</p>
              </div>
              <Badge variant="outline">{currentItem.crop}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={currentItem.image}
                  alt="Pest evidence"
                  className="w-full h-auto transition-transform duration-200"
                  style={{ transform: `scale(${zoom / 100})` }}
                />
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
                <p className="text-sm text-[#455A64]">{currentItem.description}</p>
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
                  <p className="text-xl mb-2">{currentItem.aiDetection}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-[#4CAF50]"
                        style={{ width: `${currentItem.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm">{currentItem.confidence}%</span>
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
              >
                <CheckCircle className="size-5 mr-2" />
                Confirm Verification
              </Button>
              <Button
                variant="outline"
                className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 h-14 text-base"
                onClick={handleCorrect}
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
    </div>
  );
}
