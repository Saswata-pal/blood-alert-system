'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Hospital, Users, Bell, MapPin, Clock, Zap, Shield } from 'lucide-react';

export default function HomePage() {
  const [activeAlerts, setActiveAlerts] = useState(12);
  const [donorsActive, setDonorsActive] = useState(2847);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAlerts(prev => Math.max(8, prev + Math.floor(Math.random() * 3) - 1));
      setDonorsActive(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-red-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-red-100 rounded-full">
                <Heart className="h-12 w-12 text-red-600 fill-current" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Real-Time Blood
              <span className="text-red-600"> Alert System</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connecting hospitals, donors, and emergency responders in critical moments. 
              Save lives through intelligent blood shortage alerts and rapid donor mobilization.
            </p>
            
            {/* Live Stats */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
              <div className="flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full">
                <Bell className="h-5 w-5 text-red-600" />
                <span className="text-red-800 font-semibold">{activeAlerts} Active Alerts</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-blue-800 font-semibold">{donorsActive.toLocaleString()} Active Donors</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
                <Link href="/emergency">
                  <Zap className="mr-2 h-5 w-5" />
                  Emergency Request
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth">
                  <Users className="mr-2 h-5 w-5" />
                  Join as Donor
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How Our System Saves Lives
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our comprehensive platform enables multiple communication pathways and intelligent matching 
            to ensure blood reaches those who need it most.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-3 bg-red-100 rounded-full w-fit mb-4">
                <Hospital className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl">Hospital Network</CardTitle>
              <CardDescription>
                Instant alerts to registered hospitals and blood banks in your region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Real-time inventory sharing
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Emergency backup requests
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Cross-hospital coordination
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-3 bg-blue-100 rounded-full w-fit mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Donor Mobilization</CardTitle>
              <CardDescription>
                Smart matching and notification of eligible donors based on location and availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Location-based matching
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Multi-channel notifications
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Family contact backup
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-2 lg:col-span-1">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-3 bg-green-100 rounded-full w-fit mb-4">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Emergency Response</CardTitle>
              <CardDescription>
                Rapid response system for critical situations and trauma cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Priority routing system
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Real-time tracking
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  24/7 monitoring
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Alert Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <div className="animate-pulse">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">URGENT: B- Blood Needed</h3>
                <p className="text-red-100">City General Hospital - 3 units required</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-white text-red-700">
                <Clock className="mr-1 h-3 w-3" />
                23 min ago
              </Badge>
              <Button variant="secondary" size="sm">
                Respond Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="text-center">
              <Hospital className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-blue-900">Hospital Portal</CardTitle>
              <CardDescription>
                Manage blood requests, inventory, and donor coordination
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/hospital/dashboard">Access Portal</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
            <CardHeader className="text-center">
              <Heart className="h-12 w-12 text-red-600 mx-auto mb-4 fill-current" />
              <CardTitle className="text-red-900">Donor Hub</CardTitle>
              <CardDescription>
                Register, track donations, and receive emergency alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                <Link href="/donor/dashboard">Donor Portal</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-green-900">Admin Center</CardTitle>
              <CardDescription>
                System monitoring, analytics, and network management
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href="/admin/dashboard">Admin Access</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}