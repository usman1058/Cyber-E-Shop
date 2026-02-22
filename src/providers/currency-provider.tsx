"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

type Currency = 'PKR' | 'USD' | 'EUR' | 'GBP'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (c: Currency) => void
  exchangeRates: Record<Currency, number>
  formatPrice: (amount: number, fromCurrency?: Currency) => string
  isLoading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const DEFAULT_RATES: Record<Currency, number> = {
  PKR: 1,
  USD: 1 / 280, // Approximate fallback
  EUR: 1 / 300,
  GBP: 1 / 350,
}

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>('PKR')
  const [exchangeRates, setExchangeRates] = useState<Record<Currency, number>>(DEFAULT_RATES)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('eshop_currency') as Currency
    if (saved) setCurrencyState(saved)

    const fetchRates = async () => {
      try {
        const res = await fetch('/api/currency')
        const data = await res.json()
        if (data.rates) {
          setExchangeRates(data.rates)
        }
      } catch (err) {
        console.error('Failed to fetch currency rates:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRates()
  }, [])

  const setCurrency = (c: Currency) => {
    setCurrencyState(c)
    localStorage.setItem('eshop_currency', c)
  }

  const formatPrice = useCallback((amount: number, fromCurrency: Currency = 'USD') => {
    // Current assumption: Base pricing in DB is USD for stability, converted to PKR/others for display
    // But user wants PKR default. I'll assume input amount is the BASE value (USD) if not specified.
    // If user says "default in PKR", I should consider if prices in DB are USD or PKR.
    // Given the previous code used $, I'll assume DB is USD and we convert.
    
    // Convert from PKR (base) if we assume PKR as 1
    const pkrAmount = amount / exchangeRates[fromCurrency]
    const targetAmount = pkrAmount * exchangeRates[currency]
    
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(targetAmount)
  }, [currency, exchangeRates])

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRates, formatPrice, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider')
  return context
}
