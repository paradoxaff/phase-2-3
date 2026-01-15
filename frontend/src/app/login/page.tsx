'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../services/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/tasks');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      backgroundColor: '#1f2937' // gray-800 equivalent
    }}>
      <div style={{
        backgroundColor: '#1f2937', // gray-800 equivalent
        padding: '2rem',
        borderRadius: '0.5rem',
        width: '100%',
        maxWidth: '24rem' // max-w-md
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            backgroundColor: '#e5e7eb', // gray-200
            border: '2px dashed #9ca3af', // gray-400
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }} />
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>Login</h1>
          <p style={{ color: '#9ca3af' }}>Sign in to your account</p>
        </div>

        {error && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '0.75rem',
            backgroundColor: '#7f1d1d', // red-900
            color: '#fed7d7', // red-100
            borderRadius: '0.375rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.5rem' }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#374151', // gray-700
                border: '1px solid #4b5563', // gray-600
                borderRadius: '0.5rem',
                color: 'white'
              }}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>
                Password
              </label>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#374151', // gray-700
                border: '1px solid #4b5563', // gray-600
                borderRadius: '0.5rem',
                color: 'white'
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: loading ? '#4b5563' : '#2563eb', // gray-600 or blue-600
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#9ca3af' }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}