import { useEffect, useRef, useState } from 'react';
import { Camera, Image as ImageIcon, ArrowLeft, Info, X } from 'lucide-react';

interface CameraScreenProps {
  onBack: () => void;
  onCapture: (file: File) => Promise<void> | void;
  loading?: boolean;
  error?: string;
  nonPestNotice?: string | null;
  onDismissNonPestNotice?: () => void;
  progress?: number;
}

export function CameraScreen({
  onBack,
  onCapture,
  loading = false,
  error,
  nonPestNotice = null,
  onDismissNonPestNotice,
  progress = 0,
}: CameraScreenProps) {
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fallbackCameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileChange = (file?: File | null) => {
    if (!file) return;
    setPreviewFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const stopStream = (stream?: MediaStream | null) => {
    stream?.getTracks().forEach((track) => track.stop());
  };

  const startCamera = async () => {
    if (loading) return;
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      setShowCamera(true);
    } catch (err) {
      setCameraError('Camera not available. Opening file picker instead.');
      fallbackCameraInputRef.current?.click();
    }
  };

  useEffect(() => {
    if (showCamera && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(console.error);
    }
  }, [showCamera]);

  const closeCamera = () => {
    if (streamRef.current) {
      stopStream(streamRef.current);
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const width = video.videoWidth || 1024;
    const height = video.videoHeight || 1024;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, width, height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `scan-${Date.now()}.jpg`, { type: 'image/jpeg' });
      closeCamera();
      setPreviewFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }, 'image/jpeg', 0.9);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        stopStream(streamRef.current);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const clearPreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewFile(null);
  };

  const confirmPreview = () => {
    if (!previewFile) return;
    // Close preview so scan errors are visible on the main camera screen.
    clearPreview();
    onCapture(previewFile);
  };

  const dismissNonPestNotice = () => {
    onDismissNonPestNotice?.();
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
          <button
            type="button"
            onClick={startCamera}
            className="flex flex-col items-center justify-center gap-3 py-6 rounded-xl transition-transform active:scale-95"
            style={{ backgroundColor: '#4CAF50' }}
            disabled={loading}
          >
            <Camera className="w-10 h-10 text-white" />
            <span className="text-white text-lg font-semibold">
              {loading ? 'Scanning...' : 'Take Photo'}
            </span>
          </button>

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
              ref={galleryInputRef}
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

      {cameraError && (
        <div className="px-6 pb-6">
          <p className="text-sm text-red-400 text-center">{cameraError}</p>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files?.[0])}
        ref={fallbackCameraInputRef}
      />

      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={closeCamera}
              className="p-2 rounded-lg"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <h3 className="text-white font-semibold">Camera</h3>
            <div className="w-10" />
          </div>
          <div className="flex-1 flex items-center justify-center px-4">
            <video
              ref={videoRef}
              className="w-full max-w-md rounded-2xl border-2"
              style={{ borderColor: '#4CAF50' }}
              playsInline
              muted
            />
          </div>
          <div className="px-6 pb-10 pt-6">
            <button
              onClick={capturePhoto}
              className="w-full py-4 rounded-xl text-lg font-bold text-white"
              style={{ backgroundColor: '#4CAF50' }}
            >
              Capture
            </button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={clearPreview}
              className="p-2 rounded-lg"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <h3 className="text-white font-semibold">Preview</h3>
            <div className="w-10" />
          </div>
          <div className="flex-1 flex items-center justify-center px-6">
            <img
              src={previewUrl}
              alt="Scan preview"
              className="w-full max-w-md rounded-2xl border-2 object-contain"
              style={{ borderColor: '#4CAF50', maxHeight: '70vh' }}
            />
          </div>
          <div className="px-6 pb-10 pt-6 space-y-3">
            <button
              onClick={confirmPreview}
              className="w-full py-4 rounded-xl text-lg font-bold text-white"
              style={{ backgroundColor: '#4CAF50' }}
              disabled={loading}
            >
              {loading ? 'Scanning...' : 'Use This Photo'}
            </button>
            <button
              onClick={() => {
                clearPreview();
                galleryInputRef.current?.click();
              }}
              className="w-full py-3 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: '#795548', color: 'white' }}
              disabled={loading}
            >
              Choose Another
            </button>
          </div>
        </div>
      )}

      {nonPestNotice && (
        <div className="fixed inset-0 z-[60] bg-black/75 flex items-center justify-center px-6">
          <div
            className="w-full max-w-md rounded-2xl border p-5 shadow-2xl"
            style={{ backgroundColor: '#111', borderColor: '#4CAF50' }}
          >
            <div className="flex items-start gap-3">
              <div className="rounded-full p-2" style={{ backgroundColor: 'rgba(76,175,80,0.15)' }}>
                <Info className="w-5 h-5" style={{ color: '#4CAF50' }} />
              </div>
              <div>
                <h3 className="text-white text-lg font-bold">No Pest Detected</h3>
                <p className="text-sm text-gray-300 mt-1">{nonPestNotice}</p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <button
                type="button"
                className="w-full py-3 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: '#4CAF50' }}
                onClick={() => {
                  dismissNonPestNotice();
                  galleryInputRef.current?.click();
                }}
              >
                Choose Another Photo
              </button>
              <button
                type="button"
                className="w-full py-3 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: '#795548' }}
                onClick={() => {
                  dismissNonPestNotice();
                  startCamera();
                }}
              >
                Retake with Camera
              </button>
              <button
                type="button"
                className="w-full py-3 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                onClick={dismissNonPestNotice}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
