// app/components/AuthGuard.js
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext';

export function withAuth(WrappedComponent) {
    return function AuthGuard(props) {
      const { isAuthenticated, loading, user } = useAuth();
      const router = useRouter();
  
      useEffect(() => {
        if (!loading && (!isAuthenticated || (props.adminOnly && !user?.isAdmin))) {
          router.replace('/login');
        }
      }, [isAuthenticated, loading, user, props.adminOnly, router]);
  
      if (loading) {
        return <div>Loading...</div>;
      }
  
      return isAuthenticated ? <WrappedComponent {...props} /> : null;
    };
  }


export function useRequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);

  return { isAuthenticated, loading };
}








  