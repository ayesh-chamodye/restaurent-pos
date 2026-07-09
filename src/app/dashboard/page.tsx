import DashboardLayoutClient from './layout-client';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  let finished = 0;
  let ongoing = 0;
  let expected = 0;

  if (supabase) {
    const { data: orders } = await supabase.from('orders').select('status,total');
    finished = orders?.filter(o => o.status === 'completed').length || 0;
    ongoing = orders?.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length || 0;
    expected = orders?.reduce((s, o) => s + (o.total || 0), 0) || 0;
    expected = Number(expected.toFixed(2));
  }

  return (
    <DashboardLayoutClient user={{ name: '', email: '', role: 'admin' }} orderCount={0} tableCount={0} reservationCount={0}>
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Revenue stats</h1>
          <p className="text-sm text-gray-500">Server-side rendered • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Finished</p>
              <span className="badge bg-green-100 text-green-700">↑0,2,5%</span>
            </div>
            <p className="text-2xl font-bold">{finished}</p>
            <p className="text-xs text-gray-400">orders completed</p>
          </div>
          <div className="bg-white border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Ongoing</p>
              <span className="badge bg-green-100 text-green-700">↑1,05%</span>
            </div>
            <p className="text-2xl font-bold">{ongoing}</p>
            <p className="text-xs text-gray-400">active orders</p>
          </div>
          <div className="bg-white border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Expected</p>
              <span className="badge bg-green-100 text-green-700">↑0,25%</span>
            </div>
            <p className="text-2xl font-bold">${expected}</p>
            <p className="text-xs text-gray-400">revenue</p>
          </div>
        </div>
        <div className="bg-white border rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Revenue overview</h3>
          <div className="h-64 bg-gray-50 rounded-xl" />
        </div>
      </div>
    </DashboardLayoutClient>
  );
}
