import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, MapPin, Calendar, AlertTriangle, CheckCircle, AlertCircle, Phone, Mail } from 'lucide-react';

interface FarmerDirectoryProps {
  officerData: {
    region: string;
  };
}

const mockFarmers = [
  {
    id: 1,
    name: 'Sunil Perera',
    location: 'Kurunegala District',
    phone: '+94 71 234 5678',
    email: 'sunil.perera@mail.lk',
    lastActive: '2 hours ago',
    riskLevel: 'high',
    recentReports: 3,
    landSize: '2.5 acres',
    cropType: 'Rice'
  },
  {
    id: 2,
    name: 'Kamala Jayawardena',
    location: 'Anuradhapura District',
    phone: '+94 77 345 6789',
    email: 'kamala.j@mail.lk',
    lastActive: '5 hours ago',
    riskLevel: 'medium',
    recentReports: 2,
    landSize: '3.0 acres',
    cropType: 'Paddy'
  },
  {
    id: 3,
    name: 'Nimal Silva',
    location: 'Kurunegala District',
    phone: '+94 76 456 7890',
    email: 'nimal.silva@mail.lk',
    lastActive: '1 day ago',
    riskLevel: 'low',
    recentReports: 0,
    landSize: '1.8 acres',
    cropType: 'Rice'
  },
  {
    id: 4,
    name: 'Ranjan Fernando',
    location: 'Polonnaruwa District',
    phone: '+94 71 567 8901',
    email: 'ranjan.f@mail.lk',
    lastActive: '3 hours ago',
    riskLevel: 'high',
    recentReports: 4,
    landSize: '4.2 acres',
    cropType: 'Rice, Vegetables'
  },
  {
    id: 5,
    name: 'Priyanka Wijesinghe',
    location: 'Kurunegala District',
    phone: '+94 77 678 9012',
    email: 'priyanka.w@mail.lk',
    lastActive: '2 days ago',
    riskLevel: 'low',
    recentReports: 1,
    landSize: '2.0 acres',
    cropType: 'Paddy'
  },
  {
    id: 6,
    name: 'Ajith Bandara',
    location: 'Anuradhapura District',
    phone: '+94 76 789 0123',
    email: 'ajith.b@mail.lk',
    lastActive: '6 hours ago',
    riskLevel: 'medium',
    recentReports: 2,
    landSize: '3.5 acres',
    cropType: 'Rice'
  },
  {
    id: 7,
    name: 'Malini Rathnayake',
    location: 'Kurunegala District',
    phone: '+94 71 890 1234',
    email: 'malini.r@mail.lk',
    lastActive: '1 hour ago',
    riskLevel: 'high',
    recentReports: 5,
    landSize: '1.5 acres',
    cropType: 'Vegetables'
  },
  {
    id: 8,
    name: 'Chandana Wickrama',
    location: 'Polonnaruwa District',
    phone: '+94 77 901 2345',
    email: 'chandana.w@mail.lk',
    lastActive: '4 days ago',
    riskLevel: 'low',
    recentReports: 0,
    landSize: '2.8 acres',
    cropType: 'Rice'
  },
];

export default function FarmerDirectory({ officerData }: FarmerDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const filteredFarmers = mockFarmers.filter(farmer => {
    const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'all' || farmer.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

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

  const stats = {
    total: mockFarmers.length,
    highRisk: mockFarmers.filter(f => f.riskLevel === 'high').length,
    mediumRisk: mockFarmers.filter(f => f.riskLevel === 'medium').length,
    lowRisk: mockFarmers.filter(f => f.riskLevel === 'low').length,
  };

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
                <TableHead>Land & Crop</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Recent Reports</TableHead>
                <TableHead>Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFarmers.map((farmer) => {
                const risk = getRiskBadge(farmer.riskLevel);
                const RiskIcon = risk.icon;
                return (
                  <TableRow key={farmer.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p>{farmer.name}</p>
                        <p className="text-xs text-[#455A64]">ID: F{farmer.id.toString().padStart(4, '0')}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-[#455A64]" />
                        <span className="text-sm">{farmer.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="size-3 text-[#455A64]" />
                          {farmer.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="size-3 text-[#455A64]" />
                          {farmer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{farmer.landSize}</p>
                        <p className="text-xs text-[#455A64]">{farmer.cropType}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-[#455A64]" />
                        <span className="text-sm">{farmer.lastActive}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={farmer.recentReports > 2 ? 'border-red-500 text-red-600' : ''}>
                        {farmer.recentReports} reports
                      </Badge>
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
          const risk = getRiskBadge(farmer.riskLevel);
          const RiskIcon = risk.icon;
          return (
            <Card key={farmer.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3>{farmer.name}</h3>
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
                    <span>{farmer.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-[#455A64]" />
                    <span>{farmer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-[#455A64]" />
                    <span>Last active: {farmer.lastActive}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div>
                    <p className="text-sm">{farmer.landSize} • {farmer.cropType}</p>
                  </div>
                  <Badge variant="outline" className={farmer.recentReports > 2 ? 'border-red-500 text-red-600' : ''}>
                    {farmer.recentReports} reports
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredFarmers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-[#455A64]">
            No farmers found matching your search criteria.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
