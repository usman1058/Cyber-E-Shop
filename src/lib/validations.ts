import { z } from 'zod'

export const cartAddSchema = z.object({
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1).max(10).default(1),
})

export const cartUpdateSchema = z.object({
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  cartItemId: z.string().min(1, 'Cart item ID is required'),
  quantity: z.number().int().min(1).max(10),
})

export const cartDeleteSchema = z.object({
  cartItemId: z.string().min(1, 'Cart item ID is required'),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
})

export const checkoutSchema = z.object({
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  shippingAddress: z.object({
    fullName: z.string().min(1),
    phone: z.string().min(1),
    address: z.string().min(1),
    apartment: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1).default('USA'),
    email: z.string().email().optional(),
  }),
  shippingMethod: z.string().min(1),
  paymentMethod: z.string().min(1),
  promoCode: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().min(1),
    price: z.number().positive(),
  })).min(1),
  notes: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  captchaToken: z.string().optional(),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const addressSchema = z.object({
  userId: z.string().min(1),
  fullName: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  apartment: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1).default('USA'),
  isDefault: z.boolean().default(false),
})

export const paymentMethodSchema = z.object({
  userId: z.string().min(1),
  type: z.enum(['card', 'paypal', 'bank_transfer']),
  provider: z.string().optional(),
  last4: z.string().length(4).optional(),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
  isDefault: z.boolean().default(false),
})

export const wishlistSchema = z.object({
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  productId: z.string().min(1),
  priceAlert: z.boolean().optional(),
  stockAlert: z.boolean().optional(),
})

export const reviewSchema = z.object({
  productId: z.string().min(1),
  userId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  content: z.string().min(1, 'Review content is required'),
})

export const promoCodeSchema = z.object({
  promoCode: z.string().min(1, 'Promo code is required'),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
})