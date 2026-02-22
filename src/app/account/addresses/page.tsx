'use client'

import { useState, useEffect } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { useSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MapPin, Plus, Trash2, Edit, Check, AlertCircle, Star } from 'lucide-react'

interface Address {
  id: string
  fullName: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

export default function AddressManagement() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    isDefault: false,
  })

  const { session, loading: sessionLoading } = useSession()

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!session?.user?.id) return
      
      setLoading(true)
      try {
        const response = await fetch(`/api/user/addresses?userId=${session.user.id}`)
        if (response.ok) {
          const data = await response.json()
          setAddresses(data.addresses || [])
        }
      } catch (error) {
        console.error('Error fetching addresses:', error)
      } finally {
        setLoading(false)
      }
    }

    if (!sessionLoading) {
      fetchAddresses()
    }
  }, [session, sessionLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingId) {
        // Update existing address
        setAddresses(addresses.map(addr => 
          addr.id === editingId ? { ...formData, id: editingId } : addr
        ))
        setSuccess(true)
        setMessage('Address updated successfully!')
      } else {
        // Add new address
        const newAddress = { ...formData, id: Date.now().toString() }
        setAddresses([...addresses, newAddress])
        setSuccess(true)
        setMessage('Address added successfully!')
      }

      resetForm()
    } catch (err) {
      setMessage('Failed to save address. Please try again.')
    } finally {
      setLoading(false)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  const handleEdit = (address: Address) => {
    setFormData(address)
    setEditingId(address.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return
    
    setAddresses(addresses.filter(addr => addr.id !== id))
    setSuccess(true)
    setMessage('Address deleted successfully!')
    setTimeout(() => setSuccess(false), 3000)
  }

  const handleSetDefault = async (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })))
    setSuccess(true)
    setMessage('Default address updated!')
    setTimeout(() => setSuccess(false), 3000)
  }

  const resetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'USA',
      isDefault: false,
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Address Book</h1>
              <p className="text-muted-foreground">
                Manage your shipping addresses
              </p>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Address
              </Button>
            )}
          </div>

          {message && (
            <Alert variant={success ? 'default' : 'destructive'} className="mb-6">
              {success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {/* Address Form */}
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingId ? 'Edit Address' : 'Add New Address'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <select
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      <option value="USA">United States</option>
                      <option value="CAN">Canada</option>
                      <option value="GBR">United Kingdom</option>
                      <option value="AUS">Australia</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="isDefault" className="cursor-pointer">
                      Set as default shipping address
                    </Label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          {editingId ? 'Update Address' : 'Add Address'}
                        </>
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Address List */}
          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <Card key={address.id} className={`relative ${address.isDefault ? 'border-primary' : ''}`}>
                {address.isDefault && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Default
                    </div>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold">{address.fullName}</h4>
                        <p className="text-sm text-muted-foreground">{address.phone}</p>
                      </div>
                    </div>
                    <div className="pl-6 text-sm space-y-1">
                      <p>{address.address}</p>
                      <p>{address.city}, {address.state} {address.postalCode}</p>
                      <p>{address.country}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(address)}
                      className="flex-1"
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                        className="flex-1"
                      >
                        <Star className="mr-1 h-4 w-4" />
                        Set Default
                      </Button>
                    )}
                    {addresses.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(address.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
