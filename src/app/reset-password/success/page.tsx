'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function PasswordResetSuccessPage() {
  const router = useRouter()

  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <PageLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Password Reset Successful!</CardTitle>
              <CardDescription>
                Your password has been successfully updated
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg text-left space-y-2">
                  <p className="text-sm font-medium">What happens next:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• You can now log in with your new password</li>
                    <li>• For security, you may need to log in again on all devices</li>
                    <li>• Make sure to remember your new password</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg text-left space-y-2">
                  <p className="text-sm font-medium text-blue-900">Security Tip:</p>
                  <p className="text-sm text-blue-700">
                    Use a unique password for this account that you don't use anywhere else.
                    Consider using a password manager to help you remember it.
                  </p>
                </div>

                <Button onClick={handleLogin} className="w-full" size="lg">
                  Continue to Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Need help? <Link href="/contact" className="text-primary hover:underline">Contact Support</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
