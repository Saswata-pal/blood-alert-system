'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Hospital,
  Bell,
  Users,
  Heart,
  TrendingUp,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  AlertTriangle,
  Plus,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Assuming these API functions are defined in '@/lib/api'
import {
  fetchHospitalRequests,
  createBloodRequest,
  fetchHospitalStats,
  fetchBloodInventory,
  fetchDonorResponses
} from '@/lib/api';

// Assuming this utility function exists in '@/lib/utils'
import { getAuthToken } from '@/lib/utils';

// Interfaces for data structures
interface BloodRequest {
  id: string;
  bloodType: string;
  unitsRequested: number;
  urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Matched' | 'Completed' | 'Cancelled';
  requestedAt: string;
  donorResponses: number;
  hospitalResponses: number;
}

interface DonorResponse {
  id: string;
  donorName: string;
  bloodType: string;
  distance: string;
  lastDonation: string;
  phone: string;
  status: 'Available' | 'Contacted' | 'Confirmed' | 'Completed';
}

interface BloodInventory {
  bloodType: string;
  unitsAvailable: number;
  expiringIn7Days: number;
  minimumRequired: number;
  status: 'Critical' | 'Low' | 'Normal' | 'Adequate';
}

interface HospitalStats {
  totalRequests: number;
  activeRequests: number;
  completedToday: number;
  averageResponseTime: string;
}

// Sample data for showcasing the UI when API data is not available
const sampleInventory: BloodInventory[] = [
  {
    bloodType: 'O+',
    unitsAvailable: 25,
    expiringIn7Days: 2,
    minimumRequired: 20,
    status: 'Normal',
  },
  {
    bloodType: 'A-',
    unitsAvailable: 5,
    expiringIn7Days: 0,
    minimumRequired: 10,
    status: 'Low',
  },
  {
    bloodType: 'AB+',
    unitsAvailable: 1,
    expiringIn7Days: 0,
    minimumRequired: 5,
    status: 'Critical',
  },
  {
    bloodType: 'B+',
    unitsAvailable: 40,
    expiringIn7Days: 5,
    minimumRequired: 30,
    status: 'Adequate',
  },
];

const sampleDonorResponses: DonorResponse[] = [
  {
    id: 'donor_res_1',
    donorName: 'Jane Doe',
    bloodType: 'AB+',
    distance: '3.5 km',
    lastDonation: '2 months ago',
    phone: '555-1234',
    status: 'Available',
  },
  {
    id: 'donor_res_2',
    donorName: 'John Smith',
    bloodType: 'A-',
    distance: '6.1 km',
    lastDonation: '4 months ago',
    phone: '555-5678',
    status: 'Contacted',
  },
  {
    id: 'donor_res_3',
    donorName: 'Alice Johnson',
    bloodType: 'O+',
    distance: '1.2 km',
    lastDonation: '1 month ago',
    phone: '555-8765',
    status: 'Available',
  },
];


export default function HospitalDashboard() {
  const router = useRouter();

  // State to hold data from the API and user info
  const [activeRequests, setActiveRequests] = useState<BloodRequest[]>([]);
  const [donorResponses, setDonorResponses] = useState<DonorResponse[]>([]);
  const [inventory, setInventory] = useState<BloodInventory[]>([]);
  const [hospitalStats, setHospitalStats] = useState<HospitalStats>({
    totalRequests: 0,
    activeRequests: 0,
    completedToday: 0,
    averageResponseTime: 'N/A'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRequestData, setNewRequestData] = useState({
    bloodType: '',
    unitsRequested: 0,
    urgency: 'Medium'
  });

  // Fetch data on component mount
  useEffect(() => {
    const token = getAuthToken();
    const userInfoString = localStorage.getItem('user_info');

    if (!token || !userInfoString) {
      router.push('/login');
      return;
    }

    try {
      const userInfo = JSON.parse(userInfoString);
      if (userInfo.role !== 'hospital') {
        router.push('/login'); // Redirect if not a hospital user
        return;
      }
      setUser(userInfo);
    } catch (e) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const stats = await fetchHospitalStats();
        setHospitalStats(stats);

        const requests = await fetchHospitalRequests();
        setActiveRequests(requests);

        const inv = await fetchBloodInventory();
        setInventory(inv);

        const donorRes = await fetchDonorResponses();
        setDonorResponses(donorRes);
      } catch (err: any) {
        setError("Failed to fetch dashboard data.");
        toast.error("Failed to load dashboard data.", {
          description: err.message || "An unexpected error occurred."
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Helper function to handle new request
  const handleNewRequest = async () => {
    try {
      if (!newRequestData.bloodType || newRequestData.unitsRequested <= 0) {
        toast.error("Please provide valid blood type and units requested.");
        return;
      }
      const newRequest = await createBloodRequest(newRequestData);

      setActiveRequests(prevRequests => [...prevRequests, newRequest]);

      toast.success('New blood request created!', {
        description: `Request for ${newRequest.unitsRequested} units of ${newRequest.bloodType} has been submitted.`,
      });

      // Reset form data and close modal after successful submission
      setNewRequestData({ bloodType: '', unitsRequested: 0, urgency: 'Medium' });
      setIsModalOpen(false);

    } catch (err: any) {
      toast.error('Failed to create new request.', {
        description: err.message || "An unexpected error occurred."
      });
    }
  };

  const handleContactDonor = (donorId: string) => {
    // This would typically involve an API call to a `/contact-donor` endpoint
    // to notify the donor and log the action.
    toast.success('Donor contacted successfully!', {
      description: 'The donor will receive your contact information.',
    });
  };

  const getInventoryStatusColor = (status: string) => {
    switch (status) {
      case 'Critical': return 'destructive';
      case 'Low': return 'default';
      case 'Normal': return 'secondary';
      case 'Adequate': return 'outline';
      default: return 'secondary';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const criticalInventory = inventory.filter(item => item.status === 'Critical');
  const lowInventory = inventory.filter(item => item.status === 'Low');

  // Use either the real data or the sample data for rendering
  const inventoryToDisplay = inventory.length > 0 ? inventory : sampleInventory;
  const donorResponsesToDisplay = donorResponses.length > 0 ? donorResponses : sampleDonorResponses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hospital Dashboard</h1>
            <p className="text-gray-600">{user?.name || "Loading..."} - Blood Bank Management</p>
          </div>
          {/* New Blood Request Dialog/Modal Trigger */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="mr-2 h-4 w-4" />
                New Blood Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Blood Request</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new blood request.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bloodType" className="text-right">
                    Blood Type
                  </Label>
                  <Select
                    onValueChange={(value) => setNewRequestData({ ...newRequestData, bloodType: value })}
                    value={newRequestData.bloodType}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select Blood Type" />
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unitsRequested" className="text-right">
                    Units
                  </Label>
                  <Input
                    id="unitsRequested"
                    type="number"
                    value={newRequestData.unitsRequested}
                    onChange={(e) => setNewRequestData({ ...newRequestData, unitsRequested: parseInt(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="urgency" className="text-right">
                    Urgency
                  </Label>
                  <Select
                    onValueChange={(value) => setNewRequestData({ ...newRequestData, urgency: value as 'Critical' | 'High' | 'Medium' | 'Low' })}
                    value={newRequestData.urgency}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select Urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleNewRequest} className="bg-blue-600 hover:bg-blue-700">
                  Submit Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600 text-lg">Loading dashboard data...</p>
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Conditional rendering for content when not loading and no error */}
        {!loading && !error && (
          <>
            {/* Critical Alerts */}
            {(criticalInventory.length > 0 || lowInventory.length > 0) && (
              <div className="mb-8 space-y-4">
                {criticalInventory.length > 0 && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Critical Shortage:</strong> {criticalInventory.map(item => item.bloodType).join(', ')} blood types are critically low. Immediate action required.
                    </AlertDescription>
                  </Alert>
                )}
                {lowInventory.length > 0 && (
                  <Alert className="border-orange-200 bg-orange-50">
                    <Bell className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      <strong>Low Inventory:</strong> {lowInventory.map(item => item.bloodType).join(', ')} blood types are below minimum requirements.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Requests</p>
                      <p className="text-2xl font-bold text-blue-600">{hospitalStats.totalRequests}</p>
                    </div>
                    <Hospital className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Requests</p>
                      <p className="text-2xl font-bold text-red-600">{hospitalStats.activeRequests}</p>
                    </div>
                    <Bell className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completed Today</p>
                      <p className="text-2xl font-bold text-green-600">{hospitalStats.completedToday}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Response</p>
                      <p className="text-2xl font-bold text-purple-600">{hospitalStats.averageResponseTime}</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="requests" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="requests">Active Requests</TabsTrigger>
                <TabsTrigger value="inventory">Blood Inventory</TabsTrigger>
                <TabsTrigger value="donors">Donor Responses</TabsTrigger>
                <TabsTrigger value="network">Hospital Network</TabsTrigger>
              </TabsList>

              <TabsContent value="requests" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Active Blood Requests</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search requests..." className="pl-10 w-64" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {activeRequests.map((request) => (
                    <Card key={request.id} className="border-l-4 border-blue-500">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 rounded-full">
                              <Heart className="h-6 w-6 text-red-600 fill-current" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">
                                {request.bloodType} Blood Request
                              </h3>
                              <p className="text-sm text-gray-600">
                                {request.unitsRequested} units requested • {new Date(request.requestedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getUrgencyColor(request.urgency)}>
                              {request.urgency}
                            </Badge>
                            <Badge variant="outline">{request.status}</Badge>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">
                              {request.donorResponses} donor responses
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Hospital className="h-4 w-4 text-green-600" />
                            <span className="text-sm">
                              {request.hospitalResponses} hospital offers
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-600" />
                            <span className="text-sm">
                              Requested {new Date(request.requestedAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            View Responses
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit Request
                          </Button>
                          <Button size="sm" variant="outline">
                            Cancel Request
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="inventory" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Blood Inventory Management</h2>
                  <Button variant="outline">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {inventoryToDisplay.map((item) => (
                    <Card key={item.bloodType} className="border-0 shadow-lg">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{item.bloodType}</CardTitle>
                          <Badge variant={getInventoryStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Available</span>
                            <span className="text-xl font-bold text-blue-600">
                              {item.unitsAvailable}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Required</span>
                            <span className="text-sm font-medium">
                              {item.minimumRequired}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Expiring (7d)</span>
                            <span className="text-sm font-medium text-orange-600">
                              {item.expiringIn7Days}
                            </span>
                          </div>
                          <div className="pt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  item.unitsAvailable >= item.minimumRequired
                                    ? 'bg-green-600'
                                    : item.unitsAvailable >= item.minimumRequired * 0.5
                                    ? 'bg-yellow-600'
                                    : 'bg-red-600'
                                }`}
                                style={{
                                  width: `${Math.min(100, (item.unitsAvailable / item.minimumRequired) * 100)}%`
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="donors" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Donor Responses</h2>
                  <div className="flex items-center gap-3">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Donors</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  {donorResponsesToDisplay.map((donor) => (
                    <Card key={donor.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                              <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{donor.donorName}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Heart className="h-3 w-3 text-red-600 fill-current" />
                                  {donor.bloodType}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {donor.distance}
                                </span>
                                <span>Last donation: {donor.lastDonation}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={donor.status === 'Available' ? 'default' : 'secondary'}>
                              {donor.status}
                            </Badge>
                            <Button
                              size="sm"
                              onClick={() => handleContactDonor(donor.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Phone className="mr-2 h-4 w-4" />
                              Contact
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="network" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Hospital Network</h2>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Hospital
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Partner Hospitals</CardTitle>
                      <CardDescription>
                        Network hospitals that can provide backup blood supply
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <div className="font-medium">Metro Medical Center</div>
                            <div className="text-sm text-gray-600">3.2 km • O+ available: 15 units</div>
                          </div>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Connected
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div>
                            <div className="font-medium">Regional Trauma Center</div>
                            <div className="text-sm text-gray-600">5.7 km • AB- available: 8 units</div>
                          </div>
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            Online
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Network Requests</CardTitle>
                      <CardDescription>
                        Recent requests from partner hospitals
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">Emergency Blood Request</div>
                            <Badge variant="destructive">Critical</Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            St. Mary's Hospital needs B- blood (2 units)
                          </div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">Routine Request</div>
                            <Badge variant="secondary">Medium</Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            Community Hospital needs O+ blood (5 units)
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}