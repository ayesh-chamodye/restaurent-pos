'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function ProfilePageClient({ initialUser }: { initialUser: { name: string; email: string } | null }) {
  const { user: authUser } = useAuth();
  const user = authUser || initialUser;
  const [name, setName] = useState(user?.name || '');
  const [message, setMessage] = useState('');

  const save = async () => {
    if (!user) return;
    if (supabase) await supabase.from('profiles').update({ name }).eq('email', user.email);
    setMessage('Profile updated');
  };

  if (!user) return <div className="text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <form onSubmit={(e) => { e.preventDefault(); save(); }} className="bg-white border rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-xl px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input value={user.email} readOnly className="w-full border rounded-xl px-3 py-2 bg-gray-50" />
        </div>
        {message && <p className="text-green-600 text-sm">{message}</p>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl">Save Changes</button>
      </form>
    </div>
  );
}
