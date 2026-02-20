import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Send, Search, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';

const mockConversations = [
  {
    id: 1,
    farmer: 'Sunil Perera',
    lastMessage: 'Thank you for the advice on the planthopper issue',
    timestamp: '10:30 AM',
    unread: 0,
    status: 'replied',
    image: 'https://images.unsplash.com/photo-1611633166749-4d35b1daa67d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMHBsYW50aG9wcGVyJTIwcGVzdHxlbnwxfHx8fDE3NzA1NjE4NTJ8MA&ixlib=rb-4.1.0&q=80&w=400'
  },
  {
    id: 2,
    farmer: 'Kamala Jayawardena',
    lastMessage: 'Is it safe to use this pesticide with other crops nearby?',
    timestamp: 'Yesterday',
    unread: 2,
    status: 'unanswered',
    image: 'https://images.unsplash.com/photo-1758903178566-81b9026340ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9wJTIwZGlzZWFzZSUyMGxlYWZ8ZW58MXx8fHwxNzcwNTYxODUyfDA&ixlib=rb-4.1.0&q=80&w=400'
  },
  {
    id: 3,
    farmer: 'Nimal Silva',
    lastMessage: 'The treatment is working well, leaves are recovering',
    timestamp: 'Yesterday',
    unread: 0,
    status: 'replied',
    image: 'https://images.unsplash.com/photo-1709489016628-d173053e7eae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMGZpZWxkJTIwY3JvcHN8ZW58MXx8fHwxNzcwNTYxODUxfDA&ixlib=rb-4.1.0&q=80&w=400'
  },
  {
    id: 4,
    farmer: 'Ranjan Fernando',
    lastMessage: 'Should I continue the treatment for another week?',
    timestamp: '2 days ago',
    unread: 1,
    status: 'unanswered',
    image: 'https://images.unsplash.com/photo-1505216980056-a7b7b1c6e000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwcGVzdCUyMGRhbWFnZXxlbnwxfHx8fDE3NzA1NjE4NTJ8MA&ixlib=rb-4.1.0&q=80&w=400'
  },
];

const mockMessages = {
  1: [
    { sender: 'farmer', text: 'I found these insects on my rice plants', time: '09:15 AM' },
    { sender: 'farmer', text: 'The leaves are turning yellow', time: '09:15 AM' },
    { sender: 'officer', text: 'I can see brown planthoppers in your photo. This is a common pest in rice crops.', time: '09:30 AM' },
    { sender: 'officer', text: 'Use 5ml of Neem oil per liter of water. Spray twice daily for 7 days.', time: '09:30 AM' },
    { sender: 'farmer', text: 'Thank you for the advice on the planthopper issue', time: '10:30 AM' },
  ],
  2: [
    { sender: 'farmer', text: 'I have leaf spots appearing on my paddy', time: 'Yesterday 8:30 AM' },
    { sender: 'officer', text: 'This appears to be leaf blight. You need to apply fungicide immediately.', time: 'Yesterday 9:00 AM' },
    { sender: 'farmer', text: 'Is it safe to use this pesticide with other crops nearby?', time: 'Yesterday 2:15 PM' },
  ],
  3: [
    { sender: 'farmer', text: 'Started the treatment you recommended', time: '2 days ago' },
    { sender: 'officer', text: 'Good! Monitor the progress and let me know in a few days.', time: '2 days ago' },
    { sender: 'farmer', text: 'The treatment is working well, leaves are recovering', time: 'Yesterday' },
  ],
  4: [
    { sender: 'farmer', text: 'Following your advice for rice blast treatment', time: '5 days ago' },
    { sender: 'officer', text: 'Continue for at least 7 days and monitor closely', time: '5 days ago' },
    { sender: 'farmer', text: 'Should I continue the treatment for another week?', time: '2 days ago' },
  ],
};

export default function ConsultationInbox() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');

  const filteredConversations = mockConversations.filter(conv =>
    conv.farmer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      toast.success('Message sent successfully');
      setMessageInput('');
    }
  };

  const selectedConv = mockConversations.find(c => c.id === selectedConversation);
  const messages = selectedConversation ? mockMessages[selectedConversation as keyof typeof mockMessages] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Consultation Inbox</h1>
        <p className="text-[#455A64]">Respond to farmer queries and provide guidance</p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        {/* Conversation List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Messages</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <ScrollArea className="h-[calc(100%-120px)]">
            <CardContent className="space-y-2">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    selectedConversation === conv.id
                      ? 'bg-[#1976D2] text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium">{conv.farmer}</p>
                    {conv.unread > 0 && (
                      <Badge className="bg-red-500">{conv.unread}</Badge>
                    )}
                    {conv.status === 'replied' && (
                      <CheckCheck className="size-4 text-[#4CAF50]" />
                    )}
                  </div>
                  <p className={`text-sm line-clamp-1 ${
                    selectedConversation === conv.id ? 'text-blue-100' : 'text-[#455A64]'
                  }`}>
                    {conv.lastMessage}
                  </p>
                  <p className={`text-xs mt-1 ${
                    selectedConversation === conv.id ? 'text-blue-200' : 'text-gray-400'
                  }`}>
                    {conv.timestamp}
                  </p>
                </button>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConv ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedConv.farmer}</CardTitle>
                    <Badge
                      variant={selectedConv.status === 'replied' ? 'secondary' : 'default'}
                      className={`mt-2 ${
                        selectedConv.status === 'replied'
                          ? 'bg-[#4CAF50]'
                          : 'bg-orange-500'
                      }`}
                    >
                      {selectedConv.status === 'replied' ? 'Replied' : 'Unanswered'}
                    </Badge>
                  </div>
                  {/* Pinned Image */}
                  <div className="text-right">
                    <p className="text-xs text-[#455A64] mb-2">Context Photo</p>
                    <img
                      src={selectedConv.image}
                      alt="Context"
                      className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                    />
                  </div>
                </div>
              </CardHeader>

              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.sender === 'officer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-4 ${
                          msg.sender === 'officer'
                            ? 'bg-[#1976D2] text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p
                          className={`text-xs mt-2 ${
                            msg.sender === 'officer' ? 'text-blue-200' : 'text-gray-500'
                          }`}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your response..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button
                    className="bg-[#1976D2] hover:bg-[#1565C0]"
                    onClick={handleSendMessage}
                  >
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#455A64]">
              Select a conversation to view messages
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
