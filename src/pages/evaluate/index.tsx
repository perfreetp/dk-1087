import React, { useState } from 'react';
import { View, Text, ScrollView, Button, Modal } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useApp } from '@/context/AppContext';
import type { Topic } from '@/types';

const EvaluatePage: React.FC = () => {
  const { topics, updateTopic, exportOutline } = useApp();
  
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentOutline, setCurrentOutline] = useState('');
  const [rating, setRating] = useState({ freshness: 5, depth: 5, difficulty: 5 });
  const [sortBy, setSortBy] = useState<'freshness' | 'depth' | 'difficulty' | 'average'>('average');

  const pendingTopics = topics.filter(t => t.status !== 'published');
  
  const sortedTopics = [...pendingTopics].sort((a, b) => {
    const aRating = a.rating || { freshness: 0, depth: 0, difficulty: 0, average: 0 };
    const bRating = b.rating || { freshness: 0, depth: 0, difficulty: 0, average: 0 };
    return bRating[sortBy] - aRating[sortBy];
  });

  const handleRating = (type: 'freshness' | 'depth' | 'difficulty', value: number) => {
    setRating(prev => ({ ...prev, [type]: value }));
  };

  const handleSubmitRating = () => {
    if (!selectedTopic) return;
    const average = Math.round((rating.freshness + rating.depth + rating.difficulty) / 3 * 10) / 10;
    updateTopic(selectedTopic.id, { 
      rating: { ...rating, average } 
    });
    setShowModal(false);
    setRating({ freshness: 5, depth: 5, difficulty: 5 });
    Taro.showToast({ title: '评分成功', icon: 'success' });
  };

  const handleExport = (topic: Topic) => {
    setSelectedTopic(topic);
    const outline = exportOutline(topic.id);
    setCurrentOutline(outline);
    setShowExportModal(true);
  };

  const handleCopyOutline = () => {
    Taro.setClipboardData({
      data: currentOutline,
      success: () => {
        Taro.showToast({ title: '已复制到剪贴板', icon: 'success' });
        setShowExportModal(false);
      }
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return '#059669';
    if (score >= 5) return '#f59e0b';
    return '#dc2626';
  };

  const getScoreStars = (score: number) => {
    return '★'.repeat(Math.floor(score)) + '☆'.repeat(10 - Math.floor(score));
  };

  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>选题评估</Text>
      </View>

      <View className={styles.sortBar}>
        {(['freshness', 'depth', 'difficulty', 'average'] as const).map(key => (
          <Button 
            key={key}
            className={`${styles.sortBtn} ${sortBy === key ? styles.sortActive : ''}`}
            onClick={() => setSortBy(key)}
          >
            <Text className={styles.sortText}>
              {key === 'freshness' ? '新鲜度' : key === 'depth' ? '深度' : key === 'difficulty' ? '难度' : '综合'}
            </Text>
          </Button>
        ))}
      </View>

      <View className={styles.evaluateList}>
        {sortedTopics.map(topic => {
          const topicRating = topic.rating || { freshness: 0, depth: 0, difficulty: 0, average: 0 };
          return (
            <View key={topic.id} className={styles.evaluateCard}>
              <View className={styles.cardHeader}>
                <Text className={styles.topicTitle}>{topic.title}</Text>
                <Text className={styles.averageScore} style={{ color: getScoreColor(topicRating.average) }}>
                  {topicRating.average}分
                </Text>
              </View>
              
              <View className={styles.ratingRow}>
                <View className={styles.ratingItem}>
                  <Text className={styles.ratingLabel}>新鲜度</Text>
                  <Text className={styles.ratingStars} style={{ color: getScoreColor(topicRating.freshness) }}>
                    {getScoreStars(topicRating.freshness)}
                  </Text>
                  <Text className={styles.ratingValue} style={{ color: getScoreColor(topicRating.freshness) }}>
                    {topicRating.freshness}
                  </Text>
                </View>
                <View className={styles.ratingItem}>
                  <Text className={styles.ratingLabel}>深度</Text>
                  <Text className={styles.ratingStars} style={{ color: getScoreColor(topicRating.depth) }}>
                    {getScoreStars(topicRating.depth)}
                  </Text>
                  <Text className={styles.ratingValue} style={{ color: getScoreColor(topicRating.depth) }}>
                    {topicRating.depth}
                  </Text>
                </View>
                <View className={styles.ratingItem}>
                  <Text className={styles.ratingLabel}>难度</Text>
                  <Text className={styles.ratingStars} style={{ color: getScoreColor(topicRating.difficulty) }}>
                    {getScoreStars(topicRating.difficulty)}
                  </Text>
                  <Text className={styles.ratingValue} style={{ color: getScoreColor(topicRating.difficulty) }}>
                    {topicRating.difficulty}
                  </Text>
                </View>
              </View>

              <View className={styles.cardActions}>
                <Button className={styles.actionBtn} onClick={() => { setSelectedTopic(topic); setShowModal(true); }}>
                  <Text className={styles.actionText}>评分</Text>
                </Button>
                <Button className={styles.actionBtn} onClick={() => handleExport(topic)}>
                  <Text className={styles.actionText}>导出提纲</Text>
                </Button>
              </View>
            </View>
          );
        })}
      </View>

      <Modal
        title="评分"
        visible={showModal}
        confirmText="保存"
        cancelText="取消"
        onConfirm={handleSubmitRating}
        onCancel={() => { setShowModal(false); setRating({ freshness: 5, depth: 5, difficulty: 5 }); }}
      >
        {selectedTopic && (
          <View className={styles.modalContent}>
            <Text className={styles.modalTitle}>{selectedTopic.title}</Text>
            
            <View className={styles.ratingSection}>
              <Text className={styles.ratingSectionTitle}>新鲜度</Text>
              <View className={styles.starSelector}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <Button 
                    key={num}
                    className={`${styles.starBtn} ${rating.freshness >= num ? styles.starActive : ''}`}
                    onClick={() => handleRating('freshness', num)}
                  >
                    <Text className={styles.starText}>★</Text>
                  </Button>
                ))}
              </View>
              <Text className={styles.ratingValueText}>{rating.freshness}分</Text>
            </View>

            <View className={styles.ratingSection}>
              <Text className={styles.ratingSectionTitle}>可聊深度</Text>
              <View className={styles.starSelector}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <Button 
                    key={num}
                    className={`${styles.starBtn} ${rating.depth >= num ? styles.starActive : ''}`}
                    onClick={() => handleRating('depth', num)}
                  >
                    <Text className={styles.starText}>★</Text>
                  </Button>
                ))}
              </View>
              <Text className={styles.ratingValueText}>{rating.depth}分</Text>
            </View>

            <View className={styles.ratingSection}>
              <Text className={styles.ratingSectionTitle}>制作难度</Text>
              <View className={styles.starSelector}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <Button 
                    key={num}
                    className={`${styles.starBtn} ${rating.difficulty >= num ? styles.starActive : ''}`}
                    onClick={() => handleRating('difficulty', num)}
                  >
                    <Text className={styles.starText}>★</Text>
                  </Button>
                ))}
              </View>
              <Text className={styles.ratingValueText}>{rating.difficulty}分</Text>
            </View>

            <View className={styles.averageSection}>
              <Text className={styles.averageLabel}>综合评分</Text>
              <Text className={styles.averageValue} style={{ color: getScoreColor(Math.round((rating.freshness + rating.depth + rating.difficulty) / 3 * 10) / 10) }}>
                {Math.round((rating.freshness + rating.depth + rating.difficulty) / 3 * 10) / 10}分
              </Text>
            </View>
          </View>
        )}
      </Modal>

      <Modal
        title="录制提纲"
        visible={showExportModal}
        confirmText="复制"
        cancelText="关闭"
        onConfirm={handleCopyOutline}
        onCancel={() => setShowExportModal(false)}
      >
        <ScrollView scrollY className={styles.exportContent}>
          <Text className={styles.outlineText}>{currentOutline}</Text>
        </ScrollView>
      </Modal>

      <View className={styles.bottomSpace} />
    </ScrollView>
  );
};

export default EvaluatePage;