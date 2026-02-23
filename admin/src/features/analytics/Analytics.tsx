import { useEffect, useState } from 'react';
import { Download, TrendingUp } from 'lucide-react';
import { Card } from '../../shared/ui/card';
import { Button } from '../../shared/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function Analytics() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    pest_counts: [] as Array<{ name: string; count: number }>,
    registration_trend: [] as Array<{ month: string; users: number }>,
    regions: [] as Array<{ name: string; intensity: string; count: number }>,
    total_scans_this_month: 0,
    avg_response_hours: 0,
    ai_accuracy_rate: 0,
  });


  useEffect(() => {
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    setLoading(true);
    fetch(`${apiBase}/admin/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load analytics');
        return res.json();
      })
      .then((payload) => setData(payload))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2" style={{ color: '#263238' }}>Analytics & Reports</h1>
          <p className="text-gray-600">Comprehensive insights and data visualization</p>
        </div>
        <Button className="gap-2" style={{ backgroundColor: '#2E7D32' }}>
          <Download className="w-4 h-4" />
          Download PDF Report
        </Button>
      </div>

      {/* Map Widget */}
      <Card className="p-6">
        <h2 className="text-xl mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" style={{ color: '#2E7D32' }} />
          Pest Density Heat Map - Sri Lanka
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Map Visualization */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8 flex items-center justify-center relative">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="font-medium text-gray-700">Sri Lanka Pest Distribution Map</p>
              <p className="text-sm text-gray-600 mt-2">Interactive heat map visualization</p>
            </div>
            
            {/* Heat Points Overlay */}
            <div className="absolute top-8 left-1/4 w-4 h-4 rounded-full bg-red-500 opacity-60 animate-pulse"></div>
            <div className="absolute top-16 left-1/3 w-3 h-3 rounded-full bg-red-500 opacity-60 animate-pulse"></div>
            <div className="absolute top-24 right-1/3 w-5 h-5 rounded-full bg-orange-500 opacity-60 animate-pulse"></div>
            <div className="absolute bottom-16 left-1/2 w-3 h-3 rounded-full bg-yellow-500 opacity-60 animate-pulse"></div>
          </div>

          {/* Regional Stats */}
          <div className="space-y-3">
            <h3 className="font-medium mb-4">Regional Pest Activity</h3>
            {loading && (
              <p className="text-sm text-gray-600">Loading regional activity...</p>
            )}
            {!loading && data.regions.map((region, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      region.intensity === 'high'
                        ? 'bg-red-500'
                        : region.intensity === 'medium'
                        ? 'bg-orange-500'
                        : 'bg-yellow-500'
                    }`}
                  ></div>
                  <span className="font-medium">{region.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{region.count} reports</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      region.intensity === 'high'
                        ? 'bg-red-100 text-red-700'
                        : region.intensity === 'medium'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {region.intensity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="p-6">
          <h2 className="text-xl mb-4">Most Common Pests Detected this Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.pest_counts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2E7D32" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Line Chart */}
        <Card className="p-6">
          <h2 className="text-xl mb-4">User Registrations Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.registration_trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#2E7D32"
                strokeWidth={2}
                dot={{ fill: '#2E7D32', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-2">Total Scans This Month</div>
          <div className="text-3xl font-medium mb-2">{data.total_scans_this_month}</div>
          <div className="text-sm text-green-600 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            +23% from last month
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-2">Average Response Time</div>
          <div className="text-3xl font-medium mb-2">{data.avg_response_hours}h</div>
          <div className="text-sm text-green-600 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            12% improvement
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-2">AI Accuracy Rate</div>
          <div className="text-3xl font-medium mb-2">{data.ai_accuracy_rate}%</div>
          <div className="text-sm text-green-600 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            +2.1% accuracy
          </div>
        </Card>
      </div>
    </div>
  );
}
