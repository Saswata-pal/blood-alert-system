'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, Clock, MapPin, Phone, AlertTriangle, Users, Hospital, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface EmergencyAlert {
  id: string;
  hospitalName: string;
  bloodType: string;
  unitsNeeded: number;
  urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  location: string;
  timeAgo: string;
  status: 'Active' | 'Matched' | 'Closed';
  contact: string;
}

export default function EmergencyPage() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([
    {
      id: '1',
      hospitalName: 'City General Hospital',
      bloodType: 'B-',
      unitsNeeded: 3,
      urgency: 'Critical',
      location: 'Downtown, 2.3 km away',
      timeAgo: '23 min ago',
      status: 'Active',
      contact: '+1-555-0123'
    },
    {
      id: '2',
      hospitalName: 'Metro Medical Center',
      bloodType: 'O+',
      unitsNeeded: 5,
      urgency: 'High',
      location: 'Midtown, 4.1 km away',
      timeAgo: '1 hour ago',
      status: 'Active',
      contact: '+1-555-0456'
    },
    {
      id: '3',
      hospitalName: 'Regional Trauma Center',
      bloodType: 'AB-',
      unitsNeeded: 2,
      urgency: 'Critical',
      location: 'North Side, 6.7 km away',
      timeAgo: '45 min ago',
      status: 'Matched',
      contact: '+1-555-0789'
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmergencyRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Emergency alert sent to network!', {
        description: 'Nearby donors and hospitals have been notified.',
      });
    }, 2000);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(prev => prev.map(alert => ({
        ...alert,
        timeAgo: `${parseInt(alert.timeAgo) + 1} min ago`
      })));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-full animate-pulse">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Emergency Blood Alerts</h1>
              <p className="text-gray-600">Real-time emergency requests and rapid response system</p>
            </div>
          </div>
          
          <Alert className="border-red-200 bg-red-50">
            <Bell className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>LIVE ALERTS:</strong> {alerts.filter(a => a.status === 'Active').length} active blood requests in your area requiring immediate attention.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Emergency Request Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hospital className="h-5 w-5 text-red-600" />
                  Submit Emergency Request
                </CardTitle>
                <CardDescription>
                  Hospital staff can submit urgent blood requests here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmergencyRequest} className="space-y-4">
                  <div>
                    <Label htmlFor="hospital">Hospital Name</Label>
                    <Input
                      id="hospital"
                      placeholder="Enter hospital name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bloodType">Blood Type Required</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="units">Units Needed</Label>
                    <Input
                      id="units"
                      type="number"
                      min="1"
                      max="20"
                      placeholder="Number of units"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical (Life-threatening)</SelectItem>
                        <SelectItem value="high">High (Surgery scheduled)</SelectItem>
                        <SelectItem value="medium">Medium (Planned procedure)</SelectItem>
                        <SelectItem value="low">Low (Routine restocking)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="contact">Contact Number</Label>
                    <Input
                      id="contact"
                      type="tel"
                      placeholder="+1-555-0123"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Patient condition, special requirements..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending Alert...' : 'Send Emergency Alert'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Active Alerts */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Active Alerts</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live Updates
              </div>
            </div>

            <div className="space-y-4">
              {alerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-red-500 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{alert.hospitalName}</CardTitle>
                      <Badge className={getUrgencyColor(alert.urgency)}>
                        {alert.urgency}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-600 fill-current" />
                          <span className="font-medium">Blood Type: {alert.bloodType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span>Units Needed: {alert.unitsNeeded}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-gray-600">{alert.location}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-600">{alert.timeAgo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-purple-600" />
                          <a href={`tel:${alert.contact}`} className="text-sm text-purple-600 hover:underline">
                            {alert.contact}
                          </a>
                        </div>
                        <div className="flex gap-2">
                          {alert.status === 'Active' ? (
                            <>
                              <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                                I Can Donate
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                Share Alert
                              </Button>
                            </>
                          ) : (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {alert.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {alerts.filter(a => a.status === 'Active').length}
                  </div>
                  <div className="text-sm text-gray-600">Active Alerts</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {alerts.filter(a => a.urgency === 'Critical').length}
                  </div>
                  <div className="text-sm text-gray-600">Critical</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {alerts.reduce((sum, alert) => sum + alert.unitsNeeded, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Units Needed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {alerts.filter(a => a.status === 'Matched').length}
                  </div>
                  <div className="text-sm text-gray-600">Matched</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}