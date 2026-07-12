'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, ProductCategory } from '@/types';

const demoProducts: Product[] = [
  { id: 'p1', name: 'Gibson', price: 13.98, stock: 50, categoryId: 'c1', barcode: '12345', unit: 'piece', cost: 6.5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'p2', name: 'Soup of the day', price: 4.59, stock: 20, categoryId: 'c2', barcode: '12346', unit: 'bowl', cost: 2.0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'p3', name: 'Caesar Salad', price: 18.5, stock: 35, categoryId: 'c1', barcode: '12347', unit: 'plate', cost: 7.0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'p4', name: 'Pasta Carbonara', price: 22.0, stock: 25, categoryId: 'c1', barcode: '12348', unit: 'plate', cost: 9.5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'p5', name: 'Iced Lemon Tea', price: 5.5, stock: 100, categoryId: 'c3', barcode: '12349', unit: 'glass', cost: 1.2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];
const demoCategories: ProductCategory[] = [
  { id: 'c1', name: 'Main Course', description: '' },
  { id: 'c2', name: 'Soup', description: '' },
  { id: 'c3', name: 'Beverages', description: '' },
];

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [categories, setCategories] = useState<ProductCategory[]>(demoCategories);
  const [form, setForm] = useState({ name: '', category_id: '', price: 0, cost: 0, stock: 0, unit: 'piece', barcode: '' });

  const load = async () => {
    if (!supabase) {
      setProducts(demoProducts);
      setCategories(demoCategories);
      return;
    }
    const { data: prods } = await supabase.from('products').select('*').order('name');
    setProducts(prods || []);
    const { data: cats } = await supabase.from('categories').select('*').order('name');
    setCategories(cats || []);
  };

  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      const newProduct: Product = {
        id: crypto.randomUUID().slice(0, 8),
        name: form.name,
        price: form.price,
        stock: form.stock,
        categoryId: form.category_id,
        barcode: form.barcode,
        unit: form.unit,
        cost: form.cost,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProducts(prev => [...prev, newProduct]);
      setForm({ name: '', category_id: '', price: 0, cost: 0, stock: 0, unit: 'piece', barcode: '' });
      return;
    }
    await supabase.from('products').insert({ ...form, id: crypto.randomUUID().slice(0, 8) });
    setForm({ name: '', category_id: '', price: 0, cost: 0, stock: 0, unit: 'piece', barcode: '' });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inventory</h1>
      <form onSubmit={add} className="bg-white border rounded-2xl p-5 mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" className="border rounded-xl px-3 py-2" required />
        <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="border rounded-xl px-3 py-2">
          <option value="">Category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} placeholder="Price" className="border rounded-xl px-3 py-2" />
        <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} placeholder="Stock" className="border rounded-xl px-3 py-2" />
        <button type="submit" className="bg-blue-600 text-white rounded-xl px-4 py-2 col-span-full md:col-span-1">Add</button>
      </form>
      <div className="bg-white border rounded-2xl divide-y">
        {products.map(p => (
          <div key={p.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-gray-500">{categories.find(c => c.id === p.categoryId)?.name || '—'} • ${p.price.toFixed(2)}</p>
            </div>
            <span className="text-sm text-gray-600">Stock: {p.stock}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
