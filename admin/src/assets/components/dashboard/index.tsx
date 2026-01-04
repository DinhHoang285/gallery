'use client';
import { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { FolderTree, Image, Users } from 'lucide-react';
import { categoryService } from '@/assets/services';
import StatsCard from './stats-card';
import styles from './style.module.scss';

const DashboardComponent = () => {
  const [stats, setStats] = useState({
    categories: 0,
    photos: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch categories
        const categories = await categoryService.getAll();

        // TODO: Add photos and users services when APIs are available
        // const photos = await photoService.getAll();
        // const users = await userService.getAll();

        setStats({
          categories: categories.length,
          photos: 0, // Placeholder
          users: 0, // Placeholder
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Dashboard</h1>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={8}>
          <StatsCard
            title="Total Categories"
            value={stats.categories}
            icon={<FolderTree />}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatsCard
            title="Total Photos"
            value={stats.photos}
            icon={<Image />}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatsCard
            title="Total Users"
            value={stats.users}
            icon={<Users />}
            loading={loading}
          />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardComponent;

