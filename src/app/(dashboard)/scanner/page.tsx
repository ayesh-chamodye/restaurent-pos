'use client';

import { useState } from 'react';
import type { Product } from '@/types';
import { getProducts, seedData } from '@/lib/store';

export default function ScannerPage() {
  const [products] = useState<Product[]>(() => {
    seedData();
    return getProducts();
  });
  const [barcode, setBarcode] = useState('');
  const [result, setResult] = useState<Product | null>(null);
  const [error, setError] = useState('');

  const handleScan = () => {
    setError('');
    setResult(null);
    if (!barcode.trim()) {
      setError('Please enter a barcode');
      return;
    }
    const product = products.find(p => p.barcode === barcode.trim());
    if (product) {
      setResult(product);
    } else {
      setError('Product not found');
    }
  };

  const handleCameraScan = () => {
    const mode = 'environment';
    window.open(`https://barcode.tec-it.com/en/?data=${encodeURIComponent(barcode)}&barcode=CODE128&mode=camera&camera=${mode}`, '_blank');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Barcode Scanner</h1>
      <div className="bg-white border rounded p-6 max-w-md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Barcode</label>
            <input type="text" value={barcode} onChange={e => setBarcode(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Scan or enter barcode" />
          </div>
          <div className="flex gap-4">
            <button onClick={handleScan} className="flex-1 bg-blue-600 text-white py-2 rounded">Search Product</button>
            <button onClick={handleCameraScan} className="bg-gray-200 px-4 py-2 rounded">Open Camera Scanner</button>
          </div>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {result && (
          <div className="mt-6 p-4 border rounded bg-gray-50">
            <h3 className="text-lg font-bold">{result.name}</h3>
            <p className="text-gray-600">Price: ${result.price.toFixed(2)}</p>
            <p className="text-gray-600">Stock: {result.stock} {result.unit}</p>
            <p className="text-sm text-gray-400">Barcode: {result.barcode}</p>
          </div>
        )}
      </div>
    </div>
  );
}
