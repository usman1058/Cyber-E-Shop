'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, AlertCircle, Package, ChevronLeft, RefreshCw } from 'lucide-react'

export default function CheckoutProcessingPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'processing' | 'complete'>('processing')

  useEffect(() => {
    // Simulate processing
    const timer = setTimeout(() => {
      setStatus('complete')
      
      // Redirect after showing complete message
      setTimeout(() => {
        router.push('/checkout/success')
      }, 2000)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            {/* Loading Animation */}
            {status === 'processing' && (
              <Card>
                <CardContent className="p-12">
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 border-4 border-t-4 border-primary/20 rounded-full animate-spin">
                      <Package className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Processing Your Order</h2>
                    <p className="text-muted-foreground">
                      Please wait while we confirm your order...
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Complete */}
            {status === 'complete' && (
              <Card>
                <CardContent className="p-12">
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold">Order Confirmed!</h2>
                    <p className="text-muted-foreground">
                      Your order has been processed successfully
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Redirecting to confirmation page...
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
