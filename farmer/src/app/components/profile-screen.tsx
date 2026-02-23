import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, User, Mail, MapPin, ShieldCheck, LogOut } from 'lucide-react';

interface ProfileScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

interface ProfileData {
  id: number;
  email: string;
  full_name: string | null;
  role: string;
  region: string | null;
  officer_id: string | null;
}

export function ProfileScreen({ onBack, onLogout }: ProfileScreenProps) {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('gg_token');
    if (!token) return;
    setLoading(true);
    setError('');
    fetch(`${apiBase}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load profile');
        return res.json();
      })
      .then((data) => setProfile(data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const initials = useMemo(() => {
    const name = profile?.full_name?.trim() || 'Farmer';
    return name
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }, [profile?.full_name]);

  const displayName = profile?.full_name || 'Farmer';

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="px-4 py-4" style={{ backgroundColor: '#4CAF50' }}>
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-2 rounded-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="flex-1 text-center text-xl font-bold text-white">My Profile</h2>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-md flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white"
            style={{ backgroundColor: '#4CAF50' }}
          >
            {initials}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold" style={{ color: '#333' }}>{displayName}</h3>
            <p className="text-sm" style={{ color: '#666' }}>{profile?.email || 'Loading...'}</p>
          </div>
          <div
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}
          >
            {profile?.role ? profile.role.toUpperCase() : 'FARMER'}
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 pb-6 space-y-4">
        <h3 className="text-lg font-bold" style={{ color: '#333' }}>Account Details</h3>

        {loading && <p className="text-sm text-gray-600">Loading...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-4 shadow-md flex items-center gap-3">
              <User className="w-5 h-5" style={{ color: '#4CAF50' }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: '#999' }}>Full Name</p>
                <p className="text-sm font-semibold" style={{ color: '#333' }}>{displayName}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md flex items-center gap-3">
              <Mail className="w-5 h-5" style={{ color: '#4CAF50' }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: '#999' }}>Email</p>
                <p className="text-sm font-semibold" style={{ color: '#333' }}>{profile?.email}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md flex items-center gap-3">
              <MapPin className="w-5 h-5" style={{ color: '#4CAF50' }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: '#999' }}>Region</p>
                <p className="text-sm font-semibold" style={{ color: '#333' }}>
                  {profile?.region || 'Not specified'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md flex items-center gap-3">
              <ShieldCheck className="w-5 h-5" style={{ color: '#4CAF50' }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: '#999' }}>Role</p>
                <p className="text-sm font-semibold" style={{ color: '#333' }}>
                  {profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Farmer'}
                </p>
              </div>
            </div>

            {profile?.officer_id && (
              <div className="bg-white rounded-xl p-4 shadow-md flex items-center gap-3">
                <ShieldCheck className="w-5 h-5" style={{ color: '#4CAF50' }} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#999' }}>Officer ID</p>
                  <p className="text-sm font-semibold" style={{ color: '#333' }}>{profile.officer_id}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="pt-4">
          <button
            onClick={onLogout}
            className="w-full py-4 rounded-xl text-base font-bold text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: '#FF7043' }}
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
