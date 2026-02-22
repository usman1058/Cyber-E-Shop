'use client';

import Link from 'next/link';
import { Search, Home, ArrowLeft, ShoppingBag, HelpCircle, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { PageLayout } from '@/components/layout/page-layout';
import { motion } from 'framer-motion';

export default function NotFound() {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchInput = (e.currentTarget as HTMLFormElement).querySelector('input');
    const query = searchInput?.value;
    if (query) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <PageLayout>
      <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-20 relative overflow-hidden">
        {/* Abstract Background Decorations */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-700" />

        <div className="w-full max-w-4xl relative z-10">
          <div className="text-center space-y-8">
            {/* Animated 404 Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative inline-block"
            >
              <h1 className="text-[12rem] font-black leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/40 select-none">
                404
              </h1>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-full flex justify-center opacity-10"
                >
                  <Sparkles className="w-64 h-64 text-primary" />
                </motion.div>
              </div>
              <p className="text-2xl font-medium tracking-wide uppercase text-muted-foreground mt-[-2rem]">
                Lost in Cyberspace
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="max-w-xl mx-auto space-y-6"
            >
              <h2 className="text-3xl font-bold tracking-tight">Oops! This page has vanished.</h2>
              <p className="text-lg text-muted-foreground">
                The content you're looking for might have moved home or been upgraded.
                Don't worry, even the best explorers take a wrong turn sometimes.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-xl blur transition duration-500 group-hover:duration-200 group-hover:opacity-100 opacity-50" />
                <div className="relative flex gap-2 p-2 bg-card border rounded-xl shadow-sm">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="What were you searching for?"
                      className="pl-12 h-12 border-none focus-visible:ring-0 text-lg bg-transparent"
                    />
                  </div>
                  <Button type="submit" size="lg" className="rounded-lg px-8">
                    Find It
                  </Button>
                </div>
              </form>
            </motion.div>

            {/* Quick Navigation Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="grid gap-6 sm:grid-cols-3 pt-8"
            >
              {[
                { label: 'Browse Store', icon: ShoppingBag, href: '/products', color: 'text-blue-500' },
                { label: 'Help Center', icon: HelpCircle, href: '/help-center', color: 'text-primary' },
                { label: 'Return Home', icon: Home, href: '/', color: 'text-emerald-500' }
              ].map((item, idx) => (
                <Link key={idx} href={item.href}>
                  <Card className="hover:border-primary/50 transition-colors group cursor-pointer overflow-hidden relative">
                    <CardContent className="p-6 flex flex-col items-center gap-4">
                      <div className={`p-4 rounded-full bg-muted group-hover:bg-primary/5 transition-colors ${item.color}`}>
                        <item.icon className="h-8 w-8" />
                      </div>
                      <div className="flex items-center gap-1 font-semibold group-hover:text-primary transition-colors">
                        {item.label}
                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
