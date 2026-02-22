'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldX, ArrowLeft, Home, LogOut, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminUnauthorizedPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleLogin = () => {
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50/50 via-background to-red-50/30 px-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <ShieldX className="h-10 w-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">
              Access Denied
            </CardTitle>
            <CardDescription>
              You don't have permission to access this page or resource
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Explanation */}
            <Alert variant="destructive">
              <ShieldX className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Your account does not have the necessary permissions to view this page.
                This could be due to role restrictions, account suspension, or attempting to access
                restricted administrative functions.
              </AlertDescription>
            </Alert>

            {/* Possible Reasons */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Possible reasons:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-0.5">1.</span>
                  <span>
                    <strong className="text-foreground">Insufficient Permissions:</strong> Your current role
                    doesn't grant access to this module. Contact your supervisor or super-admin for access.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-0.5">2.</span>
                  <span>
                    <strong className="text-foreground">Account Suspended:</strong> Your admin account may be
                    temporarily suspended. Please contact IT support.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-0.5">3.</span>
                  <span>
                    <strong className="text-foreground">Session Expired:</strong> Your login session may have
                    expired. Try logging in again.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-0.5">4.</span>
                  <span>
                    <strong className="text-foreground">Incorrect URL:</strong> You may have navigated to a
                    restricted page directly. Use the dashboard menu instead.
                  </span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleLogin}
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log In with Different Account
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleGoBack}
                  variant="outline"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>

                <Button
                  onClick={handleGoHome}
                  variant="outline"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Homepage
                </Button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-sm">Need help?</h3>
              <p className="text-sm text-muted-foreground">
                If you believe this is an error or need access to this page, please contact your
                super-admin or IT support team.
              </p>

              <div className="space-y-2 text-sm">
                <a
                  href="mailto:it-support@cybershop.com"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  <span>it-support@cybershop.com</span>
                </a>
                <a
                  href="tel:+18001234567"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  <span>1-800-123-4567 (IT Support)</span>
                </a>
              </div>
            </div>

            {/* Security Notice */}
            <div className="text-xs text-center text-muted-foreground border-t pt-4">
              <p>This access attempt has been logged for security purposes.</p>
              <p className="mt-1">Repeated unauthorized access may result in account suspension.</p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="/help-center">
            <Button variant="outline" className="w-full">
              Help Center
            </Button>
          </Link>
          <Link href="/support/tickets/new">
            <Button variant="outline" className="w-full">
              Submit Support Ticket
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
