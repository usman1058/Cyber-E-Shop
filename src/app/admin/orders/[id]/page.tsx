'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Printer,
  MessageSquare,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variant: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  createdAt: string;
  customer: { name: string; email: string; phone: string };
  shippingAddress: { fullName: string; addressLine1: string; city: string; state: string; postalCode: string; country: string };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  timeline: { id: string; status: string; message: string; timestamp: string }[];
  notes: string;
}

export default function OrderDetailAdminPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/orders/${orderId}`);
        const data = await response.json();
        if (data.success) {
          setOrder(data.data);
        } else {
          toast.error(data.message || 'Failed to fetch order');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Something went wrong');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><RefreshCw className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!order) return <div className="p-8 text-center text-destructive">Order not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order #{order.orderNumber}</h1>
            <p className="text-sm text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Printer className="h-4 w-4 mr-2" />Print</Button>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground mb-2">Status</p>
            <div className="flex items-center gap-2">
              <Select 
                defaultValue={order.status} 
                onValueChange={handleStatusChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-full h-8">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
          </CardContent>
        </Card>
        <Card><CardContent className="pt-6"><p className="text-sm font-medium text-muted-foreground">Payment Status</p><Badge variant="outline" className="mt-1">{order.paymentStatus?.toUpperCase() || 'PENDING'}</Badge></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm font-medium text-muted-foreground">Method</p><p className="text-lg font-bold capitalize">{order.paymentMethod.replace('_', ' ')}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm font-medium text-muted-foreground">Total Amount</p><p className="text-lg font-bold">${order.total.toFixed(2)}</p></CardContent></Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="items">Items</TabsTrigger><TabsTrigger value="timeline">Timeline</TabsTrigger></TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardHeader><CardTitle className="text-lg">Customer & Shipping</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><p className="font-bold">{order.customer.name}</p><p className="text-sm text-muted-foreground">{order.customer.email}</p></div>
                <Separator />
                <div className="text-sm"><p className="font-medium">Shipping Address</p><p>{order.shippingAddress.addressLine1}</p><p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p></div>
              </CardContent>
            </Card>
            <Card><CardHeader><CardTitle className="text-lg">Payment Summary</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span>Shipping</span><span>${order.shipping.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
                <Separator />
                <div className="flex justify-between font-bold"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="items">
          <Card><CardContent className="pt-6"><div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3"><Package className="h-5 w-5 text-muted-foreground" /><div className="text-sm font-medium">{item.productName}<p className="text-xs text-muted-foreground">{item.variant}</p></div></div>
                <div className="text-right text-sm font-bold">x{item.quantity} • ${item.price.toFixed(2)}</div>
              </div>
            ))}
          </div></CardContent></Card>
        </TabsContent>
        <TabsContent value="timeline">
          <Card><CardContent className="pt-6"><div className="space-y-4">
            {order.timeline.map(event => (
              <div key={event.id} className="flex gap-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                <div><p className="font-bold">{event.message}</p><p className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p></div>
              </div>
            ))}
          </div></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
