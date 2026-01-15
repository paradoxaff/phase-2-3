'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../services/auth';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/tasks'); // Redirect to tasks instead of dashboard
    }
  }, [isAuthenticated, router]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to the Todo App</h1>
      <p>Your secure todo application with user authentication</p>
      <div style={{ marginTop: '2rem' }}>
        <Link href="/login" style={{ marginRight: '1rem', textDecoration: 'underline' }}>
          Login
        </Link>
        <Link href="/register" style={{ textDecoration: 'underline' }}>
          Register
        </Link>
      </div>
    </div>
  );
}