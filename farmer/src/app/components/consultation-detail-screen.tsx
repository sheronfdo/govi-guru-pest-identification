import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Send, Paperclip, Image as ImageIcon } from 'lucide-react';

interface ConsultationDetailScreenProps {
  consultationId: number | null;
  onBack: () => void;
}

interface ConsultationMessage {
  id: number;
  sender_role: string;
  body: string;
  attachment_url?: string | null;
  created_at: string;
}

interface ConsultationDetail {
  id: number;
  status: string;
  scan_image_url?: string | null;
  scan_pest_name?: string | null;
  scan_confidence?: number | null;
  scan_crop_stage?: string | null;
  created_at: string;
  messages: ConsultationMessage[];
}

export function ConsultationDetailScreen({ consultationId, onBack }: ConsultationDetailScreenProps) {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const [data, setData] = useState<ConsultationDetail | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const maxImageSize = 5 * 1024 * 1024;
  const allowedImageTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

  useEffect(() => {
    if (!attachmentFile) {
      setAttachmentPreview(null);
      return;
    }
    const url = URL.createObjectURL(attachmentFile);
    setAttachmentPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [attachmentFile]);

  useEffect(() => {
    if (!consultationId) return;
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    setLoading(true);
    setError('');
    fetch(`${apiBase}/farmer/consultations/${consultationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load consultation');
        return res.json();
      })
      .then((result) => setData(result))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load consultation'))
      .finally(() => setLoading(false));
  }, [consultationId]);

  const handleSend = async () => {
    const messageValue = message.trim();
    if (!consultationId || !messageValue) return;
    if (messageValue.length > 5000) {
      setError('Message is too long');
      return;
    }
    if (attachmentFile) {
      if (!allowedImageTypes.has(attachmentFile.type)) {
        setError('Attachment must be a JPG, PNG, or WEBP image');
        return;
      }
      if (attachmentFile.size > maxImageSize) {
        setError('Attachment must be 5MB or smaller');
        return;
      }
    }
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    setSending(true);
    setError('');
    try {
      const form = new FormData();
      form.append('message', messageValue);
      if (attachmentFile) form.append('attachment', attachmentFile);
      const res = await fetch(`${apiBase}/farmer/consultations/${consultationId}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!res.ok) throw new Error('Failed to send message');
      const updated = await res.json();
      setData(updated);
      setMessage('');
      setAttachmentFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (!consultationId) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAFA' }}>
        <p className="text-gray-600">No consultation selected</p>
      </div>
    );
  }

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
          <h2 className="flex-1 text-center text-xl font-bold text-white">Consultation</h2>
          <div className="w-10" />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {loading && <p className="text-center mt-6 text-gray-600">Loading...</p>}
        {error && <p className="text-center mt-6 text-red-600">{error}</p>}

        {data && (
          <>
            <div className="px-6 py-4">
              <div className="bg-white rounded-xl p-4 shadow-md flex items-center gap-4">
                {data.scan_image_url ? (
                  <img
                    src={data.scan_image_url}
                    alt="Context"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
                    <ImageIcon className="w-6 h-6" style={{ color: '#999' }} />
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Opened: {data.created_at}</p>
                  <p className="text-xs text-gray-400">Status: {data.status}</p>
                  {data.scan_pest_name && (
                    <p className="text-xs text-gray-500 mt-1">
                      AI: {data.scan_pest_name}
                      {typeof data.scan_confidence === 'number' ? ` (${Math.round(data.scan_confidence * 100)}%)` : ''}
                      {data.scan_crop_stage ? ` • ${data.scan_crop_stage}` : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-4">
              <div className="space-y-3">
                {data.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_role === 'farmer' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-xl p-3 ${
                        msg.sender_role === 'farmer'
                          ? 'bg-[#4CAF50] text-white'
                          : 'bg-white text-gray-900 border'
                      }`}
                    >
                      <p className="text-sm">{msg.body}</p>
                      {msg.attachment_url && (
                        <img
                          src={msg.attachment_url}
                          alt="Attachment"
                          className="mt-2 rounded-lg border max-h-40 object-cover"
                        />
                      )}
                      <p className={`text-xs mt-2 ${msg.sender_role === 'farmer' ? 'text-green-100' : 'text-gray-500'}`}>
                        {msg.created_at}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {attachmentPreview && (
              <div className="px-6 pb-3">
                <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
                  <img src={attachmentPreview} alt="Attachment preview" className="w-12 h-12 rounded-lg object-cover" />
                  <p className="text-sm text-gray-600">Photo attached</p>
                </div>
              </div>
            )}

            <div className="px-6 pb-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) {
                    if (!allowedImageTypes.has(file.type)) {
                      setError('Attachment must be a JPG, PNG, or WEBP image');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                      return;
                    }
                    if (file.size > maxImageSize) {
                      setError('Attachment must be 5MB or smaller');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                      return;
                    }
                  }
                  setError('');
                  setAttachmentFile(file);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-3 rounded-xl border"
                  style={{ borderColor: '#e0e0e0', backgroundColor: 'white' }}
                >
                  <Paperclip className="w-5 h-5" style={{ color: '#795548' }} />
                </button>
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-xl border px-4"
                  style={{ borderColor: '#e0e0e0' }}
                />
                <button
                  type="button"
                  disabled={!message.trim() || sending}
                  onClick={handleSend}
                  className="px-5 py-3 rounded-xl text-white font-semibold disabled:opacity-50"
                  style={{ backgroundColor: '#4CAF50' }}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
