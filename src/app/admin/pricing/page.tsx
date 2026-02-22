'use client';

import { Plus, Percent, Calendar, DollarSign, Trash2, Edit, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface Discount {
  id: string;
  name: string;
  type: string;
  value: number;
  scope: string;
  scopeValue?: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'scheduled' | 'expired' | 'paused';
  usage: number;
  minPurchase?: number;
}

const mockDiscounts: Discount[] = [
  {
    id: '1',
    name: 'Summer Sale',
    type: 'percentage',
    value: 20,
    scope: 'global',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'active',
    usage: 456,
    minPurchase: 50,
  },
  {
    id: '2',
    name: 'Electronics Category Deal',
    type: 'percentage',
    value: 15,
    scope: 'category',
    scopeValue: 'Electronics',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    status: 'active',
    usage: 128,
    minPurchase: 100,
  },
  {
    id: '3',
    name: 'Free Shipping Week',
    type: 'free_shipping',
    value: 0,
    scope: 'global',
    startDate: '2024-02-01',
    endDate: '2024-02-07',
    status: 'scheduled',
    usage: 0,
  },
  {
    id: '4',
    name: 'New Year Clearance',
    type: 'fixed',
    value: 25,
    scope: 'global',
    startDate: '2024-01-01',
    endDate: '2024-01-07',
    status: 'expired',
    usage: 892,
    minPurchase: 0,
  },
];

export default function AdminPricingPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    type: 'percentage',
    value: '',
    scope: 'global',
    scopeValue: '',
    startDate: '',
    endDate: '',
    minPurchase: '0',
  });

  const fetchDiscounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/pricing');
      const data = await response.json();
      if (data.success) {
        setDiscounts(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch discounts');
      }
    } catch (error) {
      console.error('Error fetching discounts:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  const handleAddDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Discount created successfully');
        setIsAddDialogOpen(false);
        setFormData({
          name: '',
          type: 'percentage',
          value: '',
          scope: 'global',
          scopeValue: '',
          startDate: '',
          endDate: '',
          minPurchase: '0',
        });
        fetchDiscounts();
      } else {
        toast.error(data.message || 'Failed to create discount');
      }
    } catch (error) {
      console.error('Error adding discount:', error);
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this discount?')) return;
    try {
      const response = await fetch(`/api/admin/pricing?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Discount deleted');
        fetchDiscounts();
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting discount:', error);
      toast.error('Something went wrong');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: 'default',
      scheduled: 'secondary',
      expired: 'outline',
      paused: 'secondary',
    };
    return (
      <Badge variant={variants[status] || 'default'} className="capitalize">
        {status}
      </Badge>
    );
  };

  const getTypeBadge = (discount: Discount) => {
    if (discount.type === 'free_shipping') {
      return <Badge variant="outline">Free Shipping</Badge>;
    }
    return (
      <Badge variant="secondary">
        {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
      </Badge>
    );
  };

  const filteredDiscounts = discounts.filter((discount) => {
    const matchesStatus = statusFilter === 'all' || discount.status === statusFilter;
    const matchesType = typeFilter === 'all' || discount.type === typeFilter;
    return matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Pricing & Discounts</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchDiscounts} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Discount
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <form onSubmit={handleAddDiscount}>
                <DialogHeader>
                  <DialogTitle>New Discount / Deal</DialogTitle>
                  <DialogDescription>
                    Create a new promotion for your store.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="dname">Promotion Name</Label>
                    <Input
                      id="dname"
                      placeholder="e.g. Summer Sale 2025"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dtype">Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(val) => setFormData({ ...formData, type: val })}
                      >
                        <SelectTrigger id="dtype">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                          <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                          <SelectItem value="free_shipping">Free Shipping</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dval">Value</Label>
                      <Input
                        id="dval"
                        type="number"
                        placeholder="0"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        disabled={formData.type === 'free_shipping'}
                        required={formData.type !== 'free_shipping'}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dscope">Scope</Label>
                      <Select
                        value={formData.scope}
                        onValueChange={(val) => setFormData({ ...formData, scope: val })}
                      >
                        <SelectTrigger id="dscope">
                          <SelectValue placeholder="Select scope" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="global">All Products</SelectItem>
                          <SelectItem value="category">Category</SelectItem>
                          <SelectItem value="product">Specific Product</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.scope !== 'global' && (
                      <div className="space-y-2">
                        <Label htmlFor="dscopeval">{formData.scope === 'category' ? 'Category Name' : 'Product ID'}</Label>
                        <Input
                          id="dscopeval"
                          placeholder="e.g. Electronics"
                          value={formData.scopeValue}
                          onChange={(e) => setFormData({ ...formData, scopeValue: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dstart">Start Date</Label>
                      <Input
                        id="dstart"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dend">End Date</Label>
                      <Input
                        id="dend"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Promotion
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background flex-1 text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="paused">Paused</option>
              <option value="expired">Expired</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background flex-1 text-sm"
            >
              <option value="all">All Types</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
              <option value="free_shipping">Free Shipping</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex justify-center py-12"><RefreshCw className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          filteredDiscounts.map((discount) => (
            <Card key={discount.id}>
              {/* ... same as before but using live data */}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{discount.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      {getTypeBadge(discount)}
                      {getStatusBadge(discount.status)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(discount.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Date Range */}
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground">Duration: </span>
                      <span className="font-medium">
                        {new Date(discount.startDate).toLocaleDateString()} - {new Date(discount.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Scope */}
                  <div className="text-sm">
                    <span className="text-muted-foreground">Applies to: </span>
                    <span className="font-medium capitalize">
                      {discount.scope === 'global'
                        ? 'All Products'
                        : discount.scope === 'category'
                          ? `${discount.scopeValue} Category`
                          : 'Specific Products'}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Usage</p>
                      <p className="text-lg font-semibold">{discount.usage}</p>
                    </div>
                    {discount.minPurchase && (
                      <div>
                        <p className="text-xs text-muted-foreground">Min Purchase</p>
                        <p className="text-lg font-semibold">
                          ${discount.minPurchase.toFixed(2)}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">Savings Avg</p>
                      <p className="text-lg font-semibold">
                        {discount.type === 'percentage'
                          ? `${discount.value}%`
                          : `$${discount.value.toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {filteredDiscounts.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No discounts found</p>
            <p>Create your first discount or adjust filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
