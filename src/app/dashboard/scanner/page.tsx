import DashboardLayoutClient from '../layout-client';
import ScannerPageClient from './page-client';

export default async function ScannerPage() {
  return (
    <DashboardLayoutClient user={{ name: '', email: '', role: 'admin' }} orderCount={0} tableCount={0} reservationCount={0}>
      <ScannerPageClient />
    </DashboardLayoutClient>
  );
}
