import DashboardLayoutClient from '../layout-client';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import type { Order } from '@/types';
import OrdersPageClient from './page-client';

export default async function OrdersPage() {
  const supabase = await createSupabaseServerClient();
  let orders: Order[] = [];

  if (supabase) {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    orders = data || [];
  }

  return (
    <DashboardLayoutClient user={{ name: '', email: '', role: 'admin' }} orderCount={0} tableCount={0} reservationCount={0}>
      <OrdersPageClient initialOrders={orders} />
    </DashboardLayoutClient>
  );
}
