import { useState } from 'react';
import { Leaf, LogIn, Eye, EyeOff } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password, role: 'admin' }),
      });
      if (!res.ok) {
        throw new Error('Invalid credentials');
      }
      const data = await res.json();
      localStorage.setItem('gg_token', data.access_token);
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
            style={{ backgroundColor: '#2E7D32' }}
          >
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-medium mb-2" style={{ color: '#263238' }}>
            Govi Guru
          </h1>
          <p className="text-gray-600">Admin Dashboard Login</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email/Username */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@goviguru.lk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm cursor-pointer">
                Remember me
              </Label>
            </div>
            <button
              type="button"
              className="text-sm hover:underline"
              style={{ color: '#2E7D32' }}
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full gap-2"
            style={{ backgroundColor: '#2E7D32' }}
            disabled={loading}
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {error && (
          <div className="mt-4 text-sm text-red-600 text-center">{error}</div>
        )}

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
          <p className="text-xs text-blue-700">Email: admin@goviguru.lk</p>
          <p className="text-xs text-blue-700">Password: admin123</p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>© 2026 Govi Guru. All rights reserved.</p>
          <p className="mt-1">Smart Pest Identification System</p>
        </div>
      </Card>
    </div>
  );
}
