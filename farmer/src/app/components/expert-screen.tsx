import { useState } from 'react';
import { ArrowLeft, Send, Paperclip, Image as ImageIcon } from 'lucide-react';

interface ExpertScreenProps {
  onBack: () => void;
  hasAttachment?: boolean;
}

export function ExpertScreen({ onBack, hasAttachment = false }: ExpertScreenProps) {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Mock submission - in real app would send to backend
    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
    }, 2000);
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

      {/* Attachment Preview */}
      {hasAttachment && (
        <div className="px-6 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-md flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#4CAF50' }}
            >
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-base" style={{ color: '#333' }}>
                Pest Image Attached
              </p>
              <p className="text-sm" style={{ color: '#666' }}>
                From recent scan
              </p>
            </div>
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
        </div>

        <div className="pb-6">
          {/* Attachment Button */}
          <button
            type="button"
            className="w-full mb-4 py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-3 transition-transform active:scale-95"
            style={{
              backgroundColor: 'white',
              color: '#795548',
              border: '2px solid #795548',
            }}
          >
            <Paperclip className="w-5 h-5" />
            Attach Photos
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={message.length < 20 || submitted}
            className="w-full py-5 rounded-xl text-lg font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50"
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
          >
            <Send className="w-6 h-6" />
            {submitted ? 'Sent Successfully!' : 'Send to Agriculture Officer'}
          </button>
        </div>
      </form>
    </div>
  );
}
