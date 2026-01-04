'use client';
import { useUser } from '@/assets/providers/user.provider';
import styles from './style.module.scss';

const AdminHeader = () => {
  const { user } = useUser();

  const getInitials = () => {
    if (user?.name) {
      const names = user.name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'A';
  };

  return (
    <div className={styles.header}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          {getInitials()}
        </div>
        <div className={styles.userDetails}>
          <div className={styles.userName}>{user?.name || 'Admin'}</div>
          <div className={styles.userEmail}>{user?.email || ''}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;

