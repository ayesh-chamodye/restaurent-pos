'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';
import { Search, Trash2, ShoppingCart, XCircle } from 'lucide-react';

const demoProduct: Product = { id: 'p1', name: 'Gibson', price: 13.98, stock: 50, categoryId: 'c1', barcode: '12345', unit: 'piece', cost: 6.5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

export default function ScannerPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      setCode(prev => prev + e.key);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const search = async () => {
    if (!supabase) {
      if (code === '12345') {
        setProduct(demoProduct);
        setCart(prev => [...prev, demoProduct]);
        setMessage('');
      } else {
        setProduct(null);
        setMessage('Not found');
      }
      setCode('');
      return;
    }
    const { data } = await supabase.from('products').select('*').eq('barcode', code).maybeSingle();
    setProduct(data || null);
    if (data) setCart(prev => [...prev, data]);
    else setMessage('Not found');
    setCode('');
  };

  const clear = () => { setCart([]); setProduct(null); setMessage(''); };
  const goToSales = () => router.push('/dashboard/sales');

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Scanner</h1>
      <div className="bg-white border rounded-2xl p-6">
        <div className="flex gap-3 mb-4">
          <input value={code} onChange={e => setCode(e.target.value)} placeholder="Scan barcode..." className="flex-1 border rounded-xl px-3 py-2" />
          <button onClick={search} className="bg-blue-600 text-white px-4 rounded-xl inline-flex items-center gap-2"><Search size={16} /> Search</button>
        </div>
        {message && <p className="text-sm text-red-600 mb-3">{message}</p>}
        {product && (
          <div className="border rounded-xl p-4 mb-4">
            <p className="font-semibold">{product.name}</p>
            <p className="text-sm text-gray-500">${product.price.toFixed(2)} • Stock: {product.stock}</p>
          </div>
        )}
        <div className="border rounded-xl divide-y">
          {cart.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
              </div>
              <button onClick={() => setCart(prev => prev.filter((_, i) => i !== idx))} className="text-red-600 inline-flex items-center gap-1"><Trash2 size={16} /> Remove</button>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={goToSales} className="flex-1 bg-blue-600 text-white py-2 rounded-xl inline-flex items-center justify-center gap-2"><ShoppingCart size={16} /> Go to sales</button>
          <button onClick={clear} className="flex-1 border rounded-xl py-2 inline-flex items-center justify-center gap-2"><XCircle size={16} /> Clear</button>
        </div>
      </div>
    </div>
  );
}
