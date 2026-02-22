'use client'

import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, AlertCircle, ArrowRight } from 'lucide-react'

export default function AccessDeniedPage() {
  const router = useRouter()

  const handleLogin = () => {
    router.push('/login')
  }

  const handleRegister = () => {
    router.push('/register')
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
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <Lock className="h-10 w-10 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to view this page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">Access Restricted</p>
                      <p className="text-sm text-red-700">
                        The page or resource you're trying to access requires authentication or specific permissions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium">Possible reasons:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• You're not logged in to your account</li>
                    <li>• Your account doesn't have the required permissions</li>
                    <li>• The page has been moved or deleted</li>
                    <li>• You're trying to access a restricted area</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-center text-muted-foreground">
                    What would you like to do?
                  </p>
                  
                  <Button onClick={handleLogin} className="w-full" size="lg">
                    Sign In to Your Account
                  </Button>
                  
                  <Button onClick={handleRegister} variant="outline" className="w-full">
                    Create a New Account
                  </Button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <Button onClick={handleHome} variant="ghost" className="w-full">
                    Return to Homepage
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Need help? <a href="/contact" className="text-primary hover:underline">Contact Support</a>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    If you believe this is an error, please let us know.
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
