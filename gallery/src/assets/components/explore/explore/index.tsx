'use client';
import { useState } from 'react';
import styles from './style.module.scss';

interface ExploreItem {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description?: string;
}

const fakeData: ExploreItem[] = [
  {
    id: 1,
    image: 'https://picsum.photos/400/600?random=1',
    title: 'Hello 2026!',
    subtitle: 'Happy New Year!',
  },
  {
    id: 2,
    image: 'https://picsum.photos/400/500?random=2',
    title: 'Fresh Start',
    subtitle: 'New Year journal reminders',
  },
  {
    id: 3,
    image: 'https://picsum.photos/400/400?random=3',
    title: 'Find Your Energy',
    subtitle: 'New Year quotes to fuel 2026',
  },
  {
    id: 4,
    image: 'https://picsum.photos/400/700?random=4',
    title: 'Travel Goals',
    subtitle: 'Amusement park group list',
  },
  {
    id: 5,
    image: 'https://picsum.photos/400/550?random=5',
    title: 'Inspiration Board',
    subtitle: 'Creative ideas for the new year',
  },
  {
    id: 6,
    image: 'https://picsum.photos/400/650?random=6',
    title: 'Life Goals 2026',
    subtitle: 'Personal plans and objectives',
  },
];

const ExploreHome = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedItems = showAll ? fakeData.slice(0, 6) : fakeData.slice(0, 3);
  const hasMore = fakeData.length > 3;

  return (
    <div className={styles.exploreContainer}>
      <h2 className={styles.title}>Discover the best of Pinterest</h2>

      <div className={styles.grid}>
        {displayedItems.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img src={item.image} alt={item.title} className={styles.image} />
            </div>
            <div className={styles.content}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardSubtitle}>{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {hasMore && !showAll && (
        <div className={styles.buttonWrapper}>
          <button
            className={styles.showMoreButton}
            onClick={() => setShowAll(true)}
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
}

export default ExploreHome;