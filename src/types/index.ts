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
  customizations?: string[];
}

export interface Order {
  id: string;
  table_id?: string;
  table_number?: number;
  customer_name?: string;
  customer_count?: number;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  payment_method: 'cash' | 'card' | 'mobile';
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DailyReport {
  date: string;
  totalSales: number;
  totalOrders: number;
  totalItems: number;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  current_order_id?: string;
  created_at: string;
}
