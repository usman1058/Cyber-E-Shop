'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export function SplashLoader() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 1200) // Reduced from 2500ms for snappier feel
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          <div className="relative flex flex-col items-center">
            {/* Animated Logo Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 1,
                ease: 'circOut',
              }}
              className="mb-8 flex items-center gap-3 text-4xl font-bold tracking-tighter"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 0 0px rgba(var(--primary-rgb), 0)',
                    '0 0 0 20px rgba(var(--primary-rgb), 0)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl"
              >
                <motion.span
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 1.2, ease: 'backOut' }}
                >
                  C
                </motion.span>
              </motion.div>
              <div className="flex overflow-hidden">
                <motion.span
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                  className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
                >
                  CYBER
                </motion.span>
                <motion.span
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                  className="ml-2"
                >
                  SHOP
                </motion.span>
              </div>
            </motion.div>

            {/* Loading Bar */}
            <div className="relative h-1 w-64 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ left: '-100%' }}
                animate={{ left: '100%' }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute top-0 h-full w-full bg-gradient-to-r from-transparent via-primary to-transparent"
              />
            </div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-4 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground"
            >
              Initializing Secure Session
            </motion.p>
          </div>

          {/* Decorative Background Elements */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -top-[20%] -left-[10%] h-[60%] w-[60%] rounded-full bg-primary/20 blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 7, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-[20%] -right-[10%] h-[50%] w-[50%] rounded-full bg-primary/10 blur-[100px]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
