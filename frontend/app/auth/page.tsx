// File: app/auth/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Hospital, Users, Shield, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { login } from '@/lib/api';

export default function AuthPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'donor' | 'hospital' | 'admin'>('donor');

  // Separate email/password per tab to keep things simple
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPassword, setDonorPassword] = useState('');
  const [hospitalEmail, setHospitalEmail] = useState('');
  const [hospitalPassword, setHospitalPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleSignIn = async (e: React.FormEvent, expectedRole: 'donor' | 'hospital' | 'admin') => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Pick credentials based on tab
      const creds =
        expectedRole === 'donor'
          ? { email: donorEmail, password: donorPassword }
          : expectedRole === 'hospital'
          ? { email: hospitalEmail, password: hospitalPassword }
          : { email: adminEmail, password: adminPassword };

      const data = await login(creds);

      // ✅ Save session
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user_info', JSON.stringify(data.user_info));

      const actualRole = data.user_info.role;

      // Warn if the user logged in under a different role than the selected tab
      if (actualRole !== expectedRole) {
        toast.warning(`You're logged in as ${actualRole}, not ${expectedRole}. Redirecting…`);
      } else {
        toast.success(`Welcome back, ${data.user_info.name}!`);
      }

      // Redirect by role
      switch (actualRole) {
        case 'donor':
          router.push('/donor/dashboard');
          break;
        case 'hospital':
          router.push('/hospital/dashboard');
          break;
        case 'admin':
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/');
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getRegisterLink = () => {
    switch (activeTab) {
      case 'donor':
        return '/donor/register';
      case 'hospital':
        return '/hospital/register';
      case 'admin':
        return '/support/contact'; // we’ll add this later as your Contact Support page
      default:
        return '/auth/register';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Heart className="h-8 w-8 text-red-600 fill-current" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to BloodAlert</h1>
          <p className="text-gray-600">Sign in to access your dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Choose your account type to continue</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs
              defaultValue="donor"
              className="space-y-4"
              onValueChange={(val) => setActiveTab(val as 'donor' | 'hospital' | 'admin')}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="donor" className="text-xs">Donor</TabsTrigger>
                <TabsTrigger value="hospital" className="text-xs">Hospital</TabsTrigger>
                <TabsTrigger value="admin" className="text-xs">Admin</TabsTrigger>
              </TabsList>

              {/* Donor */}
              <TabsContent value="donor" className="space-y-4">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Donor Portal</span>
                  </div>
                </div>
                <form onSubmit={(e) => handleSignIn(e, 'donor')} className="space-y-4">
                  <div>
                    <Label htmlFor="donor-email">Email</Label>
                    <Input
                      id="donor-email"
                      type="email"
                      placeholder="donor@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="donor-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="donor-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={donorPassword}
                        onChange={(e) => setDonorPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In as Donor'}
                  </Button>
                </form>
              </TabsContent>

              {/* Hospital */}
              <TabsContent value="hospital" className="space-y-4">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 p-2 bg-green-100 rounded-lg">
                    <Hospital className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Hospital Portal</span>
                  </div>
                </div>
                <form onSubmit={(e) => handleSignIn(e, 'hospital')} className="space-y-4">
                  <div>
                    <Label htmlFor="hospital-email">Hospital Email</Label>
                    <Input
                      id="hospital-email"
                      type="email"
                      placeholder="bloodbank@hospital.com"
                      value={hospitalEmail}
                      onChange={(e) => setHospitalEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="hospital-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="hospital-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={hospitalPassword}
                        onChange={(e) => setHospitalPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In as Hospital'}
                  </Button>
                </form>
              </TabsContent>

              {/* Admin */}
              <TabsContent value="admin" className="space-y-4">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 p-2 bg-purple-100 rounded-lg">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Admin Portal</span>
                  </div>
                </div>
                <form onSubmit={(e) => handleSignIn(e, 'admin')} className="space-y-4">
                  <div>
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@bloodalert.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="admin-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In as Admin'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Dynamic Register Link */}
            <div className="mt-6 text-center text-sm">
              {activeTab === "admin" ? (
                <>
                  <span className="text-gray-600">Need an admin account? </span>
                  <Link href="/contact-support" className="text-red-600 hover:underline">
                    Contact support
                  </Link>
                </>
              ) : (
                <>
                  <span className="text-gray-600">Don't have an account? </span>
                  <Link href={getRegisterLink()} className="text-red-600 hover:underline">
                    Register here
                  </Link>
                </>
              )}
            </div>

            <div className="mt-4 text-center">
              <Link href="/auth/forgot" className="text-sm text-gray-600 hover:underline">
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">Demo Credentials</CardTitle>
          </CardHeader>
        <CardContent className="text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-blue-600">Donor:</span>
              <span>donor@demo.com / demo123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">Hospital:</span>
              <span>hospital@demo.com / demo123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-600">Admin:</span>
              <span>admin@demo.com / demo123</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
