import { useState } from 'react';
import { Sprout } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    phone: '',
    region: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidPhone = (value: string) => /^[+\d\s()-]{7,20}$/.test(value);

  const handleRegister = async () => {
    const fullName = registerData.fullName.trim();
    const email = registerData.email.trim();
    const region = registerData.region.trim();
    const phone = registerData.phone.trim();
    const password = registerData.password;
    const confirmPassword = registerData.confirmPassword;

    if (!fullName || !email || !password || !region) {
      setError('Please fill in all required fields');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (phone && !isValidPhone(phone)) {
      setError('Please enter a valid phone number');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/auth/farmers/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone: phone || null,
          password,
          full_name: fullName,
          region,
        }),
      });
      if (!res.ok) throw new Error('Registration failed');
      await res.json();
      const loginRes = await fetch(`${apiBase}/auth/farmer/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password, role: 'farmer' }),
      });
      if (!loginRes.ok) throw new Error('Login failed');
      const data = await loginRes.json();
      localStorage.setItem('gg_token', data.access_token);
      onLogin(fullName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = loginPhone.trim();
    if (!identifier || !loginPassword) {
      setError('Please enter email/phone and password');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/auth/farmer/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password: loginPassword, role: 'farmer' }),
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

      {/* Auth Forms */}
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode('login')}
            className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{
              backgroundColor: mode === 'login' ? '#4CAF50' : 'white',
              color: mode === 'login' ? 'white' : '#333',
              border: `2px solid ${mode === 'login' ? '#4CAF50' : '#ddd'}`,
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{
              backgroundColor: mode === 'register' ? '#4CAF50' : 'white',
              color: mode === 'register' ? 'white' : '#333',
              border: `2px solid ${mode === 'register' ? '#4CAF50' : '#ddd'}`,
            }}
          >
            Register
          </button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-base font-semibold mb-2" style={{ color: '#333' }}>
                Email Address
              </label>
              <input
                type="email"
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                placeholder="farmer@example.com"
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
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
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
          </form>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-base font-semibold mb-2" style={{ color: '#333' }}>
                Full Name
              </label>
              <input
                type="text"
                value={registerData.fullName}
                onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                placeholder="e.g., Sunil Perera"
                className="w-full py-4 px-4 rounded-lg border-2 text-lg"
                style={{ borderColor: '#ddd', backgroundColor: 'white' }}
              />
            </div>

            <div className="mb-4">
              <label className="block text-base font-semibold mb-2" style={{ color: '#333' }}>
                Email Address
              </label>
              <input
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                placeholder="farmer@example.com"
                className="w-full py-4 px-4 rounded-lg border-2 text-lg"
                style={{ borderColor: '#ddd', backgroundColor: 'white' }}
              />
            </div>

            <div className="mb-4">
              <label className="block text-base font-semibold mb-2" style={{ color: '#333' }}>
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={registerData.phone}
                onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                placeholder="+94 71 234 5678"
                className="w-full py-4 px-4 rounded-lg border-2 text-lg"
                style={{ borderColor: '#ddd', backgroundColor: 'white' }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-base font-semibold mb-2" style={{ color: '#333' }}>
                District
              </label>
              <select
                value={registerData.region}
                onChange={(e) => setRegisterData({ ...registerData, region: e.target.value })}
                className="w-full py-4 px-4 rounded-lg border-2 text-lg"
                style={{ borderColor: '#ddd', backgroundColor: 'white' }}
              >
                <option value="">Select district</option>
                <option value="Colombo">Colombo</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Kalutara">Kalutara</option>
                <option value="Kandy">Kandy</option>
                <option value="Matale">Matale</option>
                <option value="Nuwara Eliya">Nuwara Eliya</option>
                <option value="Galle">Galle</option>
                <option value="Matara">Matara</option>
                <option value="Hambantota">Hambantota</option>
                <option value="Jaffna">Jaffna</option>
                <option value="Kilinochchi">Kilinochchi</option>
                <option value="Mannar">Mannar</option>
                <option value="Vavuniya">Vavuniya</option>
                <option value="Mullaitivu">Mullaitivu</option>
                <option value="Batticaloa">Batticaloa</option>
                <option value="Ampara">Ampara</option>
                <option value="Trincomalee">Trincomalee</option>
                <option value="Kurunegala">Kurunegala</option>
                <option value="Puttalam">Puttalam</option>
                <option value="Anuradhapura">Anuradhapura</option>
                <option value="Polonnaruwa">Polonnaruwa</option>
                <option value="Badulla">Badulla</option>
                <option value="Monaragala">Monaragala</option>
                <option value="Ratnapura">Ratnapura</option>
                <option value="Kegalle">Kegalle</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-base font-semibold mb-2" style={{ color: '#333' }}>
                Password
              </label>
              <input
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full py-4 px-4 rounded-lg border-2 text-lg"
                style={{ borderColor: '#ddd', backgroundColor: 'white' }}
              />
            </div>

            <div className="mb-6">
              <label className="block text-base font-semibold mb-2" style={{ color: '#333' }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full py-4 px-4 rounded-lg border-2 text-lg"
                style={{ borderColor: '#ddd', backgroundColor: 'white' }}
              />
            </div>

            <button
              type="button"
              onClick={handleRegister}
              className="w-full py-5 rounded-lg text-xl font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#4CAF50' }}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        )}

        {error && (
          <p className="text-center mt-4 text-base text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}
