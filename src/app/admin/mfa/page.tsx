'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Shield, Key, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export default function AdminMFAPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [useBackupCode, setUseBackupCode] = useState(false);

  // Countdown timer
  useState(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = async (value: string) => {
    if (value.length !== 6) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth/mfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: value, type: useBackupCode ? 'backup' : 'otp' }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Verification Successful',
          description: 'You can now access the admin dashboard',
        });

        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1000);
      } else {
        setError(result.message || 'Invalid code. Please try again.');
        setOtp('');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/auth/mfa/resend', {
        method: 'POST',
      });

      if (response.ok) {
        toast({
          title: 'Code Sent',
          description: 'A new verification code has been sent to your email.',
        });
        setTimeRemaining(300);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to resend code. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 px-4">
      <div className="w-full max-w-md">
        {/* Back to Login */}
        <Link href="/admin/login">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
        </Link>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>
              {useBackupCode
                ? 'Enter your backup code to regain access'
                : 'Enter the 6-digit code sent to your email'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Time Remaining */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm">
                  <Key className="h-4 w-4" />
                  <span>Code expires in: {formatTime(timeRemaining)}</span>
                </div>
              </div>

              {/* OTP Input */}
              <div className="space-y-2">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    onComplete={handleComplete}
                    disabled={isLoading}
                  >
                    <InputOTPGroup>
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <InputOTPSlot key={i} index={i - 1} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {/* Backup Code Option */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setUseBackupCode(!useBackupCode);
                    setOtp('');
                    setError('');
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  {useBackupCode
                    ? 'Use verification code instead'
                    : 'Use backup code instead'}
                </button>
              </div>

              {/* Resend Code */}
              {!useBackupCode && (
                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleResendCode}
                    disabled={isLoading || timeRemaining > 270} // Wait 30 seconds before resending
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Resend Code
                  </Button>
                </div>
              )}

              {/* Info Alert */}
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {useBackupCode
                    ? 'Backup codes are one-time use. Once used, generate new ones from your account settings.'
                    : 'For your security, this code expires in 5 minutes. Each code can only be used once.'}
                </AlertDescription>
              </Alert>

              {/* Cancel Button */}
              <div className="pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/admin/login')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Alert className="mt-6">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Two-factor authentication adds an extra layer of security to protect your admin account.
            Never share your verification codes with anyone.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
