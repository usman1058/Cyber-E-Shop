'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RefreshCw, CheckCircle, AlertCircle, Shield } from 'lucide-react'

function CaptchaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const captchaRef = useRef<HTMLCanvasElement>(null)

  const [captchaCode, setCaptchaCode] = useState('')
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [verified, setVerified] = useState(false)

  const action = searchParams.get('action') || 'verify'
  const returnUrl = searchParams.get('return') || '/'

  // Generate random CAPTCHA code
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptchaCode(code)
    setUserInput('')
    setError('')
    setVerified(false)
    
    // Draw CAPTCHA on canvas
    setTimeout(() => {
      drawCaptcha(code)
    }, 100)
  }

  const drawCaptcha = (code: string) => {
    const canvas = captchaRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add noise
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1)`
      ctx.beginPath()
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`
      ctx.beginPath()
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.stroke()
    }

    // Draw text
    ctx.font = 'bold 28px Arial'
    ctx.textBaseline = 'middle'
    
    const startX = 20
    const charWidth = (canvas.width - startX * 2) / code.length

    for (let i = 0; i < code.length; i++) {
      const char = code[i]
      ctx.save()
      
      // Random position and rotation
      const x = startX + i * charWidth + charWidth / 2
      const y = canvas.height / 2 + (Math.random() - 0.5) * 10
      const rotation = (Math.random() - 0.5) * 0.4
      
      ctx.translate(x, y)
      ctx.rotate(rotation)
      
      // Random color
      ctx.fillStyle = `rgb(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 150})`
      ctx.fillText(char, -charWidth / 2, 0)
      
      ctx.restore()
    }
  }

  useEffect(() => {
    generateCaptcha()
  }, [])

  const handleVerify = () => {
    setError('')

    if (!userInput) {
      setError('Please enter the characters shown in the image')
      return
    }

    setLoading(true)

    // Simulate verification (in production, this would be server-side)
    setTimeout(() => {
      if (userInput.toLowerCase() === captchaCode.toLowerCase()) {
        setVerified(true)
        setError('')
        
        // Store verification in session
        sessionStorage.setItem('captchaVerified', 'true')
        sessionStorage.setItem('captchaTimestamp', Date.now().toString())
        
        setTimeout(() => {
          router.push(decodeURIComponent(returnUrl))
        }, 1000)
      } else {
        setError('Incorrect characters. Please try again.')
        setLoading(false)
        generateCaptcha()
      }
    }, 500)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              {verified ? (
                <CheckCircle className="h-10 w-10 text-green-600" />
              ) : (
                <Shield className="h-10 w-10 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {verified ? 'Verified!' : 'Security Check'}
            </CardTitle>
            <CardDescription>
              {verified 
                ? 'You have successfully completed the security verification'
                : 'Please complete the CAPTCHA to continue'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!verified && (
              <div className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-center block">
                    Enter the characters you see
                  </Label>
                  
                  <div className="space-y-3">
                    {/* CAPTCHA Canvas */}
                    <div className="flex justify-center">
                      <div className="relative inline-block">
                        <canvas
                          ref={captchaRef}
                          width={300}
                          height={80}
                          className="border rounded-lg"
                        />
                        <button
                          onClick={generateCaptcha}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors"
                          title="Refresh CAPTCHA"
                          disabled={loading}
                        >
                          <RefreshCw className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>

                    {/* Input */}
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Enter the code"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !loading && handleVerify()}
                        className="w-full px-4 py-3 border rounded-md text-center text-lg tracking-widest uppercase"
                        maxLength={6}
                        autoFocus
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <h4 className="text-sm font-medium">Tips:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Enter all characters exactly as shown</li>
                      <li>• Case doesn't matter (a = A)</li>
                      <li>• If you can't read it, click the refresh icon</li>
                      <li>• Make sure your browser allows JavaScript</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={handleVerify} className="w-full" disabled={loading || !userInput}>
                    {loading ? 'Verifying...' : 'Verify'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => router.back()}
                    className="w-full"
                  >
                    Go Back
                  </Button>
                </div>
              </div>
            )}

            {verified && (
              <div className="text-center space-y-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-sm text-green-800">
                    Your security verification has been completed successfully.
                  </p>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Redirecting you to continue...
                </p>
              </div>
            )}

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                This security check helps prevent automated abuse and protects our community.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CaptchaPage() {
  return (
    <PageLayout>
      <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading security check...</div>}>
        <CaptchaContent />
      </Suspense>
    </PageLayout>
  )
}

// Simple Label component for inline use
function Label({ children, className, htmlFor }: { children: React.ReactNode; className?: string; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className={`text-sm font-medium leading-none ${className || ''}`}>
      {children}
    </label>
  )
}
