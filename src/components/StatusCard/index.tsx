import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface StatusCardProps {
  title: string;
  count: number;
  status: 'pending' | 'recording' | 'editing' | 'pending-publish' | 'published';
}

const statusConfig = {
  pending: { bgColor: '#fef3c7', textColor: '#d97706', borderColor: '#fcd34d' },
  recording: { bgColor: '#fee2e2', textColor: '#dc2626', borderColor: '#fca5a5' },
  editing: { bgColor: '#dbeafe', textColor: '#2563eb', borderColor: '#93c5fd' },
  'pending-publish': { bgColor: '#d1fae5', textColor: '#059669', borderColor: '#6ee7b7' },
  published: { bgColor: '#f3f4f6', textColor: '#6b7280', borderColor: '#e5e7eb' }
};

const StatusCard: React.FC<StatusCardProps> = ({ title, count, status }) => {
  const config = statusConfig[status];
  
  return (
    <View className={styles.statusCard} style={{ backgroundColor: config.bgColor, borderColor: config.borderColor }}>
      <Text className={styles.count} style={{ color: config.textColor }}>{count}</Text>
      <Text className={styles.title} style={{ color: config.textColor }}>{title}</Text>
    </View>
  );
};

export default StatusCard;