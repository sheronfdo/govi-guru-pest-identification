import { useState } from 'react';
import { Sprout } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!phoneNumber || !password) {
      setError('Please enter phone and password to register');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/farmers/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          password,
          full_name: null,
          region: null,
        }),
      });
      if (!res.ok) throw new Error('Registration failed');
      await res.json();
      const loginRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/farmer/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: phoneNumber, password, role: 'farmer' }),
      });
      if (!loginRes.ok) throw new Error('Login failed');
      const data = await loginRes.json();
      localStorage.setItem('gg_token', data.access_token);
      onLogin('Farmer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/farmer/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: phoneNumber, password, role: 'farmer' }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      localStorage.setItem('gg_token', data.access_token);
      onLogin('Farmer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: '#FAFAFA' }}>
      {/* Logo */}
      <div className="flex flex-col items-center mb-12">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#4CAF50' }}>
          <Sprout className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold" style={{ color: '#4CAF50' }}>Govi Guru</h1>
      </div>

      {/* Language Selection */}
      <div className="w-full max-w-md mb-8">
        <h2 className="text-lg font-semibold mb-4 text-center" style={{ color: '#333' }}>Select Language / භාෂාව තෝරන්න</h2>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSelectedLanguage('sinhala')}
            className="w-full py-4 px-6 rounded-lg text-lg font-semibold transition-all"
            style={{
              backgroundColor: selectedLanguage === 'sinhala' ? '#4CAF50' : 'white',
              color: selectedLanguage === 'sinhala' ? 'white' : '#333',
              border: `2px solid ${selectedLanguage === 'sinhala' ? '#4CAF50' : '#ddd'}`
            }}
          >
            සිංහල
          </button>
          <button
            onClick={() => setSelectedLanguage('tamil')}
            className="w-full py-4 px-6 rounded-lg text-lg font-semibold transition-all"
            style={{
              backgroundColor: selectedLanguage === 'tamil' ? '#4CAF50' : 'white',
              color: selectedLanguage === 'tamil' ? 'white' : '#333',
              border: `2px solid ${selectedLanguage === 'tamil' ? '#4CAF50' : '#ddd'}`
            }}
          >
            தமிழ்
          </button>
          <button
            onClick={() => setSelectedLanguage('english')}
            className="w-full py-4 px-6 rounded-lg text-lg font-semibold transition-all"
            style={{
              backgroundColor: selectedLanguage === 'english' ? '#4CAF50' : 'white',
              color: selectedLanguage === 'english' ? 'white' : '#333',
              border: `2px solid ${selectedLanguage === 'english' ? '#4CAF50' : '#ddd'}`
            }}
          >
            English
          </button>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block text-base font-semibold mb-2" style={{ color: '#333' }}>
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+94 71 234 5678"
            className="w-full py-4 px-4 rounded-lg border-2 text-lg"
            style={{ borderColor: '#ddd', backgroundColor: 'white' }}
          />
        </div>

        <div className="mb-6">
          <label className="block text-base font-semibold mb-2" style={{ color: '#333' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full py-4 px-4 rounded-lg border-2 text-lg"
            style={{ borderColor: '#ddd', backgroundColor: 'white' }}
          />
        </div>

        <button
          type="submit"
          className="w-full py-5 rounded-lg text-xl font-bold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#4CAF50' }}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {error && (
          <p className="text-center mt-4 text-base text-red-600">{error}</p>
        )}

        <p className="text-center mt-6 text-base">
          <span style={{ color: '#666' }}>New Farmer? </span>
          <button type="button" className="font-semibold" style={{ color: '#4CAF50' }} onClick={handleRegister}>
            Register Here
          </button>
        </p>
      </form>
    </div>
  );
}
