'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { getUsers, saveUsers } from '@/lib/store';
import type { User } from '@/types';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const users = getUsers();
    const updated = users.map(u => {
      if (u.id === user.id) {
        return { ...u, name, email, ...(password ? { password } : {}) };
      }
      return u;
    });
    saveUsers(updated);
    setMessage('Profile updated');
    setPassword('');
  };

  if (!user) {
    return (
      <div className="text-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <form onSubmit={handleSubmit} className="bg-white border rounded p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password (optional)</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full border rounded px-3 py-2" placeholder="Leave blank to keep current" />
        </div>
        {message && <p className="text-green-600 text-sm">{message}</p>}
        <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded">Save Changes</button>
      </form>
    </div>
  );
}
