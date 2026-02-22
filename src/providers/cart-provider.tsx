'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useSession } from '@/hooks/use-session'
import { toast } from 'sonner'

export interface CartItem {
    id: string
    productId: string
    name: string
    slug: string
    price: number
    comparePrice?: number
    image: string
    quantity: number
    stock: number
    category?: string
    brand?: string
    addedDate?: string
}

export interface CartSummary {
    subtotal: number
    shipping: number
    tax: number
    total: number
    savings: number
}

interface CartContextType {
    cartItems: CartItem[]
    summary: CartSummary
    loading: boolean
    addItem: (product: any, quantity?: number) => Promise<void>
    updateQuantity: (itemId: string, quantity: number) => Promise<void>
    removeItem: (itemId: string) => Promise<void>
    refreshCart: () => Promise<void>
    lastAddedItem: CartItem | null
    isModalOpen: boolean
    setIsModalOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { session, guestId } = useSession()
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [summary, setSummary] = useState<CartSummary>({
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        savings: 0,
    })
    const [loading, setLoading] = useState(false)
    const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchCart = useCallback(async () => {
        if (!session?.user?.id && !guestId) return

        setLoading(true)
        try {
            const url = `/api/cart?userId=${session?.user?.id || ''}&sessionId=${guestId || ''}`
            const response = await fetch(url)
            const data = await response.json()

            if (data.success) {
                setCartItems(data.items || [])
                if (data.summary) {
                    setSummary(data.summary)
                }
            }
        } catch (error) {
            console.error('Error fetching cart:', error)
        } finally {
            setLoading(false)
        }
    }, [session?.user?.id, guestId])

    useEffect(() => {
        fetchCart()
    }, [fetchCart])

    const addItem = async (product: any, quantity: number = 1) => {
        try {
            setLoading(true)
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: session?.user?.id,
                    sessionId: guestId,
                    productId: product.id,
                    quantity,
                }),
            })

            const data = await response.json()

            if (data.success) {
                await fetchCart()
                setLastAddedItem({
                    id: data.cartItemId || Math.random().toString(),
                    productId: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    image: Array.isArray(product.images) ? product.images[0] : product.image,
                    quantity,
                    stock: product.stock,
                })
                setIsModalOpen(true)
                toast.success(`'${product.name}' added to cart!`)
            } else {
                toast.error(data.error || 'Failed to add to cart')
            }
        } catch (error) {
            console.error('Add item error:', error)
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const updateQuantity = async (itemId: string, quantity: number) => {
        try {
            const response = await fetch('/api/cart', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cartItemId: itemId,
                    quantity,
                }),
            })

            const data = await response.json()

            if (data.success) {
                await fetchCart()
            } else {
                toast.error(data.error || 'Failed to update quantity')
            }
        } catch (error) {
            console.error('Update quantity error:', error)
            toast.error('Something went wrong')
        }
    }

    const removeItem = async (itemId: string) => {
        try {
            const response = await fetch(`/api/cart?cartItemId=${itemId}`, {
                method: 'DELETE',
            })

            const data = await response.json()

            if (data.success) {
                await fetchCart()
                toast.success('Item removed from cart')
            } else {
                toast.error(data.error || 'Failed to remove item')
            }
        } catch (error) {
            console.error('Remove item error:', error)
            toast.error('Something went wrong')
        }
    }

    return (
        <CartContext.Provider
            value={{
                cartItems,
                summary,
                loading,
                addItem,
                updateQuantity,
                removeItem,
                refreshCart: fetchCart,
                lastAddedItem,
                isModalOpen,
                setIsModalOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
