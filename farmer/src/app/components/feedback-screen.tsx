import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface FeedbackScreenProps {
  onBack: () => void;
}

export function FeedbackScreen({ onBack }: FeedbackScreenProps) {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!subject.trim() || !message.trim()) {
      setError('Please fill in subject and message');
      return;
    }
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/farmer/feedback`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
          priority,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit feedback');
      setSuccess('Feedback submitted. Thank you!');
      setSubject('');
      setMessage('');
      setPriority('normal');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

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
          <h2 className="flex-1 text-center text-xl font-bold text-white">Send Feedback</h2>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#333' }}>
              Subject
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Short summary"
              className="w-full py-3 px-4 rounded-lg border-2 text-sm"
              style={{ borderColor: '#e0e0e0', backgroundColor: 'white' }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#333' }}>
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'normal' | 'urgent')}
              className="w-full py-3 px-4 rounded-lg border-2 text-sm"
              style={{ borderColor: '#e0e0e0', backgroundColor: 'white' }}
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#333' }}>
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue or suggestion"
              rows={6}
              className="w-full py-3 px-4 rounded-lg border-2 text-sm resize-none"
              style={{ borderColor: '#e0e0e0', backgroundColor: 'white' }}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl text-base font-bold text-white"
            style={{ backgroundColor: '#4CAF50' }}
          >
            {submitting ? 'Sending...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
}
