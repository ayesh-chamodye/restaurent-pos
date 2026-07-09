export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier' | 'manager';
  pin: string;
  createdAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  cost: number;
  stock: number;
  barcode?: string;
  image?: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'mobile';
  cashierId: string;
  cashierName: string;
  createdAt: string;
}

export interface DailyReport {
  date: string;
  totalSales: number;
  totalOrders: number;
  totalItems: number;
}
