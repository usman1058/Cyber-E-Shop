'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useSearchParams } from 'next/navigation'
import { Loader2, ShieldCheck, Zap } from 'lucide-react'

const MESSAGES = [
  'Initializing secure checkout...',
  'Verifying shipping details...',
  'Preparing payment gateway...',
  'Syncing order inventory...',
  'Optimizing your experience...',
]

export function PageTransitionLoader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)

  const isCheckout = pathname.includes('/checkout')

  useEffect(() => {
    setIsLoading(true)
    setMessageIndex(Math.floor(Math.random() * MESSAGES.length))
    
    // Snappy standard load, longer premium load for checkout to show animation
    const duration = isCheckout ? 800 : 150
    
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [pathname, searchParams, isCheckout])

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[101] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md"
        >
          {isCheckout ? (
            <div className="flex flex-col items-center gap-6 text-center max-w-xs px-4">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full"
                />
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Zap className="h-8 w-8 text-primary fill-primary/20" />
                </motion.div>
              </div>

              <div className="space-y-2">
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  key={messageIndex}
                  className="font-bold text-xl tracking-tight text-foreground"
                >
                  {MESSAGES[messageIndex]}
                </motion.p>
                <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Secure Connection Established</span>
                </div>
              </div>

              {/* Progress Line */}
              <div className="w-48 h-1 bg-muted rounded-full overflow-hidden mt-2">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          ) : (
            <div className="h-1 w-full fixed top-0 left-0">
               <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
