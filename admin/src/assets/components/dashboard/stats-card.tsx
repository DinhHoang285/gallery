'use client';
import { Card, Statistic } from 'antd';
import styles from './stats-card.module.scss';

interface StatsCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  loading?: boolean;
}

const StatsCard = ({ title, value, icon, loading = false }: StatsCardProps) => {
  return (
    <Card className={styles.statsCard} loading={loading}>
      <Statistic
        title={title}
        value={value}
        prefix={icon}
        valueStyle={{ color: '#3f8600' }}
      />
    </Card>
  );
};

export default StatsCard;

