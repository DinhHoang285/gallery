'use client';
import { useState, useRef, useEffect } from 'react';
import { SearchOutlined, DownOutlined, CheckOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { useRouter } from 'next/navigation';
import AvatarCustom from '@/assets/common/avatars/avatar';
import { useUser } from '@/assets/providers/user.provider';
import { authService } from '@/assets/services';
import { showSuccess } from '@/assets/lib/message';
import styles from './style.module.scss';
import ModalLogin from '@/assets/common/modals/modal-login';
import { useMainThemeLayout } from '@/assets/providers/main-layout.provider';

const Header = () => {
  const { user, refreshUser } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { setState } = useMainThemeLayout();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      showSuccess('Logged out successfully');
      refreshUser();
      router.push('/home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
    return 'U';
  };

  return (
    <div className={styles.header}>
      <div className={styles['box-search']}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search"
          className={styles.search}
        />
      </div>
      {user ? (
        <div className={styles['box-avatar']} ref={dropdownRef}>
          <div
            className={styles['avatar-wrapper']}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <AvatarCustom
              size="32"
              src=""
              name={user?.name || user?.email || 'U'}
              className={styles.avatar}
            />
            <DownOutlined className={styles.dropdown} />
          </div>

          {isDropdownOpen && (
            <div className={styles['dropdown-menu']}>
              <div className={styles['dropdown-section']}>
                <div className={styles['section-label']}>Currently in</div>
                <div className={styles['profile-item']}>
                  <AvatarCustom
                    size="48"
                    src=""
                    name={user?.name || user?.email || 'U'}
                    className={styles['profile-avatar']}
                  />
                  <div className={styles['profile-info']}>
                    <div className={styles['profile-name']}>
                      {user?.name || 'User'}
                    </div>
                    <div className={styles['profile-type']}>Personal</div>
                    <div className={styles['profile-email']}>
                      {user?.email || ''}
                    </div>
                  </div>
                  <CheckOutlined className={styles['check-icon']} />
                </div>
              </div>

              <div className={styles['dropdown-divider']}></div>
              <div className={styles['dropdown-section']}>
                <div className={styles['section-label']}>Your account</div>
                <div className={styles['menu-item']} onClick={handleLogout}>
                  Log out
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles['box-action-auth']}>
          <button
            className={styles['btn-login']}
            onClick={() => setState('modal', 'login')}
          >
            Log in
          </button>
          <button
            className={styles['btn-signup']}
            onClick={() => {
              setState('modal', 'register')
            }}
          >
            Sign up
          </button>
        </div>
      )}
      <ModalLogin />
    </div>
  );
};

export default Header;
