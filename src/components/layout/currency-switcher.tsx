'use client'

import * as React from 'react'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { useCurrency } from '@/hooks/use-currency'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const currencies: { name: string; code: 'PKR' | 'USD' | 'EUR' | 'GBP'; symbol: string }[] = [
    { name: 'Pakistani Rupee', code: 'PKR', symbol: 'Rs' },
    { name: 'US Dollar', code: 'USD', symbol: '$' },
    { name: 'Euro', code: 'EUR', symbol: '€' },
    { name: 'British Pound', code: 'GBP', symbol: '£' },
]

export function CurrencySwitcher() {
    const { currency, setCurrency } = useCurrency()

    const current = currencies.find((c) => c.code === currency) || currencies[0]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-2 px-2 hover:bg-accent/50 transition-all">
                    <Globe className="h-4 w-4 opacity-70" />
                    <span className="font-bold text-xs">{current.code} ({current.symbol})</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-1">
                {currencies.map((c) => (
                    <DropdownMenuItem
                        key={c.code}
                        onClick={() => setCurrency(c.code)}
                        className="flex items-center justify-between py-2 cursor-pointer"
                    >
                        <div className="flex flex-col">
                            <span className="font-semibold text-sm">{c.name}</span>
                            <span className="text-xs text-muted-foreground">{c.code}</span>
                        </div>
                        {currency === c.code && <Check className="h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
