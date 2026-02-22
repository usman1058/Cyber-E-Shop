'use client';

import { useState } from 'react';
import { Save, DollarSign, MapPin, CreditCard, Globe, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState({
    currency: 'USD',
    taxRate: 8.5,
    freeShippingThreshold: 50,
    defaultShippingCost: 5.99,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground text-sm">Configure store-wide settings</p>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic store information and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Store Name</Label>
                <Input defaultValue="Cyber Shop" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <select className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Time Zone</Label>
                  <select className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                    <option value="UTC+0">GMT (UTC+0)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tax Rate (%)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.taxRate}
                    onChange={(e) => setSettings({...settings, taxRate: parseFloat(e.target.value)})}
                  />
                  <span className="text-muted-foreground text-sm">%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Configuration</CardTitle>
              <CardDescription>Set shipping options and costs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Free Shipping</Label>
                  <p className="text-sm text-muted-foreground">Enable free shipping for orders over threshold</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label>Free Shipping Threshold</Label>
                <div className="flex items-center gap-4">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => setSettings({...settings, freeShippingThreshold: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Default Shipping Cost</Label>
                <div className="flex items-center gap-4">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    step="0.01"
                    value={settings.defaultShippingCost}
                    onChange={(e) => setSettings({...settings, defaultShippingCost: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateway Configuration</CardTitle>
              <CardDescription>Manage payment options and gateways</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Cash on Delivery (COD)</p>
                    <p className="text-xs text-muted-foreground">Currently Active</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-sm">Credit Card Payments</p>
                    <p className="text-xs text-muted-foreground">Not Configured</p>
                  </div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">PayPal</p>
                    <p className="text-xs text-muted-foreground">Not Configured</p>
                  </div>
                </div>
                <Switch />
              </div>

              <Button variant="outline" className="w-full">
                <AlertCircle className="h-4 w-4 mr-2" />
                Add New Payment Gateway
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system-wide alerts and emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Low Stock Alert Email</Label>
                <Textarea
                  placeholder="Email sent when stock falls below threshold..."
                  rows={3}
                  defaultValue="Dear Admin, The following products are running low on stock: [PRODUCT_LIST]. Please restock soon to avoid stockouts."
                />
              </div>

              <div className="space-y-2">
                <Label>New Order Notification</Label>
                <Textarea
                  placeholder="Email sent for new orders..."
                  rows={3}
                  defaultValue="New order received: [ORDER_NUMBER] from [CUSTOMER_NAME]. Total: [ORDER_TOTAL]. Please process the order and update the status."
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send system alerts via email</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
