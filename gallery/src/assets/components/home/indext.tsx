'use client';

import ExploreHome from './explore';
import styles from './style.module.scss';

const HomeComponent = () => {
  return (<div className={styles.homeContainer}>
    <ExploreHome />
  </div>);
}

export default HomeComponent;