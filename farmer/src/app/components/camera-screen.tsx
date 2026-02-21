import { Camera, Image as ImageIcon, ArrowLeft, Info } from 'lucide-react';

interface CameraScreenProps {
  onBack: () => void;
  onCapture: (file: File) => void;
  loading?: boolean;
  error?: string;
  progress?: number;
}

export function CameraScreen({ onBack, onCapture, loading = false, error, progress = 0 }: CameraScreenProps) {
  const handleFileChange = (file?: File | null) => {
    if (!file) return;
    onCapture(file);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#000' }}>
      {/* Header */}
      <div className="flex items-center px-4 py-4" style={{ backgroundColor: '#000' }}>
        <button
          onClick={onBack}
          className="p-2 rounded-lg"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h2 className="flex-1 text-center text-xl font-bold text-white">Scan Pest</h2>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Viewfinder Area */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative w-full max-w-md aspect-square">
          {/* Viewfinder Frame */}
          <div
            className="w-full h-full rounded-2xl border-4 flex items-center justify-center relative overflow-hidden"
            style={{ borderColor: '#4CAF50', backgroundColor: '#1a1a1a' }}
          >
            {/* Corner Markers */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4" style={{ borderColor: '#4CAF50' }} />
            <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4" style={{ borderColor: '#4CAF50' }} />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4" style={{ borderColor: '#4CAF50' }} />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4" style={{ borderColor: '#4CAF50' }} />

            {/* Center Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-2 rounded-full" style={{ borderColor: '#4CAF50' }}>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full" style={{ backgroundColor: '#4CAF50' }} />
              </div>
            </div>

            {/* Mock camera view */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="w-20 h-20 text-gray-600 opacity-30" />
            </div>
          </div>

          {/* Help Text */}
          <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-center gap-2">
            <Info className="w-5 h-5" style={{ color: '#4CAF50' }} />
            <p className="text-sm text-white opacity-90">
              Keep the insect in the center of the frame
            </p>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="px-6 pb-8 pt-12">
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <label
            className="flex flex-col items-center justify-center gap-3 py-6 rounded-xl transition-transform active:scale-95 cursor-pointer"
            style={{ backgroundColor: '#4CAF50' }}
          >
            <Camera className="w-10 h-10 text-white" />
            <span className="text-white text-lg font-semibold">
              {loading ? 'Scanning...' : 'Take Photo'}
            </span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
              disabled={loading}
            />
          </label>

          <label
            className="flex flex-col items-center justify-center gap-3 py-6 rounded-xl transition-transform active:scale-95 cursor-pointer"
            style={{ backgroundColor: '#795548' }}
          >
            <ImageIcon className="w-10 h-10 text-white" />
            <span className="text-white text-lg font-semibold">
              {loading ? 'Scanning...' : 'Upload'}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
              disabled={loading}
            />
          </label>
        </div>
      </div>

      {loading && (
        <div className="px-6 pb-4">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-gray-300 text-center mt-2">{progress}% uploaded</p>
        </div>
      )}

      {error && (
        <div className="px-6 pb-6">
          <p className="text-sm text-red-400 text-center">{error}</p>
        </div>
      )}
    </div>
  );
}
