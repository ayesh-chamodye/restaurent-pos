'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';

export default function UsersPageClient({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [form, setForm] = useState({ name: '', email: '', role: 'cashier' as User['role'] });

  const load = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('profiles').select('*');
    setUsers((data || []).map((row: any) => ({ id: row.id, name: row.name, email: row.email, role: row.role, pin: '', createdAt: row.created_at })));
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    await supabase.from('profiles').insert({ ...form, id: crypto.randomUUID() });
    setForm({ name: '', email: '', role: 'cashier' });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <form onSubmit={add} className="bg-white border rounded-2xl p-5 mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" className="border rounded-xl px-3 py-2" required />
        <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="border rounded-xl px-3 py-2" required />
        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as User['role'] })} className="border rounded-xl px-3 py-2">
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="cashier">Cashier</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white rounded-xl px-4 py-2">Add</button>
      </form>
      <div className="bg-white border rounded-2xl divide-y">
        {users.map(u => (
          <div key={u.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-xs text-gray-500">{u.email}</p>
            </div>
            <span className="badge bg-gray-100 text-gray-700 capitalize">{u.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
