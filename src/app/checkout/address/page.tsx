'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { useSession } from '@/hooks/use-session'
import { useNavigationLoader } from '@/hooks/use-navigation-loader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, Plus, ChevronRight, Package, Check, Navigation, Map as MapIcon, X } from 'lucide-react'
import { toast } from 'sonner'

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

export default function CheckoutAddressPage() {
  const router = useRouter()
  const { session, loading: sessionLoading } = useSession()
  const { navigateWithLoader, LoaderComponent } = useNavigationLoader()
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    email: '',
  })
  const [isCapturingLocation, setIsCapturingLocation] = useState(false)

  const fetchAddresses = useCallback(async () => {
    if (!session?.user?.id) {
      setAddresses([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/user/addresses?userId=${session.user.id}`)
      if (!response.ok) throw new Error('Failed to fetch addresses')
      const data = await response.json()
      const fetchedAddresses = data.addresses || []
      setAddresses(fetchedAddresses)

      if (!selectedAddress && fetchedAddresses.length > 0) {
        const defaultAddr = fetchedAddresses.find((a: Address) => a.isDefault) || fetchedAddresses[0]
        setSelectedAddress(defaultAddr)
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
      toast.error('Failed to load addresses')
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id, selectedAddress])

  useEffect(() => {
    if (!sessionLoading) {
      fetchAddresses()
    }
  }, [sessionLoading, fetchAddresses])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }

    setIsCapturingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          // Reverse Geocoding using a free service or just open maps
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          const data = await response.json()
          
          if (data.address) {
            setFormData(prev => ({
              ...prev,
              address: data.display_name,
              city: data.address.city || data.address.town || '',
              state: data.address.state || '',
              postalCode: data.address.postcode || '',
              country: data.address.country || 'United States',
            }))
            toast.success('Location detected!')
          }
        } catch (error) {
          toast.error('Failed to resolve address from location')
        } finally {
          setIsCapturingLocation(false)
        }
      },
      () => {
        toast.error('Unable to retrieve your location')
        setIsCapturingLocation(false)
      }
    )
  }

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // If Guest, skip DB and just use local state
      if (!session?.user?.id) {
        const guestAddress = {
          ...formData,
          id: `guest_${Date.now()}`,
          isDefault: true,
          email: formData.email // Ensure email is captured
        }
        setAddresses([guestAddress])
        setSelectedAddress(guestAddress)
        setShowForm(false)
        toast.success('Address set for checkout')
        setLoading(false)
        return
      }

      const payload = {
        ...formData,
        userId: session.user.id,
      }

      const response = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to save address')
      
      const data = await response.json()
      const newAddress = data.address
      
      setAddresses(prev => [newAddress, ...prev])
      setSelectedAddress(newAddress)
      setShowForm(false)
      toast.success('Address saved successfully')
    } catch (error) {
      toast.error('Failed to save address')
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (!selectedAddress) {
      toast.error('Please select or add a shipping address')
      return
    }
    localStorage.setItem('selectedAddress', JSON.stringify(selectedAddress))
    navigateWithLoader('/checkout/shipping')
  }

  const mapSearchTerm = encodeURIComponent(`${formData.address} ${formData.city} ${formData.state} ${formData.postalCode}`)

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: 'Address' },
              { step: 2, label: 'Shipping' },
              { step: 3, label: 'Payment' },
              { step: 4, label: 'Review' },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${item.step === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {item.step === 1 && <Check className="h-5 w-5" />}
                  {item.step !== 1 && <span className="font-semibold text-sm">{item.step}</span>}
                </div>
                <span className="text-sm font-medium hidden sm:inline">{item.label}</span>
                {item.step < 4 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Shipping Address</h1>
              <p className="text-muted-foreground">Select or add where you'd like your order delivered</p>
            </div>

            {/* Saved Addresses List */}
            {!showForm && (
              <div className="space-y-4">
                {addresses.length > 0 ? (
                  addresses.map((address) => (
                    <Card
                      key={address.id}
                      onClick={() => setSelectedAddress(address)}
                      className={`cursor-pointer transition-all border-2 ${selectedAddress?.id === address.id ? 'border-primary bg-primary/5 shadow-md' : 'border-muted hover:border-primary/50'}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-full ${selectedAddress?.id === address.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold">{address.fullName}</h4>
                              {address.isDefault && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded uppercase font-bold">Default</span>}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{address.phone}</p>
                            <p className="text-sm">{address.address}, {address.city}, {address.state} {address.postalCode}</p>
                          </div>
                          {selectedAddress?.id === address.id && <Check className="h-5 w-5 text-primary" />}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : !loading && (
                  <Card className="border-dashed border-2 py-8 text-center bg-muted/30">
                    <CardContent>
                      <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">No saved addresses found</p>
                    </CardContent>
                  </Card>
                )}

                <Button variant="outline" className="w-full h-14 text-lg border-2 border-dashed" onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-5 w-5" /> Add New Address
                </Button>
              </div>
            )}

            {/* Manual Form */}
            {showForm && (
              <Card className="border-2 border-primary/20 shadow-xl overflow-hidden motion-safe:animate-in motion-safe:slide-in-from-bottom-4 duration-300">
                <CardHeader className="bg-muted/50 border-b flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Add New Address</CardTitle>
                    <CardDescription>Enter your delivery details manually</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}><X className="h-5 w-5" /></Button>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSaveAddress} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" name="fullName" placeholder="John Doe" required value={formData.fullName} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" placeholder="+1234567890" required value={formData.phone} onChange={handleInputChange} />
                      </div>
                    </div>

                    {!session?.user?.id && (
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" placeholder="john@example.com" required value={formData.email} onChange={handleInputChange} />
                        <p className="text-[10px] text-muted-foreground italic">Important: We'll create a secure account for your order tracking using this email.</p>
                      </div>
                    )}

                    <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label htmlFor="address">Address</Label>
                         <Button type="button" variant="link" size="sm" className="h-auto p-0 text-primary font-bold" onClick={handleDetectLocation} loading={isCapturingLocation}>
                            <Navigation className="h-3 w-3 mr-1" /> Use Current Location
                         </Button>
                       </div>
                       <Input id="address" name="address" placeholder="123 Street Name" required value={formData.address} onChange={handleInputChange} />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" placeholder="New York" required value={formData.city} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" name="state" placeholder="NY" required value={formData.state} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Zip Code</Label>
                        <Input id="postalCode" name="postalCode" placeholder="10001" required value={formData.postalCode} onChange={handleInputChange} />
                      </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <Button type="submit" className="flex-1" loading={loading}>Save & Use Address</Button>
                      <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Maps Preview */}
            {(showForm || selectedAddress) && (
              <Card className="overflow-hidden border-2 shadow-sm">
                <CardHeader className="py-3 px-4 bg-muted/30 border-b flex flex-row items-center gap-2">
                  <MapIcon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold opacity-80 uppercase tracking-tight">Location Preview</span>
                </CardHeader>
                <div className="aspect-video w-full bg-muted">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${mapSearchTerm || 'New+York'}&output=embed`}
                  ></iframe>
                </div>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={() => router.push('/cart')}>Back to Cart</Button>
              <Button onClick={handleContinue} loading={loading} disabled={!selectedAddress || showForm} size="lg">
                Continue to Shipping <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Sidebar - Info */}
          <div className="space-y-6">
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-blue-900">Delivery Perks</p>
                    <p className="text-xs text-blue-700">Orders over $50 qualify for free standard shipping.</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-center gap-2 font-medium"><Check className="h-4 w-4" /> Secure Tracking</li>
                  <li className="flex items-center gap-2 font-medium"><Check className="h-4 w-4" /> Reliable Carriers</li>
                  <li className="flex items-center gap-2 font-medium"><Check className="h-4 w-4" /> Easy Returns</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-muted/50 border-dashed border-2">
              <CardContent className="p-6 text-sm">
                <p className="font-bold mb-3 flex items-center gap-2 opacity-60 uppercase"><MapPin className="h-4 w-4" /> Why address matters?</p>
                <p className="text-muted-foreground leading-relaxed">
                  Accurate address ensures your premium products reach you safely and on time. We use smart location detection to make it easier for you!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <LoaderComponent />
    </PageLayout>
  )
}
