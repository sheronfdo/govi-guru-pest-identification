import { useEffect, useState } from 'react';
import { Activity, Server, Database, AlertCircle } from 'lucide-react';
import { Card } from '../../shared/ui/card';

export function DashboardHome() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    total_farmers: 0,
    active_officers: 0,
    scans_today: 0,
    pending_issues: 0,
    recent_activity: [] as Array<{ user: string; action: string; time: string }>,
  });

  useEffect(() => {
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    setLoading(true);
    fetch(`${apiBase}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load dashboard');
        return res.json();
      })
      .then((payload) => setData(payload))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { title: 'Total Farmers', value: data.total_farmers.toLocaleString(), icon: '👨‍🌾', color: 'bg-blue-50' },
    { title: 'Active Agri-Officers', value: data.active_officers.toLocaleString(), icon: '👨‍💼', color: 'bg-green-50' },
    { title: "Today's Pest Scans", value: data.scans_today.toLocaleString(), icon: '🔍', color: 'bg-purple-50' },
    { title: 'Pending Issues', value: data.pending_issues.toLocaleString(), icon: '⚠️', color: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2" style={{ color: '#263238' }}>System Overview</h1>
        <p className="text-gray-600">Welcome to Govi Guru Admin Dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className={`p-6 ${stat.color} border-0`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
            <p className="text-3xl">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Main Section - Split View */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Activity Log */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5" style={{ color: '#2E7D32' }} />
            <h2 className="text-xl">Recent Activity Log</h2>
          </div>
          <div className="space-y-3">
            {loading && <p className="text-sm text-gray-600">Loading activity...</p>}
            {!loading && data.recent_activity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs">👤</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{' '}
                    <span className="text-gray-600">{activity.action}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Health */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5" style={{ color: '#2E7D32' }} />
            <h2 className="text-xl">System Health</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5" style={{ color: '#2E7D32' }} />
                <div>
                  <p className="font-medium">Server Status</p>
                  <p className="text-sm text-gray-600">All systems operational</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium" style={{ color: '#2E7D32' }}>Online</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5" style={{ color: '#2E7D32' }} />
                <div>
                  <p className="font-medium">Database</p>
                  <p className="text-sm text-gray-600">Connection stable</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium" style={{ color: '#2E7D32' }}>Connected</span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">API Response Time</p>
                <span className="text-sm font-medium text-blue-700">125ms</span>
              </div>
              <div className="w-full bg-white rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Storage Usage</p>
                <span className="text-sm font-medium text-purple-700">67%</span>
              </div>
              <div className="w-full bg-white rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
