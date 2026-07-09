'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const save = async () => {
    if (!user || !supabase) return;
    setLoading(true);
    await supabase.from('profiles').update({ name }).eq('id', user.id);
    setMessage('Saved');
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="bg-white border rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-xl px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input value={user?.email || ''} readOnly className="w-full border rounded-xl px-3 py-2 bg-gray-50" />
        </div>
        {message && <p className="text-green-600 text-sm">{message}</p>}
        <button onClick={save} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-xl">Save</button>
      </div>
    </div>
  );
}
