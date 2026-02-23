import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Send, Paperclip, Image as ImageIcon, X } from 'lucide-react';

interface ExpertScreenProps {
  onBack: () => void;
  scanId?: number | null;
  scanImageUrl?: string | null;
}

export function ExpertScreen({ onBack, scanId = null, scanImageUrl = null }: ExpertScreenProps) {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!attachmentFile) {
      setAttachmentPreview(null);
      return;
    }
    const url = URL.createObjectURL(attachmentFile);
    setAttachmentPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [attachmentFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 20) return;
    const token = localStorage.getItem('gg_token');
    if (!token) {
      onBack();
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const form = new FormData();
      form.append('message', message.trim());
      if (scanId) form.append('scan_id', String(scanId));
      if (attachmentFile) form.append('attachment', attachmentFile);

      const res = await fetch(`${apiBase}/farmer/consultations`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (res.status === 401) {
        localStorage.removeItem('gg_token');
        window.location.href = '/';
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to send request');
      }
      setSent(true);
      setMessage('');
      setAttachmentFile(null);
      setTimeout(() => setSent(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <div className="px-4 py-4" style={{ backgroundColor: '#4CAF50' }}>
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-2 rounded-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="flex-1 text-center text-xl font-bold text-white">Ask an Expert</h2>
          <div className="w-10" />
        </div>
      </div>

      {/* Info Card */}
      <div className="px-6 py-6">
        <div className="bg-white rounded-xl p-5 shadow-md">
          <h3 className="text-lg font-bold mb-2" style={{ color: '#333' }}>
            Agriculture Officer
          </h3>
          <p className="text-base" style={{ color: '#666' }}>
            Our agricultural experts will respond within 24 hours. Describe your problem in detail.
          </p>
        </div>
      </div>

      {/* Attachment Preview (Scan) */}
      {scanImageUrl && (
        <div className="px-6 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-md flex items-center gap-4">
            <img
              src={scanImageUrl}
              alt="Scan attachment"
              className="w-16 h-16 rounded-lg object-cover border"
            />
            <div className="flex-1">
              <p className="font-semibold text-base" style={{ color: '#333' }}>
                Scan Image Attached
              </p>
              <p className="text-sm" style={{ color: '#666' }}>
                From recent scan
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Attachment Preview (Manual) */}
      {attachmentPreview && (
        <div className="px-6 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-md flex items-center gap-4">
            <img
              src={attachmentPreview}
              alt="Attachment preview"
              className="w-16 h-16 rounded-lg object-cover border"
            />
            <div className="flex-1">
              <p className="font-semibold text-base" style={{ color: '#333' }}>
                Photo Attached
              </p>
              <p className="text-sm" style={{ color: '#666' }}>
                {attachmentFile?.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAttachmentFile(null)}
              className="p-2 rounded-full"
              style={{ backgroundColor: '#F5F5F5' }}
              aria-label="Remove attachment"
            >
              <X className="w-4 h-4" style={{ color: '#666' }} />
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-6">
        <div className="flex-1 mb-4">
          <label className="block text-base font-semibold mb-3" style={{ color: '#333' }}>
            Describe your problem
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about the pest issue you're facing, what you've tried so far, and any specific questions you have..."
            className="w-full h-48 p-4 rounded-xl border-2 text-base resize-none"
            style={{
              borderColor: '#e0e0e0',
              backgroundColor: 'white',
            }}
          />
          <p className="text-sm mt-2" style={{ color: '#999' }}>
            Minimum 20 characters
          </p>
          {error && <p className="text-sm mt-2 text-red-600">{error}</p>}
        </div>

        <div className="pb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setAttachmentFile(file);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
          />

          {/* Attachment Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full mb-4 py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-3 transition-transform active:scale-95"
            style={{
              backgroundColor: 'white',
              color: '#795548',
              border: '2px solid #795548',
            }}
          >
            <Paperclip className="w-5 h-5" />
            {attachmentFile ? 'Replace Photo' : 'Attach Photo'}
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={message.trim().length < 20 || submitting}
            className="w-full py-5 rounded-xl text-lg font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50"
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
          >
            <Send className="w-6 h-6" />
            {submitting ? 'Sending...' : sent ? 'Sent Successfully!' : 'Send to Agriculture Officer'}
          </button>
        </div>
      </form>
    </div>
  );
}
