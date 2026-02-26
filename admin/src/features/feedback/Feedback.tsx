import { useEffect, useState } from 'react';
import { MessageSquare, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card } from '../../shared/ui/card';
import { Badge } from '../../shared/ui/badge';
import { Button } from '../../shared/ui/button';

export function Feedback() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const [feedbacks, setFeedbacks] = useState<Array<{
    id: number;
    role: string;
    subject: string;
    message: string;
    created_at: string;
    status: string;
    priority: string;
    user_id?: number | null;
  }>>([]);
  const [loading, setLoading] = useState(false);

  const loadFeedbacks = async () => {
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/admin/feedback`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load feedback');
      const data = await res.json();
      setFeedbacks(data.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const markResolved = async (id: number) => {
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    const res = await fetch(`${apiBase}/admin/feedback/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'resolved' }),
    });
    if (res.ok) {
      await loadFeedbacks();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Resolved
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'urgent':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Urgent
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2" style={{ color: '#263238' }}>Feedback Inbox</h1>
          <p className="text-gray-600">Messages and feedback from users</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Clock className="w-4 h-4" />
            Pending ({feedbacks.filter(f => f.status === 'pending').length})
          </Button>
          <Button variant="outline" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            Urgent ({feedbacks.filter(f => f.status === 'urgent').length})
          </Button>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {loading && (
          <Card className="p-6 text-gray-600">Loading feedback...</Card>
        )}
        {feedbacks.map((feedback) => (
          <Card
            key={feedback.id}
            className={`p-6 hover:shadow-md transition-shadow ${
              feedback.status === 'urgent' ? 'border-l-4 border-l-red-500' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5" style={{ color: '#2E7D32' }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-lg">{feedback.subject}</h3>
                    {getStatusBadge(feedback.status)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <span className="font-medium">User #{feedback.user_id || feedback.id}</span>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs">
                      {feedback.role}
                    </Badge>
                    <span>•</span>
                    <span>{feedback.created_at}</span>
                    <span>•</span>
                    <span className="text-gray-500">ID: FB{String(feedback.id).padStart(4, '0')}</span>
                  </div>
                  <p className="text-gray-700">{feedback.message}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 ml-14">
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
              >
                Reply
              </Button>
              {feedback.status !== 'resolved' && (
                <Button
                  size="sm"
                  className="gap-2"
                  style={{ backgroundColor: '#2E7D32' }}
                  onClick={() => markResolved(feedback.id)}
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as Resolved
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
