'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Menu, X, Bell, Shield, Hospital, Users, LogOut, UserCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/utils';

// Helper function to get full user info from localStorage
const getUserInfo = (): { name: string; role: string } | null => {
  if (typeof window !== 'undefined') {
    const userInfo = localStorage.getItem("user_info");
    if (userInfo) {
      try {
        const parsedInfo = JSON.parse(userInfo);
        return {
          name: parsedInfo.name || 'User',
          role: parsedInfo.role || 'guest'
        };
      } catch (e) {
        console.error("Failed to parse user info from local storage", e);
        return null;
      }
    }
  }
  return null;
};

// Helper function to clear auth info
const clearAuthInfo = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("token");
    localStorage.removeItem("user_info");
  }
};

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  // Check authentication status on component mount
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsLoggedIn(true);
      const userInfo = getUserInfo();
      if (userInfo) {
        setUser(userInfo);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    clearAuthInfo();
    setIsLoggedIn(false);
    setUser(null);
    toast.success('Logged out successfully!');
    router.push('/');
  };

  const getDashboardLink = () => {
    if (user?.role === 'donor') {
      return '/donor/dashboard';
    }
    if (user?.role === 'hospital') {
      return '/hospital/dashboard';
    }
    if (user?.role === 'admin') {
      return '/admin/dashboard';
    }
    return '/';
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
              <Heart className="h-6 w-6 text-red-600 fill-current" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">BloodAlert</span>
              <div className="text-xs text-gray-500">Real-Time System</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              <Link
                href="/emergency"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
              >
                <Bell className="h-4 w-4" />
                Emergency
                <Badge variant="destructive" className="ml-1 animate-pulse">
                  LIVE
                </Badge>
              </Link>
              <Link
                href="/hospitals"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Hospital className="h-4 w-4" />
                Hospitals
              </Link>
              <Link
                href="/donors"
                className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
              >
                <Users className="h-4 w-4" />
                Donors
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            </div>

            {/* Conditional Buttons based on login status */}
            {!isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Button variant="ghost" asChild>
                  <Link href="/auth">Sign In</Link>
                </Button>
                <Button asChild className="bg-red-600 hover:bg-red-700">
                  <Link href="/auth/register">Join Network</Link>
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/placeholder-user.jpg" alt="User" />
                      <AvatarFallback>
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()}>
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col gap-4">
              <Link
                href="/emergency"
                className="flex items-center gap-3 px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
                onClick={() => setIsOpen(false)}
              >
                <Bell className="h-5 w-5" />
                Emergency Alerts
                <Badge variant="destructive" className="ml-auto animate-pulse">
                  LIVE
                </Badge>
              </Link>
              <Link
                href="/hospitals"
                className="flex items-center gap-3 px-3 py-2 rounded-md text-blue-600 hover:bg-blue-50"
                onClick={() => setIsOpen(false)}
              >
                <Hospital className="h-5 w-5" />
                Hospital Network
              </Link>
              <Link
                href="/donors"
                className="flex items-center gap-3 px-3 py-2 rounded-md text-green-600 hover:bg-green-50"
                onClick={() => setIsOpen(false)}
              >
                <Users className="h-5 w-5" />
                Donor Community
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3 py-2 rounded-md text-purple-600 hover:bg-purple-50"
                onClick={() => setIsOpen(false)}
              >
                <Shield className="h-5 w-5" />
                Admin Panel
              </Link>
              <div className="pt-4 border-t border-gray-200 flex flex-col gap-3">
                {!isLoggedIn ? (
                  <>
                    <Button variant="ghost" asChild>
                      <Link href="/auth" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild className="bg-red-600 hover:bg-red-700">
                      <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                        Join Network
                      </Link>
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" onClick={handleLogout} className="text-left justify-start text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}