'use client'

import React from 'react'
import Link from 'next/link'
import { Check, ShoppingCart, ArrowRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog'
import { useCart } from '@/hooks/use-cart'

export function AddedToCartModal() {
  const { isModalOpen, setIsModalOpen, lastAddedItem } = useCart()

  if (!lastAddedItem) return null

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none bg-background shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Check className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-bold">Added to Cart!</DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-6 pt-4">
          <div className="flex gap-4 p-4 rounded-xl bg-muted/30 border border-muted">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-white shadow-sm">
              <img 
                src={lastAddedItem.image} 
                alt={lastAddedItem.name} 
                className="h-full w-full object-contain p-1"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <h4 className="font-semibold text-foreground line-clamp-1">{lastAddedItem.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Qty: {lastAddedItem.quantity} • ${lastAddedItem.price.toFixed(2)}
              </p>
              <p className="text-base font-bold text-primary mt-1">
                Total: ${(lastAddedItem.price * lastAddedItem.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 p-6 pt-2 bg-muted/20">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto" 
            onClick={() => setIsModalOpen(false)}
          >
            Continue Shopping
          </Button>
          <Button 
            className="w-full sm:w-auto flex items-center gap-2" 
            asChild
          >
            <Link href="/cart">
              <ShoppingCart className="h-4 w-4" />
              View Cart
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
