'use client'

import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Clock, AlertCircle } from 'lucide-react'
import { useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'

export default function SessionExpiredPage() {
  const router = useRouter()
  const [rememberMe, setRememberMe] = useState(false)

  const handleLogin = () => {
    router.push(rememberMe ? '/login?remember=true' : '/login')
  }

  const handleHome = () => {
    router.push('/')
  }

  return (
    <PageLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-10 w-10 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Session Expired</CardTitle>
              <CardDescription>
                Your session has expired due to inactivity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Alert variant="default">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="space-y-2">
                    <p>
                      For your security, we automatically log you out after a period of inactivity.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Please sign in again to continue.
                    </p>
                  </AlertDescription>
                </Alert>

                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <span className="font-medium">Remember me</span>
                      <p className="text-muted-foreground mt-1">
                        Stay logged in for faster access on this device
                      </p>
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={handleLogin} className="w-full" size="lg">
                    Sign In Again
                  </Button>
                  <Button onClick={handleHome} variant="outline" className="w-full">
                    Return to Home
                  </Button>
                </div>

                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Need help? <a href="/contact" className="text-primary hover:underline">Contact Support</a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
