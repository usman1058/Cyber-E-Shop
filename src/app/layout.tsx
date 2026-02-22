import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SplashLoader } from "@/components/ui/splash-loader";
import { PageTransitionLoader } from "@/components/ui/page-transition-loader";
import { CartProvider } from "@/providers/cart-provider";
import { CurrencyProvider } from "@/providers/currency-provider";
import { AddedToCartModal } from "@/components/shop/added-to-cart-modal";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CyberShop - Premium Electronics & Tech",
  description: "Modern e-commerce platform for high-end gadgets and electronics.",
  keywords: ["E-commerce", "Next.js", "Electronics", "Tech", "CyberShop"],
  icons: {
    icon: "https://cyber-e-shop.vercel.app/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <CurrencyProvider>
          <CartProvider>
            <SplashLoader />
            <Suspense fallback={null}>
              <PageTransitionLoader />
            </Suspense>
            {children}
            <Toaster />
            <AddedToCartModal />
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
