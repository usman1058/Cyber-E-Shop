'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { RefreshCw, Loader2 } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  module: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
}

const allPermissions: Permission[] = [
  { id: 'products.view', name: 'View Products', module: 'Products', description: 'Can view product listings' },
  { id: 'products.create', name: 'Create Products', module: 'Products', description: 'Can add new products' },
  { id: 'products.edit', name: 'Edit Products', module: 'Products', description: 'Can modify product details' },
  { id: 'products.delete', name: 'Delete Products', module: 'Products', description: 'Can remove products' },
  { id: 'orders.view', name: 'View Orders', module: 'Orders', description: 'Can view order listings' },
  { id: 'orders.process', name: 'Process Orders', module: 'Orders', description: 'Can update order status' },
  { id: 'orders.refund', name: 'Process Refunds', module: 'Orders', description: 'Can approve refunds' },
  { id: 'users.view', name: 'View Users', module: 'Users', description: 'Can view user accounts' },
  { id: 'users.manage', name: 'Manage Users', module: 'Users', description: 'Can modify user accounts' },
  { id: 'tickets.view', name: 'View Tickets', module: 'Support', description: 'Can view support tickets' },
  { id: 'tickets.manage', name: 'Manage Tickets', module: 'Support', description: 'Can respond to tickets' },
  { id: 'inventory.view', name: 'View Inventory', module: 'Inventory', description: 'Can view stock levels' },
  { id: 'inventory.manage', name: 'Manage Inventory', module: 'Inventory', description: 'Can update stock' },
];

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full access to all features and settings',
    userCount: 2,
    permissions: allPermissions.map(p => p.id),
  },
  {
    id: '2',
    name: 'Support Manager',
    description: 'Can manage support tickets and view orders',
    userCount: 5,
    permissions: ['tickets.view', 'tickets.manage', 'orders.view', 'orders.process', 'users.view'],
  },
  {
    id: '3',
    name: 'Inventory Manager',
    description: 'Can manage products and inventory',
    userCount: 3,
    permissions: ['products.view', 'products.create', 'products.edit', 'inventory.view', 'inventory.manage'],
  },
  {
    id: '4',
    name: 'Finance Manager',
    description: 'Can manage payments, refunds and orders',
    userCount: 2,
    permissions: ['orders.view', 'orders.process', 'orders.refund', 'users.view'],
  },
];

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newRoleDialog, setNewRoleDialog] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/roles');
      const data = await response.json();
      if (data.success) {
        setRoles(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch roles');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toast.error('Role name is required');
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Role created successfully');
        setNewRoleDialog(false);
        setFormData({ name: '', description: '', permissions: [] });
        fetchRoles();
      } else {
        toast.error(data.message || 'Failed to create role');
      }
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    try {
      const response = await fetch(`/api/admin/roles?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Role deleted successfully');
        fetchRoles();
      } else {
        toast.error(data.message || 'Failed to delete role');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('Something went wrong');
    }
  };

  const togglePermission = (permId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId]
    }));
  };

  const getPermissionName = (permissionId: string) => {
    return allPermissions.find(p => p.id === permissionId)?.name || permissionId;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchRoles} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={newRoleDialog} onOpenChange={setNewRoleDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Define a new role with specific permissions for admin users.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateRole}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role Name</label>
                  <Input 
                    placeholder="e.g., Content Manager" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input 
                    placeholder="Brief description of this role" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Permissions</h4>
                  <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4">
                    {['Products', 'Orders', 'Users', 'Support', 'Inventory'].map(module => (
                      <div key={module} className="space-y-2">
                        <h5 className="text-sm font-medium text-muted-foreground border-b pb-1">{module}</h5>
                        <div className="space-y-2 pl-2">
                          {allPermissions.filter(p => p.module === module).map(permission => (
                            <div key={permission.id} className="flex items-start gap-3">
                              <Checkbox 
                                id={permission.id} 
                                checked={formData.permissions.includes(permission.id)}
                                onCheckedChange={() => togglePermission(permission.id)}
                              />
                              <div className="flex-1">
                                <label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                                  {permission.name}
                                </label>
                                <p className="text-xs text-muted-foreground">{permission.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setNewRoleDialog(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Role
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>

      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex justify-center py-12"><RefreshCw className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          roles.map((role) => (
            <Card key={role.id}>
              {/* ... table content using live data */}
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>{role.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {role.name !== 'Super Admin' && (
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteRole(role.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">Users:</span>
                  <Badge variant="secondary">{role.userCount} users</Badge>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Permissions ({role.permissions.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.slice(0, 8).map(permissionId => (
                      <Badge key={permissionId} variant="outline" className="text-xs">
                        {getPermissionName(permissionId)}
                      </Badge>
                    ))}
                    {role.permissions.length > 8 && (
                      <Badge variant="secondary" className="text-xs">
                        +{role.permissions.length - 8} more
                      </Badge>
                    )}
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setSelectedRole(role)}
                    >
                      View All Permissions
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                          <Shield className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <div>{selectedRole?.name}</div>
                          <DialogDescription className="mt-1">{selectedRole?.description}</DialogDescription>
                        </div>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {['Products', 'Orders', 'Users', 'Support', 'Inventory'].map(module => (
                        <div key={module} className="space-y-2">
                          <h5 className="text-sm font-medium">{module}</h5>
                          <div className="space-y-2">
                            {allPermissions.filter(p => p.module === module).map(permission => (
                              <div key={permission.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                {selectedRole?.permissions.includes(permission.id) ? (
                                  <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                  <X className="h-4 w-4 text-gray-400" />
                                )}
                                <div className="flex-1">
                                  <span className="text-sm font-medium">{permission.name}</span>
                                  <p className="text-xs text-muted-foreground">{permission.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <DialogTrigger asChild>
                        <Button>Close</Button>
                      </DialogTrigger>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
