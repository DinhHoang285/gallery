import { ReactNode } from 'react';
import AdminRouteGuard from '@/assets/guards/admin-route.guard';
import AdminSidebar from '@/assets/layouts/admin-sidebar';
import AdminHeader from '@/assets/layouts/admin-header';
import styles from './layout.module.scss';

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AdminRouteGuard>
      <div className={styles.adminLayout}>
        <AdminSidebar />
        <div className={styles.contentWrapper}>
          <AdminHeader />
          <main className={styles.mainContent}>
            {children}
          </main>
        </div>
      </div>
    </AdminRouteGuard>
  );
};

export default AdminLayout;

