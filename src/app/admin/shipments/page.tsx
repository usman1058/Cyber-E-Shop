'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Truck,
  Package,
  Search,
  Plus,
  Download,
  Printer,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface Shipment {
  id: string;
  orderNumber: string;
  orderId: string;
  carrier: string;
  trackingNumber: string;
  status: 'pending' | 'shipped' | 'in_transit' | 'delivered' | 'returned' | 'exception';
  weight: number;
  dimensions: string;
  shippingMethod: string;
  cost: number;
  fromAddress: string;
  toAddress: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  createdAt: string;
  shippedAt?: string;
  notes?: string;
}

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [carrierFilter, setCarrierFilter] = useState<string>('all');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create form state
  const [formData, setFormData] = useState({
    orderId: '',
    carrier: '',
    trackingNumber: '',
    estimatedDelivery: '',
  });

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/shipments');
      const data = await response.json();
      if (data.success) {
        setShipments(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch shipments:', error);
      toast.error('Failed to fetch shipments');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders?status=processing');
      const data = await response.json();
      if (data.success) {
        setPendingOrders(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch pending orders:', error);
    }
  };

  useEffect(() => {
    fetchShipments();
    fetchPendingOrders();
  }, []);

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Shipment created successfully');
        setIsCreateDialogOpen(false);
        setFormData({ orderId: '', carrier: '', trackingNumber: '', estimatedDelivery: '' });
        fetchShipments();
      } else {
        toast.error(data.message || 'Failed to create shipment');
      }
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500 hover:bg-yellow-600',
      shipped: 'bg-blue-500 hover:bg-blue-600',
      in_transit: 'bg-purple-500 hover:bg-purple-600',
      delivered: 'bg-green-500 hover:bg-green-600',
      returned: 'bg-orange-500 hover:bg-orange-600',
      exception: 'bg-red-500 hover:bg-red-600',
    };
    return colors[status] || 'bg-gray-500 hover:bg-gray-600';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      pending: Clock,
      shipped: Truck,
      in_transit: Package,
      delivered: CheckCircle,
      returned: Package,
      exception: AlertCircle,
    };
    return icons[status] || Package;
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch =
      shipment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.toAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    const matchesCarrier = carrierFilter === 'all' || shipment.carrier === carrierFilter;

    return matchesSearch && matchesStatus && matchesCarrier;
  });

  const carriers = Array.from(new Set(shipments.map(s => s.carrier)));
  const statuses = Array.from(new Set(shipments.map(s => s.status)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
          <p className="text-sm text-muted-foreground">Manage and track all store shipments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={fetchShipments}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Shipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <form onSubmit={handleCreateShipment}>
                <DialogHeader>
                  <DialogTitle>Create Shipment</DialogTitle>
                  <DialogDescription>
                    Assign a tracking number to a processing order.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="sorder">Processing Order</Label>
                    <Select onValueChange={(val) => setFormData({ ...formData, orderId: val })}>
                      <SelectTrigger id="sorder">
                        <SelectValue placeholder="Select an order" />
                      </SelectTrigger>
                      <SelectContent>
                        {pendingOrders.map(o => (
                          <SelectItem key={o.id} value={o.id}>
                            {o.orderNumber} - {o.customer}
                          </SelectItem>
                        ))}
                        {pendingOrders.length === 0 && (
                          <div className="p-2 text-xs text-muted-foreground text-center">No processing orders found</div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scarrier">Carrier</Label>
                    <Select onValueChange={(val) => setFormData({ ...formData, carrier: val })}>
                      <SelectTrigger id="scarrier">
                        <SelectValue placeholder="Select carrier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FedEx">FedEx</SelectItem>
                        <SelectItem value="UPS">UPS</SelectItem>
                        <SelectItem value="DHL">DHL</SelectItem>
                        <SelectItem value="USPS">USPS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="strack">Tracking Number</Label>
                    <Input 
                      id="strack"
                      placeholder="Enter tracking number" 
                      value={formData.trackingNumber}
                      onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sedd">Estimated Delivery</Label>
                    <Input 
                      id="sedd"
                      type="date" 
                      value={formData.estimatedDelivery}
                      onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting || !formData.orderId}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Shipment
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">Total Shipments</p>
              <p className="text-2xl font-bold">{shipments.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">In Transit</p>
              <p className="text-2xl font-bold text-purple-600">
                {shipments.filter(s => s.status === 'in_transit').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">Delivered</p>
              <p className="text-2xl font-bold text-green-600">
                {shipments.filter(s => s.status === 'delivered').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">Exceptions</p>
              <p className="text-2xl font-bold text-red-600">
                {shipments.filter(s => s.status === 'exception').length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by order #, tracking #, or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={carrierFilter} onValueChange={setCarrierFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Carrier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Carriers</SelectItem>
                  {carriers.map((carrier) => (
                    <SelectItem key={carrier} value={carrier}>
                      {carrier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Shipments</CardTitle>
            <CardDescription>
              {filteredShipments.length} shipment{filteredShipments.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Tracking #</TableHead>
                      <TableHead>Carrier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Est. Delivery</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShipments.map((shipment) => {
                      const StatusIcon = getStatusIcon(shipment.status);
                      return (
                        <TableRow key={shipment.id}>
                          <TableCell className="font-medium">{shipment.orderNumber}</TableCell>
                          <TableCell className="font-mono text-xs">{shipment.trackingNumber}</TableCell>
                          <TableCell>{shipment.carrier}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(shipment.status)}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {shipment.status.charAt(0).toUpperCase() +
                                shipment.status.slice(1).replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm truncate max-w-[200px]">{shipment.toAddress}</TableCell>
                          <TableCell className="text-sm">
                            {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedShipment(shipment)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Shipment Details</DialogTitle>
                                    <DialogDescription>
                                      Tracking: {shipment.trackingNumber}
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedShipment && (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Order</Label>
                                          <p className="text-sm font-medium">{selectedShipment.orderNumber}</p>
                                        </div>
                                        <div>
                                          <Label>Carrier</Label>
                                          <p className="text-sm font-medium">{selectedShipment.carrier}</p>
                                        </div>
                                        <div>
                                          <Label>Method</Label>
                                          <p className="text-sm font-medium">{selectedShipment.shippingMethod}</p>
                                        </div>
                                        <div>
                                          <Label>Cost</Label>
                                          <p className="text-sm font-medium">${selectedShipment.cost.toFixed(2)}</p>
                                        </div>
                                      </div>
                                      <Separator />
                                      <div>
                                        <Label>To Address</Label>
                                        <p className="text-sm text-muted-foreground">{selectedShipment.toAddress}</p>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Estimated Delivery</Label>
                                          <p className="text-sm font-medium">
                                            {new Date(selectedShipment.estimatedDelivery).toLocaleDateString()}
                                          </p>
                                        </div>
                                        {selectedShipment.actualDelivery && (
                                          <div>
                                            <Label>Actual Delivery</Label>
                                            <p className="text-sm font-medium">
                                              {new Date(selectedShipment.actualDelivery).toLocaleDateString()}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Printer className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      );
}
