import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Send, Search, CheckCheck, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ConsultationSummary {
  id: number;
  farmer_id: number;
  farmer_name?: string | null;
  status: string;
  last_message?: string | null;
  last_message_at?: string | null;
  last_message_sender_role?: string | null;
  scan_image_url?: string | null;
}

interface ConsultationMessage {
  id: number;
  sender_id: number;
  sender_role: string;
  sender_name?: string | null;
  body: string;
  attachment_url?: string | null;
  created_at: string;
}

interface ConsultationDetail {
  id: number;
  status: string;
  farmer: { id: number; name?: string | null };
  officer?: { id: number; name?: string | null } | null;
  scan_id?: number | null;
  scan_image_url?: string | null;
  created_at: string;
  messages: ConsultationMessage[];
}

export default function ConsultationInbox() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState<ConsultationSummary[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<ConsultationDetail | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) =>
      (conv.farmer_name || 'Unknown').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [conversations, searchTerm]);

  const loadConversations = async () => {
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    setLoadingList(true);
    try {
      const res = await fetch(`${apiBase}/officer/consultations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load consultations');
      const data = await res.json();
      setConversations(data.items || []);
      if (!selectedConversation && data.items?.length) {
        setSelectedConversation(data.items[0].id);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load consultations');
    } finally {
      setLoadingList(false);
    }
  };

  const loadConversationDetail = async (consultationId: number) => {
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    setLoadingDetail(true);
    try {
      const res = await fetch(`${apiBase}/officer/consultations/${consultationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load conversation');
      const data = await res.json();
      setSelectedDetail(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load conversation');
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadConversationDetail(selectedConversation);
    }
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    const message = messageInput.trim();
    if (!message || !selectedConversation) return;
    if (message.length > 5000) {
      toast.error('Message is too long');
      return;
    }
    const token = localStorage.getItem('gg_token');
    if (!token) return;

    try {
      const form = new FormData();
      form.append('message', message);
      const res = await fetch(`${apiBase}/officer/consultations/${selectedConversation}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!res.ok) throw new Error('Failed to send message');
      setMessageInput('');
      await loadConversationDetail(selectedConversation);
      await loadConversations();
      toast.success('Message sent successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  const selectedConv = conversations.find((c) => c.id === selectedConversation);
  const messages = selectedDetail?.messages || [];
  const statusMeta = (status?: string) => {
    switch (status) {
      case 'replied':
        return { label: 'Replied', badge: 'bg-[#4CAF50]', icon: 'check' as const };
      case 'verified':
        return { label: 'Verified', badge: 'bg-emerald-600', icon: 'check' as const };
      case 'corrected':
        return { label: 'Corrected', badge: 'bg-orange-500', icon: 'check' as const };
      case 'closed':
        return { label: 'Closed', badge: 'bg-gray-500', icon: 'check' as const };
      default:
        return { label: 'Unanswered', badge: 'bg-orange-500', icon: 'none' as const };
    }
  };

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
              {loadingList && <p className="text-sm text-gray-500">Loading...</p>}
              {!loadingList && filteredConversations.length === 0 && (
                <p className="text-sm text-gray-500">No consultations found</p>
              )}
              {filteredConversations.map((conv) => {
                const unread = conv.last_message_sender_role === 'farmer' ? 1 : 0;
                const meta = statusMeta(conv.status);
                return (
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
                      <p className="font-medium">{conv.farmer_name || 'Unknown Farmer'}</p>
                      {unread > 0 && (
                        <Badge className="bg-red-500">{unread}</Badge>
                      )}
                      {meta.icon === 'check' && (
                        <CheckCheck className="size-4 text-[#4CAF50]" />
                      )}
                    </div>
                    <p className={`text-sm line-clamp-1 ${
                      selectedConversation === conv.id ? 'text-blue-100' : 'text-[#455A64]'
                    }`}>
                      {conv.last_message || 'New consultation'}
                    </p>
                    <p className={`text-xs mt-1 ${
                      selectedConversation === conv.id ? 'text-blue-200' : 'text-gray-400'
                    }`}>
                      {conv.last_message_at || ''}
                    </p>
                  </button>
                );
              })}
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
                    <CardTitle>{selectedConv.farmer_name || 'Unknown Farmer'}</CardTitle>
                    {(() => {
                      const meta = statusMeta(selectedConv.status);
                      return (
                        <Badge variant="secondary" className={`mt-2 ${meta.badge}`}>
                          {meta.label}
                        </Badge>
                      );
                    })()}
                  </div>
                  {/* Pinned Image */}
                  <div className="text-right">
                    <p className="text-xs text-[#455A64] mb-2">Context Photo</p>
                    {selectedConv.scan_image_url ? (
                      <img
                        src={selectedConv.scan_image_url}
                        alt="Context"
                        className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <ImageIcon className="size-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <ScrollArea className="flex-1 p-6">
                {loadingDetail && <p className="text-sm text-gray-500">Loading...</p>}
                {!loadingDetail && (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender_role === 'officer' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-4 ${
                            msg.sender_role === 'officer'
                              ? 'bg-[#1976D2] text-white'
                              : 'bg-gray-100 text-gray-900'
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
                          <p
                            className={`text-xs mt-2 ${
                              msg.sender_role === 'officer' ? 'text-blue-200' : 'text-gray-500'
                            }`}
                          >
                            {msg.created_at}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
