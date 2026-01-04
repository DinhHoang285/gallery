'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/assets/providers/user.provider';
import { authService } from '@/assets/services';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { user, loading } = useUser();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Wait for user data to load
      if (loading) {
        return;
      }

      setIsChecking(false);

      // Check if user is authenticated
      if (!authService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      // Check if user exists
      if (!user) {
        router.push('/login');
        return;
      }

      // Check if user has admin role
      if (user.role !== 'admin') {
        console.warn('User does not have admin role:', user);
        router.push('/login');
        return;
      }
    };

    checkAuth();
  }, [user, loading, router]);

  // Show loading state while checking
  if (loading || isChecking) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Show nothing if not authenticated or not admin
  if (!authService.isAuthenticated() || !user || user.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}

