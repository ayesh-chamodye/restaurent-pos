import type { User, Product, ProductCategory, Order } from '@/types';

const KEYS = {
  users: 'pos_users',
  categories: 'pos_categories',
  products: 'pos_products',
  orders: 'pos_orders',
  session: 'pos_session',
};

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers(): User[] {
  return load<User[]>(KEYS.users, []);
}

export function saveUsers(users: User[]) {
  save(KEYS.users, users);
}

export function getCategories(): ProductCategory[] {
  return load<ProductCategory[]>(KEYS.categories, []);
}

export function saveCategories(categories: ProductCategory[]) {
  save(KEYS.categories, categories);
}

export function getProducts(): Product[] {
  return load<Product[]>(KEYS.products, []);
}

export function saveProducts(products: Product[]) {
  save(KEYS.products, products);
}

export function getOrders(): Order[] {
  return load<Order[]>(KEYS.orders, []);
}

export function saveOrders(orders: Order[]) {
  save(KEYS.orders, orders);
}

export function getSession(): { userId: string; name: string; role: string } | null {
  return load<{ userId: string; name: string; role: string } | null>(KEYS.session, null);
}

export function setSession(data: { userId: string; name: string; role: string }) {
  save(KEYS.session, data);
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(KEYS.session);
  }
}

export function seedData() {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(KEYS.users)) return;

  const users: User[] = [
    { id: '1', name: 'Admin User', email: 'admin@pos.com', role: 'admin', pin: '1234', createdAt: new Date().toISOString() },
    { id: '2', name: 'John Cashier', email: 'john@pos.com', role: 'cashier', pin: '1111', createdAt: new Date().toISOString() },
  ];
  saveUsers(users);

  const categories: ProductCategory[] = [
    { id: 'beverages', name: 'Beverages', description: 'Drinks and beverages' },
    { id: 'food', name: 'Food', description: 'Food items' },
    { id: 'desserts', name: 'Desserts', description: 'Desserts' },
  ];
  saveCategories(categories);

  const products: Product[] = [
    { id: 'p1', name: 'Cola', categoryId: 'beverages', price: 2.5, cost: 1.2, stock: 50, barcode: '12345678', unit: 'bottle', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'p2', name: 'Orange Juice', categoryId: 'beverages', price: 3.0, cost: 1.5, stock: 30, barcode: '12345679', unit: 'bottle', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'p3', name: 'Cheeseburger', categoryId: 'food', price: 8.99, cost: 4.5, stock: 20, barcode: '12345680', unit: 'piece', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'p4', name: 'Fries', categoryId: 'food', price: 3.99, cost: 1.2, stock: 40, barcode: '12345681', unit: 'portion', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'p5', name: 'Ice Cream', categoryId: 'desserts', price: 4.5, cost: 2.0, stock: 25, barcode: '12345682', unit: 'scoop', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];
  saveProducts(products);

  saveOrders([]);
}
