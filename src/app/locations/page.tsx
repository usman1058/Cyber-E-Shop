'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, Phone, Mail } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function LocationsPage() {
  const [locations, setLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('/api/locations')
        const data = await res.json()
        if (data.success) {
          setLocations(data.locations)
        }
      } catch (error) {
        console.error('Error fetching locations:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLocations()
  }, [])

  return (
    <PageLayout>
      {/* Header */}
      <div className="bg-muted/50">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Store Locations
            </h1>
            <p className="text-lg text-muted-foreground">
              Find a CyberShop store or distribution center near you. Visit us for in-store pickups, product demonstrations, and expert support.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Locations List */}
          <div className="lg:col-span-2 space-y-6">
            {locations.map((location) => (
              <Card
                key={location.id}
                className={`cursor-pointer transition-all ${selectedLocation === location.id ? 'ring-2 ring-primary' : ''
                  }`}
                onClick={() => setSelectedLocation(location.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {location.name}
                        {location.type === 'Flagship' && (
                          <Badge className="ml-2">Flagship</Badge>
                        )}
                      </CardTitle>
                      <p className="text-muted-foreground mt-1">{location.city}, {location.state}</p>
                    </div>
                    <Badge variant="outline">{location.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{location.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium mb-1">Operating Hours</p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {location.hours && typeof location.hours === 'object' ? (
                          Object.entries(location.hours).map(([day, hours]) => (
                            <div key={day} className="flex justify-between gap-4">
                              <span className="capitalize">{day}</span>
                              <span>{String(hours)}</span>
                            </div>
                          ))
                        ) : (
                          <p>Hours not available</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{location.phone || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{location.email || 'N/A'}</p>
                    </div>
                  </div>

                  {location.services && (
                    <div>
                      <p className="font-medium mb-2">Services</p>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(location.services) ? (
                          location.services.map((service: string) => (
                            <Badge key={service} variant="secondary">
                              {service}
                            </Badge>
                          ))
                        ) : typeof location.services === 'string' ? (
                          JSON.parse(location.services).map((service: string) => (
                            <Badge key={service} variant="secondary">
                              {service}
                            </Badge>
                          ))
                        ) : null}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Map Placeholder */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-3" />
                    <p className="text-sm">
                      {selectedLocation
                        ? locations.find(l => l.id === selectedLocation)?.name
                        : 'Select a location'}
                    </p>
                  </div>
                </div>
                {selectedLocation && (
                  <Button className="w-full mt-4">
                    Get Directions
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
