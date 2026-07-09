'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, login, loading } = useAuth();

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = await login(email, password);
    if (ok) router.push('/dashboard');
    else setError('Invalid email or password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white border rounded-2xl shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm mx-auto mb-4">POS</div>
          <h1 className="text-2xl font-bold text-gray-900">Nearfood resto</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to continue</p>
        </div>
        <div className="space-y-4">
          <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })} className="w-full flex items-center justify-center gap-2 border rounded-xl px-4 py-2.5 hover:bg-gray-50">
            <span className="font-medium text-gray-700">Continue with Google</span>
          </button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with email</span></div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-3 py-2">{error}</div>}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-xl px-3 py-2" placeholder="you@example.com" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-xl px-3 py-2" placeholder="••••••••" required />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700">Sign In</button>
          </form>
        </div>
        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-gray-400 text-center">Demo: <span className="font-mono">admin@pos.com</span> / <span className="font-mono">admin123</span></p>
        </div>
      </div>
    </div>
  );
}
