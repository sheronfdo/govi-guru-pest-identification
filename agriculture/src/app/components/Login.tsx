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
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [signupForm, setSignupForm] = useState({
    fullName: '',
    officerId: '',
    region: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) return;
    setLoginError('');
    setLoginLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/officer/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: loginForm.email, password: loginForm.password, role: 'officer' }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Invalid credentials');
        return res.json();
      })
      .then(async (data) => {
        localStorage.setItem('gg_token', data.access_token);
        const meRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
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
    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (signupForm.fullName && signupForm.officerId && signupForm.region) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/officers/request-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: signupForm.fullName,
          officer_id: signupForm.officerId,
          region: signupForm.region,
          phone: signupForm.phone,
          password: signupForm.password,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Request failed');
          return res.json();
        })
        .then(() => {
          toast.success('Access request submitted! Admin approval pending.');
          setTimeout(() => {
            const loginTab = document.querySelector('[value="login"]') as HTMLElement;
            loginTab?.click();
          }, 2000);
        })
        .catch(() => toast.error('Failed to submit request'));
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
        }}/>
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
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              {/* Demo Credentials Alert */}
              <Alert className="mb-4 bg-blue-50 border-blue-200">
                <Info className="size-4 text-[#1976D2]" />
                <AlertDescription className="text-sm">
                  <strong>Demo Login:</strong> Enter any text in both fields to access the portal
                </AlertDescription>
              </Alert>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Officer ID / Email</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Type anything (e.g., demo)"
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
                    placeholder="Type anything (e.g., demo123)"
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
                <Button type="submit" className="w-full bg-[#4CAF50] hover:bg-[#45a049]">
                  Request Access
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Your request will be reviewed by admin for approval
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
