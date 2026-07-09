'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, user: localUser, logout: localLogout } = useAuth();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.push('/dashboard');
    }
  }, [session, router]);

  useEffect(() => {
    if (localUser) {
      router.push('/dashboard');
    }
  }, [localUser, router]);

  if (status === 'loading' || localUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const found = login(pin);
    if (found) {
      router.push('/dashboard');
    } else {
      setError('Invalid PIN');
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white border rounded-xl shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-sm mx-auto mb-4">
            POS
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurant POS</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to continue</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 border rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-medium text-gray-700">Continue with Google</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with PIN</span>
            </div>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">
                PIN
              </label>
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="••••"
                required
                maxLength={10}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Login with PIN
            </button>
          </form>
        </div>

        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-gray-400 text-center">
            Demo PINs: <span className="font-mono">1234</span> (admin),{' '}
            <span className="font-mono">1111</span> (cashier)
          </p>
        </div>
      </div>
    </div>
  );
}
