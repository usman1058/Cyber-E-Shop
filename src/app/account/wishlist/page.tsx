'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountWishlistRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/wishlist');
  }, [router]);
  return null;
}
