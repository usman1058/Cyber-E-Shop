'use client'

import { useState, useEffect } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Cpu, HardDrive, Monitor, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

export default function CompatibilityCheckerPage() {
  const [products, setProducts] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [selectedComponent, setSelectedComponent] = useState('')
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<{
    status: 'compatible' | 'incompatible' | 'warning' | null
    message: string
    details: string[]
    alternatives?: string[]
  }>({ status: null, message: '', details: [] })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=50')
        const data = await res.json()
        if (data.products) {
          setProducts(data.products)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const checkCompatibility = async () => {
    if (!selectedProduct || !selectedComponent) return

    setChecking(true)
    try {
      const res = await fetch(`/api/compatibility?productId=${selectedProduct}&componentId=${selectedComponent}`)
      const data = await res.json()
      
      if (data.success && data.compatibility) {
        const comp = data.compatibility
        // Simulate a slightly more complex report based on the product
        setResult({
          status: 'compatible',
          message: 'Compatible',
          details: comp.notes || ['Components are compatible with each other.'],
          alternatives: comp.compatibleProducts?.map((p: any) => p.name)
        })
      } else {
        setResult({
          status: 'warning',
          message: 'Unknown Compatibility',
          details: ['We could not find detailed compatibility rules for this combination.']
        })
      }
    } catch (error) {
       console.error('Check error:', error)
    } finally {
      setChecking(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compatible':
        return <CheckCircle className="h-12 w-12 text-green-600" />
      case 'incompatible':
        return <XCircle className="h-12 w-12 text-red-600" />
      case 'warning':
        return <AlertCircle className="h-12 w-12 text-yellow-600" />
      default:
        return <Info className="h-12 w-12 text-blue-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compatible':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Compatible</Badge>
      case 'incompatible':
        return <Badge variant="destructive">Incompatible</Badge>
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Warning</Badge>
      default:
        return null
    }
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3">Compatibility Checker</h1>
            <p className="text-muted-foreground">
              Check if components are compatible with each other before you buy
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Select Components</CardTitle>
                <CardDescription>
                  Choose the products you want to check for compatibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary Product</label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder={loading ? "Loading..." : "Select a product..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          <div className="flex items-center gap-2">
                            <Cpu className="h-4 w-4" />
                            {product.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Secondary Component</label>
                  <Select value={selectedComponent} onValueChange={setSelectedComponent}>
                    <SelectTrigger>
                      <SelectValue placeholder={loading ? "Loading..." : "Select a component..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          <div className="flex items-center gap-2">
                            <HardDrive className="h-4 w-4" />
                            {product.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={checkCompatibility}
                  disabled={!selectedProduct || !selectedComponent || checking}
                  className="w-full"
                  size="lg"
                >
                  {checking ? 'Checking...' : 'Check Compatibility'}
                </Button>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Supported Checks:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• CPU & Motherboard compatibility</li>
                    <li>• RAM type & speed matching</li>
                    <li>• GPU power requirements</li>
                    <li>• Storage interface compatibility</li>
                    <li>• PSU capacity sufficiency</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle>Compatibility Results</CardTitle>
                <CardDescription>
                  See if your selected components work together
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result.status ? (
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-muted/50 rounded-lg">
                      <div className="flex justify-center mb-3">
                        {getStatusIcon(result.status)}
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold">{result.message}</h3>
                        {getStatusBadge(result.status)}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium">Details:</h4>
                      <ul className="space-y-2">
                        {result.details.map((detail, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="mt-1.5">•</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {result.alternatives && result.alternatives.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-3">
                          <h4 className="font-medium">Recommended Alternatives:</h4>
                          <div className="flex flex-wrap gap-2">
                            {result.alternatives.map((alt, index) => (
                              <Badge key={index} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                                {alt}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    <Separator />

                    <div className="space-y-3">
                      <Button className="w-full">
                        View Compatible Products
                        <Monitor className="ml-2 h-4 w-4" />
                      </Button>
                      <Button variant="outline" onClick={() => setResult({ status: null, message: '', details: [] })}>
                        Check Another Combination
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Info className="h-12 w-12 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">
                      Select components and click "Check Compatibility" to see the results
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Fully Compatible</h4>
                    <p className="text-sm text-muted-foreground">
                      Components work together with no issues and are recommended for use.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Warning</h4>
                    <p className="text-sm text-muted-foreground">
                      Components may work but have potential limitations or require additional considerations.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Incompatible</h4>
                    <p className="text-sm text-muted-foreground">
                      Components cannot be used together and alternatives should be considered.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
