'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { getUsers, saveUsers } from '@/lib/store';
import type { User } from '@/types';

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>(() => {
    const stored = getUsers();
    return stored;
  });
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'cashier' as User['role'],
    password: '',
  });

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'cashier', password: '' });
    setEditingUser(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      const updated = users.map(u =>
        u.id === editingUser.id ? { ...u, ...formData, pin: u.pin } : u
      );
      saveUsers(updated);
      setUsers(updated);
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        pin: '',
        createdAt: new Date().toISOString(),
      };
      const updated = [...users, newUser];
      saveUsers(updated);
      setUsers(updated);
    }
    resetForm();
  };

  const handleEdit = (u: User) => {
    setEditingUser(u);
    setFormData({ name: u.name, email: u.email, role: u.role, password: '' });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    saveUsers(users.filter(u => u.id !== id));
    setUsers(users.filter(u => u.id !== id));
  };

  if (user?.role !== 'admin') {
    return (
      <div className="text-center text-gray-500">
        You do not have permission to view this page.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add User
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded p-4 mb-6 space-y-4">
          <h2 className="text-lg font-semibold">{editingUser ? 'Edit User' : 'New User'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="border rounded px-3 py-2" required />
            <input placeholder="Email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="border rounded px-3 py-2" required />
            <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value as User['role'] })} className="border rounded px-3 py-2">
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="cashier">Cashier</option>
            </select>
            <input placeholder={editingUser ? 'New Password (optional)' : 'Password'} type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="border rounded px-3 py-2" required={!editingUser} />
          </div>
          <div className="flex gap-4">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              {editingUser ? 'Update' : 'Add'}
            </button>
            <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white border rounded">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2 capitalize">{u.role}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleEdit(u)} className="text-blue-600 mr-2">Edit</button>
                  <button onClick={() => handleDelete(u.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
