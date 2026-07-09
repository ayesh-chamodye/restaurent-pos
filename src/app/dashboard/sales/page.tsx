'use client';

import { useState, useRef } from 'react';
import type { Product, CartItem, Order } from '@/types';
import { getProducts, saveProducts, saveOrders, getOrders, seedData } from '@/lib/store';
import { useAuth } from '@/lib/auth';

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>(() => {
    seedData();
    return getProducts();
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile'>('cash');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [receipt, setReceipt] = useState<Order | null>(null);
  const orderIdRef = useRef(0);
  const { user } = useAuth();

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode?.includes(search));

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(item => item.product.id === product.id);
      if (exists) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(prev => prev.map(item => item.product.id === id ? { ...item, quantity: qty } : item));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleBarcodeSearch = () => {
    const product = products.find(p => p.barcode === barcodeInput);
    if (product) {
      addToCart(product);
      setBarcodeInput('');
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    orderIdRef.current += 1;
    const orderId = `ORD-${orderIdRef.current}`;
    const order: Order = {
      id: orderId,
      items: [...cart],
      subtotal,
      tax,
      discount: 0,
      total,
      paymentMethod,
      cashierId: user!.id,
      cashierName: user!.name,
      createdAt: new Date().toISOString(),
    };
    saveOrders([...getOrders(), order]);
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(ci => ci.product.id === p.id);
      if (cartItem) return { ...p, stock: p.stock - cartItem.quantity };
      return p;
    });
    saveProducts(updatedProducts);
    setProducts(updatedProducts);
    setReceipt(order);
    setCart([]);
  };

  if (receipt) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Receipt</h1>
        <div className="bg-white border rounded p-6 max-w-md">
          <h2 className="text-xl font-bold mb-4">Restaurant POS</h2>
          <p className="text-sm text-gray-500 mb-2">Order #{receipt.id}</p>
          <p className="text-sm text-gray-500 mb-4">{new Date(receipt.createdAt).toLocaleString()}</p>
          <hr className="mb-4" />
          <ul className="space-y-2 mb-4">
            {receipt.items.map(item => (
              <li key={item.product.id} className="flex justify-between">
                <span>{item.product.name} x{item.quantity}</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <hr className="mb-4" />
          <p>Subtotal: ${receipt.subtotal.toFixed(2)}</p>
          <p>Tax: ${receipt.tax.toFixed(2)}</p>
          <p className="text-xl font-bold">Total: ${receipt.total.toFixed(2)}</p>
          <p className="mt-2">Payment: {receipt.paymentMethod.toUpperCase()}</p>
          <p>Cashier: {receipt.cashierName}</p>
          <button onClick={() => window.print()} className="mt-6 bg-black text-white px-4 py-2 rounded w-full">Print Receipt</button>
          <button onClick={() => setReceipt(null)} className="mt-4 bg-gray-400 text-white px-4 py-2 rounded w-full">New Order</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sales / POS</h1>
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search products or scan barcode..."
              className="border rounded px-3 py-2 flex-1"
              value={barcodeInput || search}
              onChange={(e) => { setBarcodeInput(e.target.value); setSearch(e.target.value); }}
            />
            <button onClick={handleBarcodeSearch} className="bg-blue-600 text-white px-4 rounded">
              Search
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(product => (
              <div key={product.id} onClick={() => addToCart(product)} className="bg-white border rounded p-4 cursor-pointer hover:shadow-lg">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-500">${product.price.toFixed(2)}</p>
                <p className="text-xs text-gray-400">Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-96 bg-white border rounded p-4">
          <h2 className="text-xl font-bold mb-4">Cart</h2>
          {cart.length === 0 ? <p>Cart is empty</p> : (
            <ul className="space-y-2 mb-4">
              {cart.map(item => (
                <li key={item.product.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">${item.product.price.toFixed(2)} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="number" value={item.quantity} onChange={e => updateQuantity(item.product.id, parseInt(e.target.value) || 1)} className="w-16 border rounded px-2 py-1" min="1" />
                    <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:text-red-700">×</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t pt-4 space-y-2">
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Tax: ${tax.toFixed(2)}</p>
            <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'card' | 'mobile')} className="w-full border rounded px-3 py-2">
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="mobile">Mobile</option>
            </select>
            <button onClick={handleCheckout} disabled={cart.length === 0} className="w-full bg-green-600 text-white py-2 rounded disabled:bg-gray-400">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
