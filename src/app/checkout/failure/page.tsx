'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, XCircle, RefreshCw, Home, Phone, Mail } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function CheckoutFailurePage() {
  const router = useRouter()
  const [reason, setReason] = useState('Payment processing timeout')

  const handleRetry = () => {
    router.push('/checkout/review')
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Payment Failed</CardTitle>
              <CardDescription>
                We couldn't process your payment. Please try again.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <div className="text-sm">
                  <p className="font-medium">Reason: {reason}</p>
                  <p className="text-muted-foreground">
                    Your payment could not be processed. Please check your payment details and try again.
                  </p>
                </div>
              </Alert>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Try Cash on Delivery:</span> Switch to COD for hassle-free payment without card processing issues.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button onClick={handleRetry} className="w-full" size="lg">
              <RefreshCw className="mr-2 h-5 w-5" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => router.push('/cart')} className="w-full">
              Return to Cart
            </Button>
            <Button variant="ghost" onClick={() => router.push('/')} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </div>

          {/* Help */}
          <div className="text-center pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-2">
              Need help? We're here to assist you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" asChild>
                <Link href="/contact">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="mailto:support@cybershop.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
