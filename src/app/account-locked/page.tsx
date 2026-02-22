'use client'

import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Shield, AlertCircle, Clock } from 'lucide-react'

export default function AccountLockedPage() {
  const router = useRouter()

  const handleContactSupport = () => {
    router.push('/contact')
  }

  const handleUnlock = () => {
    router.push('/forgot-password')
  }

  return (
    <PageLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <Lock className="h-10 w-10 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Account Temporarily Locked</CardTitle>
              <CardDescription>
                Too many failed login attempts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">Security Lock Activated</p>
                      <p className="text-sm text-red-700">
                        Your account has been temporarily locked after multiple failed login attempts.
                        This is to protect your account from unauthorized access.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Automatic Unlock</p>
                      <p className="text-muted-foreground">
                        Your account will automatically unlock after 30 minutes of no further attempts.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Manual Unlock</p>
                      <p className="text-muted-foreground">
                        Reset your password to immediately unlock your account.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium text-blue-900">What to do:</p>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>Wait 30 minutes for automatic unlock, OR</li>
                    <li>Reset your password using the button below</li>
                    <li>If you don't recognize this activity, contact support immediately</li>
                  </ol>
                </div>

                <div className="space-y-3 pt-4">
                  <Button onClick={handleUnlock} className="w-full">
                    Reset Password to Unlock
                  </Button>
                  <Button onClick={handleContactSupport} variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </div>

                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Believes this is a mistake? <a href="/contact" className="text-primary hover:underline">Get help here</a>
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
