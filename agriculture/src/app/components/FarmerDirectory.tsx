import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, MapPin, Calendar, AlertTriangle, CheckCircle, AlertCircle, Phone, Mail, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface FarmerDirectoryProps {
  officerData: {
    region: string;
  };
}

interface FarmerSummary {
  id: number;
  full_name?: string | null;
  email: string;
  phone?: string | null;
  region?: string | null;
  total_scans: number;
  pending_consultations: number;
  last_scan_at?: string | null;
}

export default function FarmerDirectory({ officerData }: FarmerDirectoryProps) {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [farmers, setFarmers] = useState<FarmerSummary[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFarmers = async (query?: string) => {
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    setLoading(true);
    try {
      const qs = query ? `?q=${encodeURIComponent(query)}` : '';
      const res = await fetch(`${apiBase}/officer/farmers${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load farmers');
      const data = await res.json();
      setFarmers(data.items || []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load farmers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarmers();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      loadFarmers(searchTerm.trim() || undefined);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const getRiskLevel = (farmer: FarmerSummary) => {
    if (farmer.pending_consultations >= 2 || farmer.total_scans >= 5) return 'high';
    if (farmer.pending_consultations >= 1 || farmer.total_scans >= 2) return 'medium';
    return 'low';
  };

  const filteredFarmers = useMemo(() => {
    return farmers.filter((farmer) => {
      const name = farmer.full_name || 'Farmer';
      const region = farmer.region || '';
      const email = farmer.email || '';
      const phone = farmer.phone || '';
      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.toLowerCase().includes(searchTerm.toLowerCase());
      const riskLevel = getRiskLevel(farmer);
      const matchesRisk = filterRisk === 'all' || riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
    });
  }, [farmers, searchTerm, filterRisk]);

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'high':
        return { color: 'bg-red-500', icon: AlertTriangle, label: 'High Risk' };
      case 'medium':
        return { color: 'bg-orange-500', icon: AlertCircle, label: 'Medium Risk' };
      case 'low':
        return { color: 'bg-[#4CAF50]', icon: CheckCircle, label: 'Low Risk' };
      default:
        return { color: 'bg-gray-500', icon: AlertCircle, label: 'Unknown' };
    }
  };

  const stats = useMemo(() => {
    const total = farmers.length;
    const highRisk = farmers.filter((f) => getRiskLevel(f) === 'high').length;
    const mediumRisk = farmers.filter((f) => getRiskLevel(f) === 'medium').length;
    const lowRisk = farmers.filter((f) => getRiskLevel(f) === 'low').length;
    return { total, highRisk, mediumRisk, lowRisk };
  }, [farmers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Farmer Directory</h1>
        <p className="text-[#455A64]">{officerData.region} - {stats.total} Registered Farmers</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl">{stats.total}</p>
            <p className="text-sm text-[#455A64] mt-1">Total Farmers</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-2xl text-red-600">{stats.highRisk}</p>
            <p className="text-sm text-red-700 mt-1">High Risk</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <p className="text-2xl text-orange-600">{stats.mediumRisk}</p>
            <p className="text-sm text-orange-700 mt-1">Medium Risk</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <p className="text-2xl text-green-600">{stats.lowRisk}</p>
            <p className="text-sm text-green-700 mt-1">Low Risk</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search Farmers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterRisk === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterRisk('all')}
                className={filterRisk === 'all' ? 'bg-[#1976D2]' : ''}
              >
                All
              </Button>
              <Button
                variant={filterRisk === 'high' ? 'default' : 'outline'}
                onClick={() => setFilterRisk('high')}
                className={filterRisk === 'high' ? 'bg-red-500 hover:bg-red-600' : ''}
              >
                High Risk
              </Button>
              <Button
                variant={filterRisk === 'medium' ? 'default' : 'outline'}
                onClick={() => setFilterRisk('medium')}
                className={filterRisk === 'medium' ? 'bg-orange-500 hover:bg-orange-600' : ''}
              >
                Medium
              </Button>
              <Button
                variant={filterRisk === 'low' ? 'default' : 'outline'}
                onClick={() => setFilterRisk('low')}
                className={filterRisk === 'low' ? 'bg-[#4CAF50] hover:bg-[#45a049]' : ''}
              >
                Low Risk
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Farmers Table - Desktop */}
      <Card className="hidden lg:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Farmer Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Consultations</TableHead>
                <TableHead>Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFarmers.map((farmer) => {
                const riskLevel = getRiskLevel(farmer);
                const risk = getRiskBadge(riskLevel);
                const RiskIcon = risk.icon;
                return (
                  <TableRow key={farmer.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p>{farmer.full_name || 'Farmer'}</p>
                        <p className="text-xs text-[#455A64]">ID: F{farmer.id.toString().padStart(4, '0')}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-[#455A64]" />
                        <span className="text-sm">{farmer.region || 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="size-3 text-[#455A64]" />
                          {farmer.phone || '—'}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="size-3 text-[#455A64]" />
                          {farmer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">Scans: {farmer.total_scans}</p>
                        <p className="text-xs text-[#455A64]">
                          Last scan: {farmer.last_scan_at || 'Never'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-[#455A64]" />
                        <span className="text-sm">{farmer.pending_consultations} pending</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={risk.color}>
                        <RiskIcon className="size-3 mr-1" />
                        {risk.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Farmers Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {filteredFarmers.map((farmer) => {
          const riskLevel = getRiskLevel(farmer);
          const risk = getRiskBadge(riskLevel);
          const RiskIcon = risk.icon;
          return (
            <Card key={farmer.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3>{farmer.full_name || 'Farmer'}</h3>
                    <p className="text-xs text-[#455A64]">ID: F{farmer.id.toString().padStart(4, '0')}</p>
                  </div>
                  <Badge className={risk.color}>
                    <RiskIcon className="size-3 mr-1" />
                    {risk.label}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-[#455A64]" />
                    <span>{farmer.region || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-[#455A64]" />
                    <span>{farmer.phone || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-[#455A64]" />
                    <span>Last scan: {farmer.last_scan_at || 'Never'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div>
                    <p className="text-sm">Scans: {farmer.total_scans}</p>
                  </div>
                  <Badge variant="outline" className={farmer.pending_consultations > 0 ? 'border-red-500 text-red-600' : ''}>
                    {farmer.pending_consultations} pending
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!loading && filteredFarmers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-[#455A64]">
            No farmers found matching your search criteria.
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card>
          <CardContent className="py-12 text-center text-[#455A64]">
            Loading farmers...
          </CardContent>
        </Card>
      )}
    </div>
  );
}
