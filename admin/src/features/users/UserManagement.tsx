import { useEffect, useState } from 'react';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { Card } from '../../shared/ui/card';
import { Button } from '../../shared/ui/button';
import { Badge } from '../../shared/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../shared/ui/dialog';
import { toast } from 'sonner';
import { Input } from '../../shared/ui/input';
import { Label } from '../../shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../shared/ui/select';

export function UserManagement() {
  const [filter, setFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUserRole, setNewUserRole] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [users, setUsers] = useState<Array<{
    id: number;
    name: string;
    role: string;
    region?: string | null;
    joinDate?: string;
    email?: string;
    phone?: string;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    region: '',
    officerId: '',
    farmSize: '',
    cropType: '',
    password: '',
  });

  const token = localStorage.getItem('gg_token');

  const loadUsers = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams();
      if (filter !== 'all') query.set('role', filter);
      if (search) query.set('q', search);
      query.set('page', String(page));
      query.set('limit', String(pageSize));
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/users?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load users');
      const data = await res.json();
      setTotal(data.total || 0);
      const mapped = (data.items || []).map((u: any) => ({
        id: u.id,
        name: u.full_name || u.email,
        role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
        region: u.region,
        joinDate: '',
        email: u.email,
        phone: u.phone,
      }));
      setUsers(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [filter, search, page, pageSize]);

  const filteredUsers = users;

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!newUserRole || !formData.email) {
      setError('Role and email are required');
      return;
    }
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone || null,
          full_name: fullName || null,
          role: newUserRole,
          region: formData.region || null,
          officer_id: formData.officerId || null,
          password: formData.password || 'ChangeMe123!',
        }),
      });
      if (!res.ok) throw new Error('Failed to create user');
      await res.json();
      setIsDialogOpen(false);
      setNewUserRole('');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        region: '',
        officerId: '',
        farmSize: '',
        cropType: '',
        password: '',
      });
      loadUsers();
      toast.success('User created successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      toast.error('Failed to create user');
    }
  };

  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  const handleDeleteUser = async () => {
    if (!token || deleteUserId == null) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/users/${deleteUserId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete user');
      setDeleteUserId(null);
      loadUsers();
      toast.success('User deleted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      toast.error('Failed to delete user');
    }
  };

  const [editUser, setEditUser] = useState<{
    id: number;
    full_name?: string;
    email?: string;
    phone?: string;
    role?: string;
    region?: string | null;
    officer_id?: string | null;
  } | null>(null);

  const handleOpenEdit = (user: any) => {
    setEditUser({
      id: user.id,
      full_name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role.toLowerCase(),
      region: user.region,
      officer_id: '',
    });
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editUser) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/users/${editUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          full_name: editUser.full_name || null,
          email: editUser.email,
          phone: editUser.phone || null,
          role: editUser.role,
          region: editUser.region || null,
          officer_id: editUser.officer_id || null,
        }),
      });
      if (!res.ok) throw new Error('Failed to update user');
      setEditUser(null);
      loadUsers();
      toast.success('User updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      toast.error('Failed to update user');
    }
  };

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
            <form className="space-y-4 mt-4" onSubmit={handleCreateUser}>
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
                  <Input
                    id="firstName"
                    placeholder="e.g., Amal"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="e.g., Perera"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+94 71 234 5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Region */}
              <div className="space-y-2">
                <Label htmlFor="region">Region/District *</Label>
                <Select
                  value={formData.region}
                  onValueChange={(value) => setFormData({ ...formData, region: value })}
                >
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
                  <Input
                    id="officerId"
                    placeholder="e.g., AGO-2026-001"
                    value={formData.officerId}
                    onChange={(e) => setFormData({ ...formData, officerId: e.target.value })}
                  />
                </div>
              )}

              {newUserRole === 'farmer' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmSize">Farm Size (acres)</Label>
                  <Input
                    id="farmSize"
                    type="number"
                    placeholder="e.g., 5"
                    value={formData.farmSize}
                    onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cropType">Primary Crop Type</Label>
                  <Select
                    value={formData.cropType}
                    onValueChange={(value) => setFormData({ ...formData, cropType: value })}
                  >
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

              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Set a temporary password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setNewUserRole('');
                    setFormData({
                      firstName: '',
                      lastName: '',
                      email: '',
                      phone: '',
                      region: '',
                      officerId: '',
                      farmSize: '',
                      cropType: '',
                      password: '',
                    });
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
          <Input
            className="w-64 ml-4"
            placeholder="Search name, email, phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
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
                  <td className="px-6 py-4 text-sm text-gray-900">U{String(user.id).padStart(3, '0')}</td>
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
                  <td className="px-6 py-4 text-sm text-gray-600">{user.joinDate || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        title="Edit"
                        onClick={() => handleOpenEdit(user)}
                      >
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        title="Delete"
                        onClick={() => setDeleteUserId(user.id)}
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

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Page size:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPage(1);
                setPageSize(Number(v));
              }}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <button
            className="px-3 py-2 rounded border"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button
            className="px-3 py-2 rounded border"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </Card>

      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details</DialogDescription>
          </DialogHeader>
          {editUser && (
            <form className="space-y-4 mt-4" onSubmit={handleUpdateUser}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editName">Full Name</Label>
                  <Input
                    id="editName"
                    value={editUser.full_name || ''}
                    onChange={(e) => setEditUser({ ...editUser, full_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEmail">Email</Label>
                  <Input
                    id="editEmail"
                    value={editUser.email || ''}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editPhone">Phone</Label>
                  <Input
                    id="editPhone"
                    value={editUser.phone || ''}
                    onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editRole">Role</Label>
                  <Select
                    value={editUser.role || ''}
                    onValueChange={(value) => setEditUser({ ...editUser, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="officer">Agricultural Officer</SelectItem>
                      <SelectItem value="farmer">Farmer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRegion">Region/District</Label>
                <Input
                  id="editRegion"
                  value={editUser.region || ''}
                  onChange={(e) => setEditUser({ ...editUser, region: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditUser(null)}>
                  Cancel
                </Button>
                <Button type="submit" style={{ backgroundColor: '#2E7D32' }}>
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteUserId !== null} onOpenChange={(open) => !open && setDeleteUserId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteUserId(null)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {loading && <div className="text-sm text-gray-600">Loading users...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}
