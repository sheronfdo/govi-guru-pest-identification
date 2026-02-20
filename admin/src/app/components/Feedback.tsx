import { MessageSquare, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export function Feedback() {
  const feedbacks = [
    {
      id: 'FB001',
      from: 'Amal Perera',
      role: 'Farmer',
      subject: 'Great app! Helped identify pest quickly',
      message: 'Thank you for this wonderful system. It helped me identify the pest in my rice field within minutes.',
      date: '2026-02-07 09:30',
      status: 'resolved',
      priority: 'normal',
    },
    {
      id: 'FB002',
      from: 'Kumari Silva',
      role: 'Farmer',
      subject: 'Need help with pest control',
      message: 'I identified the pest but need more information on organic control methods. Can you provide more details?',
      date: '2026-02-07 08:15',
      status: 'pending',
      priority: 'urgent',
    },
    {
      id: 'FB003',
      from: 'Nimal Bandara',
      role: 'Officer',
      subject: 'Feature request: Multilingual support',
      message: 'It would be great to have more Tamil language support for farmers in the Northern Province.',
      date: '2026-02-06 16:45',
      status: 'pending',
      priority: 'normal',
    },
    {
      id: 'FB004',
      from: 'Priya Jayawardena',
      role: 'Farmer',
      subject: 'App not loading images',
      message: 'When I try to upload photos from my phone, the app shows an error. Please help.',
      date: '2026-02-06 14:20',
      status: 'urgent',
      priority: 'urgent',
    },
    {
      id: 'FB005',
      from: 'Sunil Rathnayake',
      role: 'Farmer',
      subject: 'Excellent traditional methods section',
      message: 'The Kem methods section is very useful. My grandfather used similar methods. Great to see traditional knowledge preserved.',
      date: '2026-02-06 11:10',
      status: 'resolved',
      priority: 'normal',
    },
    {
      id: 'FB006',
      from: 'Chaminda Fernando',
      role: 'Farmer',
      subject: 'Question about crop stages',
      message: 'How do I know which crop stage my plants are in? Need more guidance on this.',
      date: '2026-02-05 17:30',
      status: 'pending',
      priority: 'normal',
    },
  ];

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
                    <span className="font-medium">{feedback.from}</span>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs">
                      {feedback.role}
                    </Badge>
                    <span>•</span>
                    <span>{feedback.date}</span>
                    <span>•</span>
                    <span className="text-gray-500">ID: {feedback.id}</span>
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
