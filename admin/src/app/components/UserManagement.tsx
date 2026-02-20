import { useState } from 'react';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export function UserManagement() {
  const [filter, setFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUserRole, setNewUserRole] = useState('');

  const users = [
    { id: 'U001', name: 'Amal Perera', role: 'Farmer', region: 'Anuradhapura', joinDate: '2025-01-15' },
    { id: 'U002', name: 'Nimal Silva', role: 'Officer', region: 'Colombo', joinDate: '2024-12-10' },
    { id: 'U003', name: 'Kumari Fernando', role: 'Farmer', region: 'Kandy', joinDate: '2025-02-01' },
    { id: 'U004', name: 'Sunil Jayawardena', role: 'Farmer', region: 'Galle', joinDate: '2025-01-20' },
    { id: 'U005', name: 'Kamal Bandara', role: 'Officer', region: 'Matara', joinDate: '2024-11-05' },
    { id: 'U006', name: 'Priya Dissanayake', role: 'Farmer', region: 'Kurunegala', joinDate: '2025-01-28' },
    { id: 'U007', name: 'Chaminda Perera', role: 'Officer', region: 'Jaffna', joinDate: '2024-10-15' },
    { id: 'U008', name: 'Saman Rathnayake', role: 'Farmer', region: 'Hambantota', joinDate: '2025-02-03' },
    { id: 'U009', name: 'Lasitha Mendis', role: 'Admin', region: 'Colombo', joinDate: '2024-08-01' },
    { id: 'U010', name: 'Dilani Wickramasinghe', role: 'Admin', region: 'Gampaha', joinDate: '2024-09-12' },
  ];

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    return user.role.toLowerCase() === filter;
  });

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'Admin':
        return { backgroundColor: '#FFF3E0', color: '#E65100', borderColor: '#E65100' };
      case 'Officer':
        return { backgroundColor: '#E8F5E9', color: '#2E7D32', borderColor: '#2E7D32' };
      case 'Farmer':
        return { backgroundColor: '#E3F2FD', color: '#1976D2', borderColor: '#1976D2' };
      default:
        return {};
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2" style={{ color: '#263238' }}>User Management</h1>
          <p className="text-gray-600">Manage farmers, agricultural officers, and administrators</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" style={{ backgroundColor: '#2E7D32' }}>
              <UserPlus className="w-4 h-4" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the Govi Guru system. Select the appropriate role and fill in the details.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4 mt-4">
              {/* User Role */}
              <div className="space-y-2">
                <Label htmlFor="role">User Role *</Label>
                <Select value={newUserRole} onValueChange={setNewUserRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="officer">Agricultural Officer</SelectItem>
                    <SelectItem value="farmer">Farmer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" placeholder="e.g., Amal" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" placeholder="e.g., Perera" />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" placeholder="email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" type="tel" placeholder="+94 71 234 5678" />
                </div>
              </div>

              {/* Region */}
              <div className="space-y-2">
                <Label htmlFor="region">Region/District *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="colombo">Colombo</SelectItem>
                    <SelectItem value="gampaha">Gampaha</SelectItem>
                    <SelectItem value="kalutara">Kalutara</SelectItem>
                    <SelectItem value="kandy">Kandy</SelectItem>
                    <SelectItem value="matale">Matale</SelectItem>
                    <SelectItem value="nuwara-eliya">Nuwara Eliya</SelectItem>
                    <SelectItem value="galle">Galle</SelectItem>
                    <SelectItem value="matara">Matara</SelectItem>
                    <SelectItem value="hambantota">Hambantota</SelectItem>
                    <SelectItem value="jaffna">Jaffna</SelectItem>
                    <SelectItem value="kilinochchi">Kilinochchi</SelectItem>
                    <SelectItem value="mannar">Mannar</SelectItem>
                    <SelectItem value="vavuniya">Vavuniya</SelectItem>
                    <SelectItem value="mullaitivu">Mullaitivu</SelectItem>
                    <SelectItem value="batticaloa">Batticaloa</SelectItem>
                    <SelectItem value="ampara">Ampara</SelectItem>
                    <SelectItem value="trincomalee">Trincomalee</SelectItem>
                    <SelectItem value="kurunegala">Kurunegala</SelectItem>
                    <SelectItem value="puttalam">Puttalam</SelectItem>
                    <SelectItem value="anuradhapura">Anuradhapura</SelectItem>
                    <SelectItem value="polonnaruwa">Polonnaruwa</SelectItem>
                    <SelectItem value="badulla">Badulla</SelectItem>
                    <SelectItem value="monaragala">Monaragala</SelectItem>
                    <SelectItem value="ratnapura">Ratnapura</SelectItem>
                    <SelectItem value="kegalle">Kegalle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional fields based on role */}
              {newUserRole === 'admin' && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800 mb-2 font-medium">⚠️ Administrator Privileges</p>
                  <p className="text-sm text-orange-700">
                    This user will have full system access including user management, pest database editing, and system configuration.
                  </p>
                </div>
              )}

              {newUserRole === 'officer' && (
                <div className="space-y-2">
                  <Label htmlFor="officerId">Officer ID</Label>
                  <Input id="officerId" placeholder="e.g., AGO-2026-001" />
                </div>
              )}

              {newUserRole === 'farmer' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmSize">Farm Size (acres)</Label>
                    <Input id="farmSize" type="number" placeholder="e.g., 5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cropType">Primary Crop Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="tea">Tea</SelectItem>
                        <SelectItem value="coconut">Coconut</SelectItem>
                        <SelectItem value="vegetables">Vegetables</SelectItem>
                        <SelectItem value="fruits">Fruits</SelectItem>
                        <SelectItem value="spices">Spices</SelectItem>
                        <SelectItem value="mixed">Mixed Crops</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setNewUserRole('');
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" style={{ backgroundColor: '#2E7D32' }}>
                  Create User
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Filter by Role:</label>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="officer">Officers</SelectItem>
              <SelectItem value="farmer">Farmers</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600 ml-auto">
            Showing {filteredUsers.length} of {users.length} users
          </span>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Region</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Join Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      style={getRoleBadgeStyle(user.role)}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.region}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.joinDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}