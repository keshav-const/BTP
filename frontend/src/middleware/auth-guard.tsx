'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';

interface AuthGuardProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, adminOnly = false }) => {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    let shouldRedirect = false;
    let redirectPath = '';

    if (!isAuthenticated) {
      shouldRedirect = true;
      redirectPath = '/login';
    } else if (adminOnly && !isAdmin) {
      shouldRedirect = true;
      redirectPath = '/';
    }

    if (shouldRedirect) {
      router.push(redirectPath);
      return;
    }

    setIsChecking(false);
  }, [isAuthenticated, isAdmin, adminOnly, isLoading, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return children;
};
