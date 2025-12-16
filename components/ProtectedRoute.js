// components/ProtectedRoute.js
'use client';

import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  console.log(user);


  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (requireAdmin && !(user.role === 'admin' || user.isAdmin)) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router, requireAdmin]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || (requireAdmin && !(user.role === 'admin' || user.isAdmin))) {
    return null;
  }

  return <>{children}</>;
}