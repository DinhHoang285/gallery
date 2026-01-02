'use client';
import "react-photo-album/masonry.css";
import { MasonryPhotoAlbum } from "react-photo-album";
import styles from './style.module.scss';
import FormLogin from '../form/form-login';
import { listPhotos } from '@/assets/constants/list-photos';
import { useState } from 'react';
import FormRegister from '../form/form-register';
const LoginComponent = () => {
  const photos = listPhotos;
  const [page, setPage] = useState<'login' | 'register'>('login')
  const handleChangePage = (page: 'login' | 'register') => {
    setPage(page)
  }
  return (
    <div className={styles.loginWrapper}>
      <div className={styles.backgroundGrid}>
        <MasonryPhotoAlbum
          photos={photos}
          columns={(containerWidth) => {
            if (containerWidth < 480) return 2;
            if (containerWidth < 768) return 3;
            if (containerWidth < 1024) return 4;
            return 6;
          }}
          spacing={10}
          defaultContainerWidth={1200}
        />
      </div>
      <div className={styles.overlay} />
      <div className={styles.formContainer}>
        {page === 'login'
          ? <FormLogin changePage={handleChangePage} />
          : <FormRegister changePage={handleChangePage} />}
      </div>
    </div>
  );
}

export default LoginComponent;