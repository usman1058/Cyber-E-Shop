'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, ShieldCheck, User, Lock, ArrowRight, Sparkles, Mail } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

interface CompleteProfileModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
  userName?: string
  tempPassword?: string
}

export function CompleteProfileModal({ isOpen, onClose, userEmail, userName, tempPassword }: CompleteProfileModalProps) {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Welcome, 2: Set Password
  const [formData, setFormData] = useState({
    name: userName || '',
    password: '',
    confirmPassword: '',
    verifyEmail: true,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      // API call to update profile
      const response = await fetch('/api/user/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          name: formData.name,
          password: formData.password,
          verifyEmail: formData.verifyEmail,
        }),
      })

      if (!response.ok) throw new Error('Failed to update profile')
      
      toast.success('Profile completed! Welcome to the family.')
      onClose()
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none bg-transparent shadow-none">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl border border-primary/10"
            >
              <div className="relative h-32 bg-primary flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-24 h-24 bg-white rounded-full -translate-x-12 -translate-y-12" />
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16" />
                </div>
                <Sparkles className="h-12 w-12 text-primary-foreground animate-pulse" />
              </div>

              <div className="p-6 space-y-6">
                <div className="text-center space-y-2">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">One last thing!</DialogTitle>
                    <DialogDescription className="text-center text-base">
                      We've created a secure account for you using <span className="font-bold text-foreground">{userEmail}</span>.
                    </DialogDescription>
                  </DialogHeader>
                  
                  {tempPassword && (
                    <div className="mt-4 p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Temporary Password</p>
                      <p className="text-xl font-mono font-bold text-primary">{tempPassword}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">We've also sent this to your email and notifications.</p>
                    </div>
                  )}
                </div>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Track your order in real-time</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Saved address for 1-click checkout</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Exclusive member-only deals</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button onClick={() => setStep(2)} className="w-full h-12 text-lg font-bold group">
                    Secure My Account
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="ghost" onClick={onClose} className="w-full text-muted-foreground">
                    I'll do it later
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl border border-primary/10"
            >
              <form onSubmit={handleComplete}>
                <div className="bg-muted/50 p-6 border-b">
                  <DialogHeader>
                    <DialogTitle>Complete Your Profile</DialogTitle>
                    <DialogDescription>
                      Set a password to access your account anytime.
                    </DialogDescription>
                  </DialogHeader>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" /> Full Name
                    </Label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="Enter your name" 
                      value={formData.name} 
                      onChange={handleInputChange}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" /> New Password
                    </Label>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      placeholder="••••••••" 
                      required 
                      value={formData.password} 
                      onChange={handleInputChange}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" /> Confirm Password
                    </Label>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      type="password" 
                      placeholder="••••••••" 
                      required 
                      value={formData.confirmPassword} 
                      onChange={handleInputChange}
                      className="h-11"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox 
                      id="verifyEmail" 
                      checked={formData.verifyEmail}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, verifyEmail: checked as boolean }))}
                    />
                    <label
                      htmlFor="verifyEmail"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Verify my email address now
                    </label>
                  </div>
                </div>

                <DialogFooter className="p-6 bg-muted/50 border-t sm:justify-between gap-3">
                  <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
                  <Button type="submit" loading={loading} className="px-8 h-11">Finish Setup</Button>
                </DialogFooter>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
