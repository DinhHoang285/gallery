import React from 'react';
import {
  Home, Compass, LayoutGrid, Plus, Bell, MessageCircleMore, Settings
} from 'lucide-react';
import styles from './style.module.scss';

const Navigation = () => {
  return (
    <nav className={styles.sidebar}>
      <div className={styles['logo-container']}>
        <svg viewBox="0 0 24 24" className={styles['logo-svg']}>
          <path d="M0 12c0 5.123 3.211 9.497 7.73 11.218-.105-.958-.199-2.425.041-3.47.218-.944 1.41-5.974 1.41-5.974s-.36-.72-.36-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.261 7.929-7.261 4.162 0 7.398 2.967 7.398 6.93 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.034-1.002 2.331-1.492 3.127C9.466 23.755 10.697 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12z" />
        </svg>
      </div>

      <div className={styles['menu-items']}>
        {/* Class active được kết hợp bằng template string */}
        <div className={`${styles['nav-item']} ${styles.active}`}><Home size={28} /></div>
        <div className={styles['nav-item']}><Compass size={28} /></div>
        <div className={styles['nav-item']}><LayoutGrid size={28} /></div>
        <div className={styles['nav-item']}><Plus size={28} /></div>
        <div className={styles['nav-item']}><Bell size={28} /></div>
        <div className={styles['nav-item']}><MessageCircleMore size={28} /></div>
      </div>

      <div className={styles['settings-container']}>
        <div className={styles['nav-item']}><Settings size={28} /></div>
      </div>
    </nav>
  );
};

export default Navigation;