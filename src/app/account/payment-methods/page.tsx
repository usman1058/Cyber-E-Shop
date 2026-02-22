'use client'

import { useState, useEffect } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CreditCard, DollarSign, Trash2, Plus, Check, AlertCircle, Info } from 'lucide-react'

export default function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    isDefault: false,
  })

  useEffect(() => {
    // Simulate fetching payment methods
    setPaymentMethods([
      {
        id: 'cod',
        type: 'COD',
        name: 'Cash on Delivery',
        description: 'Pay when you receive your order',
        isDefault: true,
        icon: <DollarSign className="h-8 w-8" />,
      },
    ])
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Add new payment method
      const newMethod = {
        id: Date.now().toString(),
        type: 'CARD',
        name: `**** **** **** ${formData.cardNumber.slice(-4)}`,
        cardHolder: formData.cardHolder,
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        isDefault: formData.isDefault,
      }

      setPaymentMethods([...paymentMethods, newMethod])
      setSuccess(true)
      setMessage('Payment method added successfully!')
      resetForm()
    } catch (err) {
      setMessage('Failed to add payment method. Please try again.')
    } finally {
      setLoading(false)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this payment method?')) return
    
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id))
    setSuccess(true)
    setMessage('Payment method removed successfully!')
    setTimeout(() => setSuccess(false), 3000)
  }

  const handleSetDefault = async (id: string) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })))
    setSuccess(true)
    setMessage('Default payment method updated!')
    setTimeout(() => setSuccess(false), 3000)
  }

  const resetForm = () => {
    setFormData({
      cardNumber: '',
      cardHolder: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      isDefault: false,
    })
    setShowAddForm(false)
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Payment Methods</h1>
            <p className="text-muted-foreground">
              Manage your payment options. Cash on Delivery is available by default.
            </p>
          </div>

          {message && (
            <Alert variant={success ? 'default' : 'destructive'} className="mb-6">
              {success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {/* COD Info */}
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-2">Cash on Delivery (COD)</h3>
                  <p className="text-sm text-green-800 mb-2">
                    Your default payment method. Pay with cash when your order is delivered.
                    No additional fees.
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="default" className="bg-green-600 text-white">Default</Badge>
                    <Badge variant="outline">No Bank API Required</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods List */}
          <div className="space-y-4 mb-6">
            {paymentMethods.map((pm) => (
              <Card key={pm.id} className={pm.isDefault ? 'border-primary' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-lg ${
                        pm.type === 'COD' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {pm.icon || <CreditCard className="h-8 w-8" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{pm.name}</h4>
                          {pm.isDefault && (
                            <Badge variant="default" className="bg-primary">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{pm.description}</p>
                        {pm.cardHolder && (
                          <p className="text-sm text-muted-foreground">{pm.cardHolder}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!pm.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(pm.id)}
                        >
                          Set Default
                        </Button>
                      )}
                      {pm.type !== 'COD' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(pm.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Payment Method Info */}
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Info className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-2">Need More Payment Options?</h3>
                  <p className="text-sm text-blue-800">
                    While Cash on Delivery is available and working perfectly, we're working on 
                    integrating additional payment methods (credit cards, digital wallets) in future updates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Payment Method Form */}
          {!showAddForm ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-3">
                  <h3 className="font-semibold text-lg">Add New Payment Method</h3>
                  <p className="text-sm text-muted-foreground">
                    For now, Cash on Delivery is your primary option. 
                    More payment methods coming soon!
                  </p>
                  <Button onClick={() => setShowAddForm(true)} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Credit/Debit Card
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Add New Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      This is a preview of the credit card form. Actual card processing 
                      will be integrated with a bank API in future updates.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      maxLength={19}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardHolder">Cardholder Name *</Label>
                    <Input
                      id="cardHolder"
                      placeholder="John Doe"
                      value={formData.cardHolder}
                      onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryMonth">Month *</Label>
                      <select
                        id="expiryMonth"
                        value={formData.expiryMonth}
                        onChange={(e) => setFormData({ ...formData, expiryMonth: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                      >
                        <option value="">MM</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryYear">Year *</Label>
                      <select
                        id="expiryYear"
                        value={formData.expiryYear}
                        onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                      >
                        <option value="">YY</option>
                        {Array.from({ length: 10 }, (_, i) => {
                          const year = new Date().getFullYear() + i
                          return (
                            <option key={year} value={String(year).slice(-2)}>
                              {String(year).slice(-2)}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="isDefault" className="cursor-pointer">
                      Set as default payment method
                    </Label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Adding...' : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Add Payment Method
                        </>
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
