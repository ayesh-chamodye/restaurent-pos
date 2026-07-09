import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'cashier' | 'manager';
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: 'admin' | 'cashier' | 'manager';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'admin' | 'cashier' | 'manager';
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          category_id: string;
          price: number;
          cost: number;
          stock: number;
          barcode?: string;
          image?: string;
          unit: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category_id: string;
          price: number;
          cost: number;
          stock: number;
          barcode?: string;
          image?: string;
          unit: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category_id?: string;
          price?: number;
          cost?: number;
          stock?: number;
          barcode?: string;
          image?: string;
          unit?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      tables: {
        Row: {
          id: string;
          number: number;
          capacity: number;
          status: 'available' | 'occupied' | 'reserved';
          current_order_id?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          number: number;
          capacity: number;
          status?: 'available' | 'occupied' | 'reserved';
          current_order_id?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          number?: number;
          capacity?: number;
          status?: 'available' | 'occupied' | 'reserved';
          current_order_id?: string;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          table_id?: string;
          table_number?: number;
          customer_name?: string;
          customer_count?: number;
          items: any;
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
        };
        Insert: {
          id?: string;
          table_id?: string;
          table_number?: number;
          customer_name?: string;
          customer_count?: number;
          items?: any;
          subtotal?: number;
          tax?: number;
          discount?: number;
          total?: number;
          payment_method?: 'cash' | 'card' | 'mobile';
          status?: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
          notes?: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          table_id?: string;
          table_number?: number;
          customer_name?: string;
          customer_count?: number;
          items?: any;
          subtotal?: number;
          tax?: number;
          discount?: number;
          total?: number;
          payment_method?: 'cash' | 'card' | 'mobile';
          status?: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
          notes?: string;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          unit_price: number;
          customizations?: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          unit_price: number;
          customizations?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          product_name?: string;
          quantity?: number;
          unit_price?: number;
          customizations?: any;
          created_at?: string;
        };
      };
    };
  };
};
