'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Clock, RefreshCw, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export default function AdminSessionTimeoutPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleRefreshSession = async () => {
    setIsRefreshing(true);

    try {
      const response = await fetch('/api/admin/auth/refresh', {
        method: 'POST',
      });

      if (response.ok) {
        toast({
          title: 'Session Refreshed',
          description: 'Your session has been successfully extended.',
        });

        setTimeout(() => {
          router.back();
        }, 1000);
      } else {
        toast({
          title: 'Session Expired',
          description: 'Your session has expired. Please log in again.',
          variant: 'destructive',
        });

        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to refresh session. Please log in again.',
        variant: 'destructive',
      });

      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true);

    setTimeout(() => {
      router.push('/admin/login');
    }, 1000);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-10 w-10 text-amber-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Session Timeout</CardTitle>
            <CardDescription>
              Your admin session has expired due to inactivity
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Explanation */}
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription className="text-sm">
                For security reasons, admin sessions automatically expire after 30 minutes of inactivity.
                This helps protect your account from unauthorized access.
              </AlertDescription>
            </Alert>

            {/* Information */}
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>What happens now:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>You'll need to log in again to continue</li>
                <li>Any unsaved changes may be lost</li>
                <li>Your previous actions are still recorded</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleRefreshSession}
                className="w-full"
                disabled={isRefreshing || isLoggingOut}
              >
                {isRefreshing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try to Refresh Session
                  </>
                )}
              </Button>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full"
                disabled={isRefreshing || isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <LogOut className="h-4 w-4 mr-2" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4 mr-2" />
                    Log In Again
                  </>
                )}
              </Button>

              <Button
                onClick={handleGoHome}
                variant="ghost"
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Return to Homepage
              </Button>
            </div>

            {/* Security Notice */}
            <div className="text-xs text-center text-muted-foreground border-t pt-4">
              <p>This timeout is a security feature to protect your account.</p>
              <p className="mt-1">Your data is safe and secure.</p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-sm">Tips to avoid session timeout:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Save your work frequently to prevent data loss</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Use the "Remember Me" option for trusted devices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Keep your browser tab open when working on important tasks</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
