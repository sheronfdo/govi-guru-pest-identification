import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sprout, Shield, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from './ui/alert';

interface LoginProps {
  onLogin: (name: string, region: string, officerId: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const [signupForm, setSignupForm] = useState({
    fullName: '',
    officerId: '',
    email: '',
    region: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const isValidPhone = (value: string) => /^[+\d\s()-]{7,20}$/.test(value);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = loginForm.email.trim();
    if (!identifier || !loginForm.password) {
      setLoginError('Please enter your login and password');
      return;
    }
    setLoginError('');
    setLoginLoading(true);
    fetch(`${apiBase}/auth/officer/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password: loginForm.password, role: 'officer' }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Invalid credentials');
        return res.json();
      })
      .then(async (data) => {
        localStorage.setItem('gg_token', data.access_token);
        const meRes = await fetch(`${apiBase}/auth/me`, {
          headers: { Authorization: `Bearer ${data.access_token}` },
        });
        if (!meRes.ok) throw new Error('Failed to load profile');
        const me = await meRes.json();
        onLogin(me.full_name || 'Officer', me.region || 'Unknown', me.officer_id || '');
        toast.success('Successfully logged in!');
      })
      .catch((err) => {
        setLoginError(err instanceof Error ? err.message : 'Login failed');
      })
      .finally(() => setLoginLoading(false));
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = signupForm.fullName.trim();
    const officerId = signupForm.officerId.trim();
    const email = signupForm.email.trim();
    const region = signupForm.region.trim();
    const phone = signupForm.phone.trim();
    const password = signupForm.password;
    setSignupError('');
    if (!fullName || !officerId || !email || !region || !phone || !password || !signupForm.confirmPassword) {
      setSignupError('Please fill in all required fields');
      return;
    }
    if (!isValidPhone(phone)) {
      setSignupError('Please enter a valid phone number');
      return;
    }
    if (password !== signupForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (fullName && officerId && email && region) {
      setSignupLoading(true);
      fetch(`${apiBase}/auth/officers/request-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          officer_id: officerId,
          email,
          region,
          phone,
          password,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((data) => {
              throw new Error(data?.detail || 'Request failed');
            });
          }
          return res.json();
        })
        .then(() => {
          toast.success('Registration successful! You can log in now.');
          setSignupForm({
            fullName: '',
            officerId: '',
            email: '',
            region: '',
            phone: '',
            password: '',
            confirmPassword: ''
          });
          setTimeout(() => {
            setActiveTab('login');
          }, 2000);
        })
        .catch((err) => {
          const message = err instanceof Error ? err.message : 'Failed to submit request';
          setSignupError(message);
          toast.error(message);
        })
        .finally(() => setSignupLoading(false));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #1976D2 0%, #64B5F6 50%, #81C784 100%)',
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <Card className="w-full max-w-md relative shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-[#1976D2] p-4 rounded-full">
              <Sprout className="size-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl">Govi Guru</CardTitle>
          <CardDescription className="flex items-center justify-center gap-2 text-base mt-2">
            <Shield className="size-4 text-[#1976D2]" />
            Agriculture Officer Portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              {/* Demo Credentials Alert */}
              <Alert className="mb-4 bg-blue-50 border-blue-200">
                <Info className="size-4 text-[#1976D2]" />
                <AlertDescription className="text-sm">
                  <strong>Login:</strong> Use your Officer ID, phone, or email with your password
                </AlertDescription>
              </Alert>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Officer ID / Email</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Officer ID / Email / Phone"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-[#1976D2] hover:bg-[#1565C0]" disabled={loginLoading}>
                  {loginLoading ? 'Logging in...' : 'Login to Portal'}
                </Button>
              </form>
              {loginError && (
                <div className="mt-3 text-sm text-red-600 text-center">{loginError}</div>
              )}
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Dr. John Doe"
                    value={signupForm.fullName}
                    onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="officerId">Officer Registration ID</Label>
                  <Input
                    id="officerId"
                    type="text"
                    placeholder="AGO-2024-XX-XXX"
                    value={signupForm.officerId}
                    onChange={(e) => setSignupForm({ ...signupForm, officerId: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupEmail">Email</Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    placeholder="officer@example.com"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Assigned Region / Division</Label>
                  <Input
                    id="region"
                    type="text"
                    placeholder="Western Province"
                    value={signupForm.region}
                    onChange={(e) => setSignupForm({ ...signupForm, region: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+94 71 234 5678"
                    value={signupForm.phone}
                    onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-[#4CAF50] hover:bg-[#45a049]" disabled={signupLoading}>
                  {signupLoading ? 'Submitting...' : 'Request Access'}
                </Button>
                {signupError && (
                  <div className="mt-3 text-sm text-red-600 text-center">{signupError}</div>
                )}
                <p className="text-xs text-center text-muted-foreground mt-2">
                  After registration, you can log in with your Officer ID or phone
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
