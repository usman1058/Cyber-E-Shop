'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ShieldCheck, Zap } from 'lucide-react'

const MESSAGES = [
  'Initializing secure checkout...',
  'Verifying shipping details...',
  'Preparing payment gateway...',
  'Syncing order inventory...',
  'Optimizing your experience...',
]

export function useNavigationLoader() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const [message, setMessage] = useState(MESSAGES[0])

  const navigateWithLoader = (path: string) => {
    setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)])
    setIsNavigating(true)
    
    // Small delay to ensure loader is visible before navigation
    setTimeout(() => {
      router.push(path)
    }, 50)
  }

  const LoaderComponent = () => (
    <AnimatePresence mode="wait">
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md"
        >
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
                className="font-bold text-xl tracking-tight text-foreground"
              >
                {message}
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
        </motion.div>
      )}
    </AnimatePresence>
  )

  return {
    navigateWithLoader,
    LoaderComponent,
    isNavigating,
  }
}
