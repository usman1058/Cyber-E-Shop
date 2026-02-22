'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  MessageSquare,
  Package,
  Settings,
  Percent,
  BarChart3,
  Truck,
  Database,
  ShieldCheck,
  Zap,
  Tag,
  Boxes,
  Users2,
  Ticket,
  Bot,
  TestTube2,
  Search,
  History,
  Lock,
  ChevronRight,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface SidebarItem {
  icon: any
  label: string
  href: string
}

interface SidebarGroup {
  label: string
  items: SidebarItem[]
}

const adminGroups: SidebarGroup[] = [
  {
    label: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
      { icon: Zap, label: 'Main', href: '/admin/home' },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { icon: Package, label: 'Products', href: '/admin/products' },
      { icon: Tag, label: 'Categories', href: '/admin/categories' },
      { icon: Boxes, label: 'Inventory', href: '/admin/inventory' },
      { icon: Users2, label: 'Vendors', href: '/admin/vendors' },
    ],
  },
  {
    label: 'Sales & Logistics',
    items: [
      { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
      { icon: Truck, label: 'Shipments', href: '/admin/shipments' },
      { icon: Database, label: 'Payments', href: '/admin/payments' },
      { icon: Percent, label: 'Pricing', href: '/admin/pricing' },
    ],
  },
  {
    label: 'Customer Engagement',
    items: [
      { icon: Users, label: 'Users', href: '/admin/users' },
      { icon: ShieldCheck, label: 'Roles', href: '/admin/roles' },
      { icon: Ticket, label: 'Tickets', href: '/admin/tickets' },
      { icon: MessageSquare, label: 'Chat', href: '/admin/chat' },
      { icon: Bot, label: 'Chatbot', href: '/admin/chatbot' },
    ],
  },
  {
    label: 'Analytics & Growth',
    items: [
      { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
      { icon: History, label: 'Reports', href: '/admin/reports' },
      { icon: TestTube2, label: 'A/B Testing', href: '/admin/ab-testing' },
    ],
  },
  {
    label: 'System & Security',
    items: [
      { icon: Settings, label: 'General Settings', href: '/admin/settings' },
      { icon: Lock, label: 'System', href: '/admin/system' },
      { icon: Database, label: 'Backup', href: '/admin/backup' },
    ],
  },
]

export function AdminSidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (val: boolean) => void }) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r transition-all duration-300 lg:relative",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {isOpen ? (
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            CYBER ADMIN
          </span>
        ) : (
          <div className="mx-auto text-2xl font-bold text-primary">C</div>
        )}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-6">
          {adminGroups.map((group, idx) => (
            <div key={idx} className="space-y-2">
              {isOpen && (
                <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {group.label}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive ? 'secondary' : 'ghost'}
                        className={cn(
                          "w-full justify-start group relative transition-all duration-200",
                          !isOpen && "px-0 justify-center h-12"
                        )}
                        onClick={() => {
                          if (window.innerWidth < 1024) setIsOpen(false)
                        }}
                      >
                        <item.icon className={cn(
                          "h-5 w-5 transition-transform",
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                          !isOpen && "h-6 w-6"
                        )} />
                        {isOpen && <span className="ml-3 truncate">{item.label}</span>}
                        {isActive && isOpen && <ChevronRight className="ml-auto h-4 w-4 text-primary" />}
                        
                        {/* Tooltip for collapsed state */}
                        {!isOpen && (
                          <div className="absolute left-full ml-2 hidden scale-0 group-hover:scale-100 transition-all origin-left z-50 px-2 py-1 bg-popover text-popover-foreground border rounded shadow-md text-sm whitespace-nowrap lg:block">
                            {item.label}
                          </div>
                        )}
                      </Button>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Footer / Logout action placeholder */}
      <div className="p-4 border-t">
        <Button variant="ghost" className={cn("w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive", !isOpen && "justify-center px-0")}>
          <Lock className="h-5 w-5" />
          {isOpen && <span className="ml-3">Lock Session</span>}
        </Button>
      </div>
    </aside>
  )
}
