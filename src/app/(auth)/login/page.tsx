'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = login(pin);
    if (user) {
      router.push('/dashboard');
    } else {
      setError('Invalid PIN');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Restaurant POS Login</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <label className="block mb-2 text-sm font-medium">PIN</label>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Enter PIN"
          required
        />
        <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          Login
        </button>
        <p className="text-xs text-gray-500 mt-4 text-center">Demo PINs: 1234 (admin), 1111 (cashier)</p>
      </form>
    </div>
  );
}
