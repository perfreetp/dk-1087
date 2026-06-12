import React, { useState } from 'react';
import { View, Text, ScrollView, Button, Input, Textarea, Modal } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useApp } from '@/context/AppContext';
import type { Inspiration } from '@/types';

const InspirationPage: React.FC = () => {
  const { inspirations, addInspiration, convertInspiration } = useApp();
  
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState<'listener' | 'hot' | 'media'>('listener');
  const [newInspiration, setNewInspiration] = useState({
    title: '',
    content: '',
    source: '',
    tags: ''
  });
  const [filter, setFilter] = useState<'all' | 'listener' | 'hot' | 'media'>('all');

  const typeConfig = {
    listener: { label: '听众留言', color: '#059669', bgColor: '#d1fae5' },
    hot: { label: '热点事件', color: '#dc2626', bgColor: '#fee2e2' },
    media: { label: '书影音', color: '#2563eb', bgColor: '#dbeafe' }
  };

  const filteredInspirations = filter === 'all' 
    ? inspirations 
    : inspirations.filter(insp => insp.type === filter);

  const handleSubmit = () => {
    if (!newInspiration.title.trim()) {
      Taro.showToast({ title: '请输入标题', icon: 'none' });
      return;
    }
    addInspiration({
      type: selectedType,
      title: newInspiration.title,
      content: newInspiration.content,
      source: newInspiration.source || undefined,
      tags: newInspiration.tags.split('，').filter(Boolean)
    });
    setShowModal(false);
    setNewInspiration({ title: '', content: '', source: '', tags: '' });
    setSelectedType('listener');
    Taro.showToast({ title: '记录成功', icon: 'success' });
  };

  const handleConvert = (id: string) => {
    convertInspiration(id);
    Taro.showToast({ title: '已转为候选选题', icon: 'success' });
  };

  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>灵感收集</Text>
        <Button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <Text className={styles.addText}>+ 记录灵感</Text>
        </Button>
      </View>

      <View className={styles.filterBar}>
        {(['all', 'listener', 'hot', 'media'] as const).map(type => (
          <Button 
            key={type}
            className={`${styles.filterBtn} ${filter === type ? styles.filterActive : ''}`}
            onClick={() => setFilter(type)}
          >
            <Text className={styles.filterText}>{type === 'all' ? '全部' : typeConfig[type].label}</Text>
          </Button>
        ))}
      </View>

      <View className={styles.stats}>
        <View className={styles.statItem}>
          <Text className={styles.statCount}>{inspirations.length}</Text>
          <Text className={styles.statLabel}>灵感总数</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statCount}>{inspirations.filter(i => !i.isConverted).length}</Text>
          <Text className={styles.statLabel}>待转化</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statCount}>{inspirations.filter(i => i.isConverted).length}</Text>
          <Text className={styles.statLabel}>已转化</Text>
        </View>
      </View>

      <View className={styles.inspirationList}>
        {filteredInspirations.map(inspiration => (
          <View key={inspiration.id} className={styles.inspirationCard}>
            <View className={styles.cardHeader}>
              <View className={styles.typeTag} style={{ backgroundColor: typeConfig[inspiration.type].bgColor }}>
                <Text className={styles.typeText} style={{ color: typeConfig[inspiration.type].color }}>
                  {typeConfig[inspiration.type].label}
                </Text>
              </View>
              {inspiration.isConverted && (
                <Text className={styles.convertedTag}>已转化</Text>
              )}
            </View>
            <Text className={styles.inspirationTitle}>{inspiration.title}</Text>
            <Text className={styles.inspirationContent}>{inspiration.content}</Text>
            {inspiration.source && (
              <Text className={styles.inspirationSource}>来源：{inspiration.source}</Text>
            )}
            {inspiration.tags.length > 0 && (
              <View className={styles.tagList}>
                {inspiration.tags.map((tag, i) => (
                  <Text key={i} className={styles.tag}>{tag}</Text>
                ))}
              </View>
            )}
            <View className={styles.cardFooter}>
              <Text className={styles.inspirationDate}>{inspiration.createdAt}</Text>
              {!inspiration.isConverted && (
                <Button className={styles.convertBtn} onClick={() => handleConvert(inspiration.id)}>
                  <Text className={styles.convertText}>转为选题</Text>
                </Button>
              )}
            </View>
          </View>
        ))}
      </View>

      <Modal
        title="记录灵感"
        visible={showModal}
        confirmText="保存"
        cancelText="取消"
        onConfirm={handleSubmit}
        onCancel={() => setShowModal(false)}
      >
        <View className={styles.form}>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>类型</Text>
            <View className={styles.typeSelector}>
              {(['listener', 'hot', 'media'] as const).map(type => (
                <Button 
                  key={type}
                  className={`${styles.typeBtn} ${selectedType === type ? styles.typeActive : ''}`}
                  onClick={() => setSelectedType(type)}
                >
                  <Text className={styles.typeBtnText}>{typeConfig[type].label}</Text>
                </Button>
              ))}
            </View>
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>标题 *</Text>
            <Input className={styles.formInput} placeholder="输入灵感标题" value={newInspiration.title} onChange={e => setNewInspiration({ ...newInspiration, title: e.detail.value })} />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>内容</Text>
            <Textarea className={styles.formTextarea} placeholder="详细描述灵感内容" value={newInspiration.content} onChange={e => setNewInspiration({ ...newInspiration, content: e.detail.value })} />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>来源（如适用）</Text>
            <Input className={styles.formInput} placeholder="书籍/新闻/电影等" value={newInspiration.source} onChange={e => setNewInspiration({ ...newInspiration, source: e.detail.value })} />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>标签（用中文逗号分隔）</Text>
            <Input className={styles.formInput} placeholder="如：读书、经济" value={newInspiration.tags} onChange={e => setNewInspiration({ ...newInspiration, tags: e.detail.value })} />
          </View>
        </View>
      </Modal>

      <View className={styles.bottomSpace} />
    </ScrollView>
  );
};

export default InspirationPage;