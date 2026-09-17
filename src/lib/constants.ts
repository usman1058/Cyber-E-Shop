export const SHIPPING_CONFIG = {
  freeThreshold: 50,
  standardCost: 5.99,
  expressCost: 12.99,
  nextDayCost: 24.99,
} as const

export const TAX_CONFIG = {
  rate: 0.08,
} as const

export const CURRENCY_CONFIG = {
  base: 'USD' as const,
  supported: ['USD', 'PKR', 'EUR', 'GBP'] as const,
  default: 'USD' as const,
  locale: 'en-US' as const,
} as const

export function calculateShipping(subtotal: number): number {
  return subtotal >= SHIPPING_CONFIG.freeThreshold ? 0 : SHIPPING_CONFIG.standardCost
}

export function calculateTax(subtotal: number): number {
  return subtotal * TAX_CONFIG.rate
}

export function calculateTotal(subtotal: number, shipping?: number): number {
  const shippingCost = shipping ?? calculateShipping(subtotal)
  const tax = calculateTax(subtotal)
  return subtotal + shippingCost + tax
}