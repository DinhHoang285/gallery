'use client';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FolderTree, Image, LogOut } from 'lucide-react';
import { authService } from '@/assets/services';
import { showSuccess } from '@/assets/lib/message';
import { useUser } from '@/assets/providers/user.provider';
import styles from './style.module.scss';

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { refreshUser } = useUser();

  const handleLogout = async () => {
    try {
      await authService.logout();
      showSuccess('Logged out successfully');
      refreshUser();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      path: '/categories',
      label: 'Categories',
      icon: FolderTree,
    },
    {
      path: '/photos',
      label: 'Photos',
      icon: Image,
    },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>Admin Panel</h2>
      </div>
      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <a
              key={item.path}
              href={item.path}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
      <div className={styles.footer}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

