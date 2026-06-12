import React, { useState } from 'react';
import { View, Text, ScrollView, Modal } from '@tarojs/components';
import styles from './index.module.scss';
import { useApp } from '@/context/AppContext';
import type { ArchiveItem } from '@/types';

const ArchivePage: React.FC = () => {
  const { archives, topics } = useApp();
  
  const [selectedArchive, setSelectedArchive] = useState<ArchiveItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const totalPlayCount = archives.reduce((sum, item) => sum + item.playCount, 0);
  const avgPlayCount = Math.round(totalPlayCount / archives.length);
  
  const seriesMap = archives.reduce((map, item) => {
    if (item.series) {
      map[item.series] = (map[item.series] || 0) + 1;
    }
    return map;
  }, {} as Record<string, number>);

  const sortedArchives = [...archives].sort((a, b) => 
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  const formatPlayCount = (count: number) => {
    if (count >= 10000) {
      return (count / 10000).toFixed(1) + '万';
    }
    return count.toString();
  };

  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>归档复盘</Text>
      </View>

      <View className={styles.statsCards}>
        <View className={styles.statCard}>
          <Text className={styles.statNumber}>{archives.length}</Text>
          <Text className={styles.statLabel}>已发布期数</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statNumber}>{formatPlayCount(totalPlayCount)}</Text>
          <Text className={styles.statLabel}>总播放量</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statNumber}>{formatPlayCount(avgPlayCount)}</Text>
          <Text className={styles.statLabel}>平均播放</Text>
        </View>
      </View>

      {Object.keys(seriesMap).length > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>节目系列</Text>
          <View className={styles.seriesList}>
            {Object.entries(seriesMap).map(([name, count]) => (
              <View key={name} className={styles.seriesItem}>
                <Text className={styles.seriesName}>{name}</Text>
                <Text className={styles.seriesCount}>{count}期</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>历史节目</Text>
        <View className={styles.archiveList}>
          {sortedArchives.map(item => (
            <View key={item.id} className={styles.archiveCard} onClick={() => { setSelectedArchive(item); setShowModal(true); }}>
              <View className={styles.archiveHeader}>
                <Text className={styles.archiveTitle}>{item.title}</Text>
                {item.series && (
                  <Text className={styles.seriesTag}>{item.series}</Text>
                )}
              </View>
              <View className={styles.archiveMeta}>
                <Text className={styles.archiveDate}>{item.publishDate}</Text>
                <Text className={styles.archivePlay}>🎧 {formatPlayCount(item.playCount)}播放</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <Modal
        title="节目详情"
        visible={showModal}
        confirmText="关闭"
        onCancel={() => setShowModal(false)}
        onConfirm={() => setShowModal(false)}
      >
        {selectedArchive && (
          <ScrollView scrollY className={styles.modalContent}>
            <Text className={styles.modalTitle}>{selectedArchive.title}</Text>
            {selectedArchive.series && (
              <Text className={styles.modalSeries}>{selectedArchive.series}</Text>
            )}
            
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>发布日期</Text>
              <Text className={styles.infoValue}>{selectedArchive.publishDate}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>播放量</Text>
              <Text className={styles.infoValue}>{formatPlayCount(selectedArchive.playCount)}次</Text>
            </View>
            
            <View className={styles.detailSection}>
              <Text className={styles.detailLabel}>听众反馈</Text>
              <Text className={styles.detailContent}>{selectedArchive.feedback}</Text>
            </View>
            
            <View className={styles.detailSection}>
              <Text className={styles.detailLabel}>复盘结论</Text>
              <Text className={styles.detailContent}>{selectedArchive.review}</Text>
            </View>
          </ScrollView>
        )}
      </Modal>

      <View className={styles.bottomSpace} />
    </ScrollView>
  );
};

export default ArchivePage;