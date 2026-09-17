"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

type Currency = 'USD' | 'PKR' | 'EUR' | 'GBP'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (c: Currency) => void
  exchangeRates: Record<Currency, number>
  formatPrice: (amount: number, fromCurrency?: Currency) => string
  isLoading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const DEFAULT_RATES: Record<Currency, number> = {
  USD: 1,
  PKR: 280,
  EUR: 0.92,
  GBP: 0.79,
}

const LOCALE_MAP: Record<Currency, string> = {
  USD: 'en-US',
  PKR: 'en-PK',
  EUR: 'de-DE',
  GBP: 'en-GB',
}

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>('USD')
  const [exchangeRates, setExchangeRates] = useState<Record<Currency, number>>(DEFAULT_RATES)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('eshop_currency') as Currency
    if (saved && saved in DEFAULT_RATES) setCurrencyState(saved)

    const fetchRates = async () => {
      try {
        const res = await fetch('/api/currency')
        const data = await res.json()
        if (data.rates) {
          setExchangeRates(prev => ({ ...prev, ...data.rates }))
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
    const baseAmount = amount / exchangeRates[fromCurrency]
    const targetAmount = baseAmount * exchangeRates[currency]
    
    return new Intl.NumberFormat(LOCALE_MAP[currency], {
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