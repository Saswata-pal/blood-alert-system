'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, 
  MapPin, 
  Bell, 
  Calendar, 
  Users, 
  Award, 
  Clock,
  Phone,
  Mail,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface DonationHistory {
  id: string;
  date: string;
  hospital: string;
  bloodType: string;
  units: number;
  status: 'completed' | 'scheduled' | 'cancelled';
}

interface BloodRequest {
  id: string;
  hospital: string;
  bloodType: string;
  urgency: 'Critical' | 'High' | 'Medium';
  distance: string;
  timeRequested: string;
  unitsNeeded: number;
}

export default function DonorDashboard() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [donorStats] = useState({
    totalDonations: 7,
    lastDonation: '2025-06-25',
    nextEligible: '2025-07-15',
    bloodType: 'B-',
    points: 700,
    badge: 'Gold Donor'
  });

  const [donationHistory] = useState<DonationHistory[]>([
    {
      id: '1',
      date: '2025-06-25',
      hospital: 'City General Hospital',
      bloodType: 'B-',
      units: 1,
      status: 'completed'
    },
    {
      id: '2',
      date: '2025-08-28',
      hospital: 'Metro Medical Center',
      bloodType: 'B-',
      units: 1,
      status: 'scheduled'
    }
  ]);

  const [activeRequests] = useState<BloodRequest[]>([
    {
      id: '1',
      hospital: 'City General Hospital',
      bloodType: 'B-',
      urgency: 'Critical',
      distance: '2.3 km',
      timeRequested: '23 min ago',
      unitsNeeded: 3
    },
    {
      id: '2',
      hospital: 'Regional Trauma Center',
      bloodType: 'B-',
      urgency: 'High',
      distance: '6.7 km',
      timeRequested: '1 hour ago',
      unitsNeeded: 2
    }
  ]);

  const handleAvailabilityChange = (available: boolean) => {
    setIsAvailable(available);
    toast.success(
      available ? 'You are now available for donations' : 'Availability status updated',
      {
        description: available 
          ? 'You will receive emergency alerts in your area.'
          : 'You won\'t receive alerts until you turn availability back on.'
      }
    );
  };

  const handleRespondToRequest = (requestId: string, response: 'accept' | 'decline') => {
    if (response === 'accept') {
      toast.success('Response sent!', {
        description: 'The hospital has been notified. They will contact you shortly.'
      });
    } else {
      toast.info('Response recorded', {
        description: 'Thank you for your response. The system will find other donors.'
      });
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'destructive';
      case 'High': return 'default';
      default: return 'secondary';
    }
  };

  const canDonate = new Date(donorStats.nextEligible) <= new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your donation overview and active alerts.</p>
        </div>

        {/* Availability Status */}
        <div className="mb-8">
          <Card className={`border-2 ${isAvailable ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${isAvailable ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {isAvailable ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : (
                      <AlertCircle className="h-8 w-8 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {isAvailable ? 'Available for Donations' : 'Currently Unavailable'}
                    </h3>
                    <p className="text-gray-600">
                      {isAvailable 
                        ? 'You will receive emergency alerts for blood requests in your area'
                        : 'Turn on availability to receive emergency blood requests'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Label htmlFor="availability">Available</Label>
                  <Switch
                    id="availability"
                    checked={isAvailable}
                    onCheckedChange={handleAvailabilityChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Donor Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600 fill-current" />
                  Donor Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{donorStats.bloodType}</div>
                  <div className="text-sm text-gray-600">Blood Type</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{donorStats.totalDonations}</div>
                    <div className="text-blue-800">Total Donations</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-xl font-bold text-yellow-600">{donorStats.points}</div>
                    <div className="text-yellow-800">Points Earned</div>
                  </div>
                </div>

                <div className="text-center">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Award className="mr-1 h-3 w-3" />
                    {donorStats.badge}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Next Donation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Donation Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Donation</span>
                    <span className="text-sm font-medium">{donorStats.lastDonation}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Next Eligible</span>
                    <span className="text-sm font-medium">{donorStats.nextEligible}</span>
                  </div>
                  <div className="pt-3 border-t">
                    {canDonate ? (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          You're eligible to donate now!
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert className="border-orange-200 bg-orange-50">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-800">
                          Recovery period - please wait until {donorStats.nextEligible}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Update Contact Info
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="mr-2 h-4 w-4" />
                  Change Location
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="mr-2 h-4 w-4" />
                  Notification Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Active Requests & History */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Blood Requests */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Active Blood Requests</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  {activeRequests.length} Active
                </div>
              </div>

              {isAvailable ? (
                <div className="space-y-4">
                  {activeRequests.map((request) => (
                    <Card key={request.id} className="border-l-4 border-red-500">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{request.hospital}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {request.distance}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {request.timeRequested}
                              </span>
                            </div>
                          </div>
                          <Badge variant={getUrgencyColor(request.urgency)}>
                            {request.urgency}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-red-600 fill-current" />
                            <span>Blood Type: <strong>{request.bloodType}</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span>Units Needed: <strong>{request.unitsNeeded}</strong></span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button 
                            onClick={() => handleRespondToRequest(request.id, 'accept')}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            disabled={!canDonate}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            I Can Donate
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => handleRespondToRequest(request.id, 'decline')}
                            className="flex-1"
                          >
                            Not Available
                          </Button>
                          <Button variant="outline" size="icon">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Requests</h3>
                    <p className="text-gray-600 mb-4">
                      Turn on availability to receive emergency blood requests in your area.
                    </p>
                    <Button onClick={() => handleAvailabilityChange(true)}>
                      Enable Availability
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Donation History */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Donation History</h2>
              <div className="space-y-3">
                {donationHistory.map((donation) => (
                  <Card key={donation.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${
                            donation.status === 'completed' ? 'bg-green-100' :
                            donation.status === 'scheduled' ? 'bg-blue-100' : 'bg-red-100'
                          }`}>
                            <Heart className={`h-4 w-4 fill-current ${
                              donation.status === 'completed' ? 'text-green-600' :
                              donation.status === 'scheduled' ? 'text-blue-600' : 'text-red-600'
                            }`} />
                          </div>
                          <div>
                            <div className="font-medium">{donation.hospital}</div>
                            <div className="text-sm text-gray-600">
                              {donation.bloodType} • {donation.units} unit(s) • {donation.date}
                            </div>
                          </div>
                        </div>
                        <Badge variant={
                          donation.status === 'completed' ? 'default' :
                          donation.status === 'scheduled' ? 'secondary' : 'destructive'
                        }>
                          {donation.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}