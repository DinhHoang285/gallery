'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './style.module.scss';

interface PinItem {
  id: number;
  image: string;
}

// Tạo nhiều hình ảnh với chiều cao khác nhau để tạo hiệu ứng so le
const generateFakeData = (count: number): PinItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    image: `https://picsum.photos/400/${400 + Math.floor(Math.random() * 400)}?random=${i + 1}`,
  }));
};

const ITEMS_PER_PAGE = 12;
const INITIAL_ITEMS = 24;

const HomeComponent = () => {
  const [items, setItems] = useState<PinItem[]>(generateFakeData(INITIAL_ITEMS));
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [columnCount, setColumnCount] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Tính số cột dựa trên chiều rộng màn hình (giống Pinterest)
  useEffect(() => {
    const updateColumnCount = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;

      // Pinterest thường dùng: mobile 2 cột, tablet 3 cột, desktop 4-5 cột
      if (width < 768) {
        setColumnCount(2);
      } else if (width < 1024) {
        setColumnCount(3);
      } else if (width < 1440) {
        setColumnCount(4);
      } else {
        setColumnCount(5);
      }
    };

    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  // Load more items
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const newItems = generateFakeData(ITEMS_PER_PAGE);
    setItems(prev => [...prev, ...newItems]);

    // Giả sử có tối đa 100 items
    if (items.length + ITEMS_PER_PAGE >= 100) {
      setHasMore(false);
    }

    setIsLoading(false);
  }, [isLoading, hasMore, items.length]);

  // Infinite scroll với Intersection Observer
  useEffect(() => {
    if (!loadMoreRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, loadMore]);

  return (
    <div className={styles.homeContainer}>
      <div
        ref={containerRef}
        className={styles.masonryGrid}
        style={{ '--columns': columnCount } as React.CSSProperties}
      >
        {items.map((item) => (
          <div key={item.id} className={styles.pinCard}>
            <div className={styles.imageWrapper}>
              <img
                src={item.image}
                alt={`Pin ${item.id}`}
                className={styles.image}
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Load more trigger */}
      <div ref={loadMoreRef} className={styles.loadMoreTrigger}>
        {isLoading && (
          <div className={styles.loading}>Loading...</div>
        )}
      </div>
    </div>
  );
}

export default HomeComponent;