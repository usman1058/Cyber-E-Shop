'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings, Shield, Bell, Search, FileText, CheckCircle, Download, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

export default function SystemPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO & Metadata</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic store configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="store-name">Store Name</Label>
                <Input id="store-name" defaultValue="Cyber Shop" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input id="contact-email" type="email" defaultValue="admin@cybershop.com" />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-mode">Enable Maintenance Mode</Label>
                  <p className="text-xs text-muted-foreground">Temporarily disable access for visitors</p>
                </div>
                <Switch id="maintenance-mode" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-status">Site Status</Label>
                <select id="site-status" className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                  <option value="online">Online</option>
                  <option value="maintenance">Maintenance Mode</option>
                </select>
              </div>

              <div className="space-y-2 p-4 bg-muted/50 rounded-lg border border-dashed">
                <Label htmlFor="maintenance-msg">Maintenance Message</Label>
                <Textarea
                  id="maintenance-msg"
                  placeholder="Enter the message to show visitors..."
                  rows={3}
                  defaultValue="We'll be right back shortly. Thank you for your patience!"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Metadata</CardTitle>
              <CardDescription>Configure search engine optimization settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="meta-title">Default Meta Title</Label>
                <Input id="meta-title" defaultValue="Cyber Shop | Your Ultimate Tech Destination" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-desc">Meta Description</Label>
                <Textarea
                  id="meta-desc"
                  rows={3}
                  defaultValue="Discover the latest electronics, gadgets, and accessories at Cyber Shop. We offer competitive prices and fast shipping on all orders."
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="canonical-urls">Canonical URLs</Label>
                  <p className="text-xs text-muted-foreground">Prevent duplicate content issues</p>
                </div>
                <Switch id="canonical-urls" />
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Configure Auto-Meta</p>
                    <p className="text-xs text-muted-foreground">Configure meta tags for products and categories automatically</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure email notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="order-confirm">Order Confirmation Emails</Label>
                  <p className="text-xs text-muted-foreground">Send emails for order confirmation</p>
                </div>
                <Switch id="order-confirm" defaultChecked />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="shipping-notify">Shipping Notifications</Label>
                  <p className="text-xs text-muted-foreground">Send shipping updates</p>
                </div>
                <Switch id="shipping-notify" defaultChecked />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="promo-emails">Promotional Emails</Label>
                  <p className="text-xs text-muted-foreground">Send marketing emails</p>
                </div>
                <Switch id="promo-emails" />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="support-notify">Support Ticket Updates</Label>
                  <p className="text-xs text-muted-foreground">Send ticket status updates</p>
                </div>
                <Switch id="support-notify" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Mode</CardTitle>
              <CardDescription>Configure downtime and maintenance settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="maint-enable">Enable Maintenance Mode</Label>
                  <p className="text-xs text-muted-foreground">Take the site offline immediately</p>
                </div>
                <div className="flex items-center gap-4">
                  <Switch id="maint-enable" />
                  <Button variant="outline" size="sm">Activate Maintenance</Button>
                </div>
              </div>

              <div className="space-y-2 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-100 dark:border-amber-900">
                <Label htmlFor="maint-msg">Maintenance Message</Label>
                <p className="text-xs text-muted-foreground mb-2">When maintenance is active, this message will be shown to visitors:</p>
                <Textarea
                  id="maint-msg"
                  rows={3}
                  defaultValue="We are currently performing scheduled maintenance. We'll be back online soon. Thank you for your patience!"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="countdown">Show Countdown</Label>
                  <p className="text-xs text-muted-foreground">Display estimated completion time</p>
                </div>
                <Switch id="countdown" defaultChecked />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Estimated Duration (hours)</Label>
                  <Input id="duration" type="number" defaultValue="2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input id="start-time" type="datetime-local" defaultValue="2024-01-16T00:00" className="w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Tab */}
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Recovery</CardTitle>
              <CardDescription>Manage database backups and restore procedures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-backup">Automatic Daily Backup</Label>
                    <p className="text-xs text-muted-foreground">Backup database daily at 2:00 AM</p>
                  </div>
                  <Switch id="auto-backup" defaultChecked />
                </div>
                <div className="pl-4">
                  <p className="text-xs text-muted-foreground">Last backup: 2 hours ago</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retention">Backup Retention Policy</Label>
                <select id="retention" className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                  <option value="7">Keep last 7 days</option>
                  <option value="30">Keep last 30 days</option>
                  <option value="90">Keep last 90 days</option>
                </select>
              </div>

              <div className="pt-4 border-t flex flex-col sm:flex-row justify-between gap-4">
                <Button variant="outline" className="w-full sm:w-auto">
                  <FileText className="h-4 w-4 mr-2" />
                  Backup Now
                </Button>
                <Button variant="secondary" className="w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}