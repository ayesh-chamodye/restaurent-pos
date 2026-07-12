'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardLayoutClient from './layout-client';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [orderCount, setOrderCount] = useState(3);
  const [tableCount, setTableCount] = useState(8);
  const [reservationCount, setReservationCount] = useState(2);

  return (
    <DashboardLayoutClient
      user={{ name: 'Ayesh Chamodye', email: 'ayeshchamodye@gmail.com', role: 'admin' }}
      orderCount={orderCount}
      tableCount={tableCount}
      reservationCount={reservationCount}
    >
      {children}
    </DashboardLayoutClient>
  );
}
