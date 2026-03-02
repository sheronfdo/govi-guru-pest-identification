import { useEffect, useState } from 'react';
import { Phone, CheckCircle, Clock } from 'lucide-react';
import { Card } from '../../shared/ui/card';
import { Badge } from '../../shared/ui/badge';
import { Button } from '../../shared/ui/button';

export function ContactRequests() {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    const [requests, setRequests] = useState<Array<{
        id: number;
        name: string;
        contact_info: string;
        message: string;
        created_at: string;
        status: string;
    }>>([]);
    const [loading, setLoading] = useState(false);

    const loadRequests = async () => {
        const token = localStorage.getItem('gg_token');
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/admin/contact`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to load contact requests');
            const data = await res.json();
            setRequests(data.items || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const markResolved = async (id: number) => {
        const token = localStorage.getItem('gg_token');
        if (!token) return;
        const res = await fetch(`${apiBase}/admin/contact/${id}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'resolved' }),
        });
        if (res.ok) {
            await loadRequests();
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
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl mb-2" style={{ color: '#263238' }}>Contact Requests</h1>
                    <p className="text-gray-600">Messages submitted from the website Contact Us page</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2">
                        <Clock className="w-4 h-4" />
                        Pending ({requests.filter(req => req.status === 'pending').length})
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {loading && (
                    <Card className="p-6 text-gray-600">Loading contact requests...</Card>
                )}
                {requests.map((req) => (
                    <Card key={req.id} className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-medium text-lg">{req.name}</h3>
                                        {getStatusBadge(req.status)}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                        <span className="font-medium text-blue-600">{req.contact_info}</span>
                                        <span>•</span>
                                        <span>{req.created_at}</span>
                                        <span>•</span>
                                        <span className="text-gray-500">ID: CR{String(req.id).padStart(4, '0')}</span>
                                    </div>
                                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">{req.message}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 ml-14 mt-4">
                            <Button size="sm" variant="outline" className="gap-2">
                                Reply via Email
                            </Button>
                            {req.status !== 'resolved' && (
                                <Button
                                    size="sm"
                                    className="gap-2"
                                    style={{ backgroundColor: '#2E7D32' }}
                                    onClick={() => markResolved(req.id)}
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Mark as Resolved
                                </Button>
                            )}
                        </div>
                    </Card>
                ))}
                {!loading && requests.length === 0 && (
                    <Card className="p-8 text-center text-gray-500">
                        No contact requests found.
                    </Card>
                )}
            </div>
        </div>
    );
}
