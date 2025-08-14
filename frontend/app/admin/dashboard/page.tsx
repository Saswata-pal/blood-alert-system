'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  TrendingUp, 
  Users, 
  Hospital, 
  Bell, 
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Settings,
  Search,
  Filter
} from 'lucide-react';

interface SystemMetrics {
  totalDonors: number;
  activeHospitals: number;
  alertsToday: number;
  successfulMatches: number;
  averageResponseTime: string;
  systemUptime: string;
}

interface NetworkActivity {
  id: string;
  type: 'alert' | 'match' | 'donation' | 'registration';
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
  location: string;
}

export default function AdminDashboard() {
  const [systemMetrics] = useState<SystemMetrics>({
    totalDonors: 12847,
    activeHospitals: 89,
    alertsToday: 34,
    successfulMatches: 28,
    averageResponseTime: '8.5 min',
    systemUptime: '99.97%'
  });

  const [networkActivity] = useState<NetworkActivity[]>([
    {
      id: '1',
      type: 'alert',
      description: 'Critical B- blood alert sent to 145 donors',
      timestamp: '2024-01-20T10:30:00Z',
      status: 'success',
      location: 'City General Hospital'
    },
    {
      id: '2',
      type: 'match',
      description: 'Donor matched for emergency O+ request',
      timestamp: '2024-01-20T10:25:00Z',
      status: 'success',
      location: 'Metro Medical Center'
    },
    {
      id: '3',
      type: 'donation',
      description: 'Blood donation completed successfully',
      timestamp: '2024-01-20T10:15:00Z',
      status: 'success',
      location: 'Regional Blood Bank'
    },
    {
      id: '4',
      type: 'registration',
      description: 'New hospital registered in network',
      timestamp: '2024-01-20T09:45:00Z',
      status: 'pending',
      location: 'Suburban Medical Center'
    }
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'alert': return <Bell className="h-4 w-4 text-red-600" />;
      case 'match': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'donation': return <Users className="h-4 w-4 text-blue-600" />;
      case 'registration': return <Hospital className="h-4 w-4 text-purple-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>;
      case 'pending': return <Badge variant="secondary">Pending</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">System monitoring and network management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <BarChart3 className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Donors</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {systemMetrics.totalDonors.toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Hospitals</p>
                  <p className="text-2xl font-bold text-green-600">
                    {systemMetrics.activeHospitals}
                  </p>
                </div>
                <Hospital className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Alerts Today</p>
                  <p className="text-2xl font-bold text-red-600">
                    {systemMetrics.alertsToday}
                  </p>
                </div>
                <Bell className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Matches Today</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {systemMetrics.successfulMatches}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Response</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {systemMetrics.averageResponseTime}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Uptime</p>
                  <p className="text-2xl font-bold text-green-600">
                    {systemMetrics.systemUptime}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="activity">Network Activity</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="alerts">Alert Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Real-Time Network Activity</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search activity..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {networkActivity.map((activity) => (
                <Card key={activity.id} className="border-l-4 border-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {activity.description}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(activity.timestamp).toLocaleTimeString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {activity.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(activity.status)}
                        <Badge variant="outline" className="capitalize">
                          {activity.type}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Response Time Analytics</CardTitle>
                  <CardDescription>
                    Average response times across different alert types
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Critical Alerts</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded">
                          <div className="w-16 h-2 bg-red-600 rounded"></div>
                        </div>
                        <span className="text-sm font-medium">6.2 min</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">High Priority</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded">
                          <div className="w-20 h-2 bg-orange-600 rounded"></div>
                        </div>
                        <span className="text-sm font-medium">8.7 min</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Medium Priority</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded">
                          <div className="w-18 h-2 bg-yellow-600 rounded"></div>
                        </div>
                        <span className="text-sm font-medium">12.4 min</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Success Rate</CardTitle>
                  <CardDescription>
                    Blood request fulfillment rates by blood type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['O-', 'B-', 'AB-', 'A-', 'O+', 'B+', 'A+', 'AB+'].map((bloodType, index) => (
                      <div key={bloodType} className="flex items-center justify-between">
                        <span className="text-sm">{bloodType}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded">
                            <div 
                              className="h-2 bg-green-600 rounded" 
                              style={{ width: `${85 + index * 2}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{85 + index * 2}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Alert Management</h2>
              <Button className="bg-red-600 hover:bg-red-700">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Test Emergency Alert
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Alert Configuration</CardTitle>
                  <CardDescription>
                    System-wide alert settings and thresholds
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Critical Alert Threshold</span>
                    <Badge variant="destructive">≤ 5 units</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-escalation Time</span>
                    <Badge variant="secondary">15 minutes</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Max Donor Notifications</span>
                    <Badge variant="outline">200 per alert</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backup Hospital Range</span>
                    <Badge variant="outline">50 km radius</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Alert Performance</CardTitle>
                  <CardDescription>
                    Performance metrics for recent alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">B- Critical Alert</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Resolved
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      145 donors notified • 12 responses • 6.5 min average
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">O+ High Priority</span>
                      <Badge variant="secondary">In Progress</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      89 donors notified • 18 responses • 4.2 min average
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search users..." className="pl-10 w-64" />
                </div>
                <Button variant="outline">Export Users</Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Donors</CardTitle>
                  <CardDescription>Registered and available donors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {systemMetrics.totalDonors.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    +127 new registrations this week
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hospital Partners</CardTitle>
                  <CardDescription>Connected healthcare facilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {systemMetrics.activeHospitals}
                  </div>
                  <div className="text-sm text-gray-600">
                    3 new hospitals pending verification
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Admins</CardTitle>
                  <CardDescription>Platform administrators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
                  <div className="text-sm text-gray-600">
                    All admins active this month
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">System Health</h2>
              <Badge variant="default" className="bg-green-100 text-green-800">
                All Systems Operational
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Server Status</CardTitle>
                  <CardDescription>Real-time system performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Response Time</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">127ms</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Performance</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Normal</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notification Service</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SMS Gateway</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium">Degraded</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resource Usage</CardTitle>
                  <CardDescription>Current system resource utilization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">CPU Usage</span>
                      <span className="text-sm font-medium">23%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded">
                      <div className="w-1/4 h-2 bg-blue-600 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Memory Usage</span>
                      <span className="text-sm font-medium">67%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded">
                      <div className="w-2/3 h-2 bg-green-600 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Storage Usage</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded">
                      <div className="w-1/2 h-2 bg-yellow-600 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}