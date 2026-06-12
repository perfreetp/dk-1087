import React from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useApp } from '@/context/AppContext';
import StatusCard from '@/components/StatusCard';
import type { Topic } from '@/types';

const HomePage: React.FC = () => {
  const { topics, getMonthlySummary } = useApp();
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const summary = getMonthlySummary(currentMonth, currentYear);
  
  const recentTopics = topics.slice(0, 3);
  
  const statusCards = [
    { title: '待录制', count: summary.recording, status: 'recording' as const },
    { title: '待剪辑', count: summary.editing, status: 'editing' as const },
    { title: '待发布', count: summary.pendingPublish, status: 'pending-publish' as const }
  ];

  const getStatusText = (status: Topic['status']) => {
    const map = {
      pending: '待规划',
      recording: '录制中',
      editing: '剪辑中',
      'pending-publish': '待发布',
      published: '已发布'
    };
    return map[status];
  };

  const getStatusColor = (status: Topic['status']) => {
    const map = {
      pending: '#d97706',
      recording: '#dc2626',
      editing: '#2563eb',
      'pending-publish': '#059669',
      published: '#6b7280'
    };
    return map[status];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.header}>
        <Text className={styles.greeting}>本月概览</Text>
        <Text className={styles.date}>{currentYear}年{currentMonth + 1}月</Text>
      </View>

      <View className={styles.statusGrid}>
        {statusCards.map((card, index) => (
          <StatusCard key={index} {...card} />
        ))}
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>最近选题</Text>
          <Button className={styles.moreBtn} onClick={() => Taro.switchTab({ url: '/pages/topic/index' })}>
            <Text className={styles.moreText}>查看全部</Text>
          </Button>
        </View>
        
        <View className={styles.topicList}>
          {recentTopics.map(topic => (
            <View key={topic.id} className={styles.topicCard} onClick={() => Taro.switchTab({ url: '/pages/topic/index' })}>
              <View className={styles.topicHeader}>
                <Text className={styles.topicTitle}>{topic.title}</Text>
                <Text className={styles.topicStatus} style={{ color: getStatusColor(topic.status) }}>
                  {getStatusText(topic.status)}
                </Text>
              </View>
              <Text className={styles.topicDesc}>{topic.description}</Text>
              <View className={styles.topicFooter}>
                <Text className={styles.topicGuests}>嘉宾：{topic.guests.join('、') || '无'}</Text>
                <Text className={styles.topicDate}>{formatDate(topic.updatedAt)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>快捷操作</Text>
        <View className={styles.quickActions}>
          <View className={styles.actionBtn} onClick={() => Taro.switchTab({ url: '/pages/topic/index' })}>
            <View className={styles.actionIcon}>+</View>
            <Text className={styles.actionText}>新建选题</Text>
          </View>
          <View className={styles.actionBtn} onClick={() => Taro.switchTab({ url: '/pages/inspiration/index' })}>
            <View className={styles.actionIcon}>*</View>
            <Text className={styles.actionText}>记录灵感</Text>
          </View>
          <View className={styles.actionBtn} onClick={() => Taro.switchTab({ url: '/pages/schedule/index' })}>
            <View className={styles.actionIcon}>@</View>
            <Text className={styles.actionText}>安排排期</Text>
          </View>
          <View className={styles.actionBtn} onClick={() => Taro.switchTab({ url: '/pages/evaluate/index' })}>
            <View className={styles.actionIcon}>%</View>
            <Text className={styles.actionText}>评估选题</Text>
          </View>
        </View>
      </View>

      <View className={styles.bottomSpace} />
    </ScrollView>
  );
};

export default HomePage;