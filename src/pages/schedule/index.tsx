import React, { useState } from 'react';
import { View, Text, ScrollView, Button, Modal, Input, Picker } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useApp } from '@/context/AppContext';
import type { ScheduleItem } from '@/types';

const SchedulePage: React.FC = () => {
  const { schedule, topics, addSchedule } = useApp();
  
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [newSchedule, setNewSchedule] = useState({
    topicId: '',
    type: 'record' as const,
    date: '',
    time: '',
    location: '',
    participants: ''
  });

  const today = new Date().toISOString().split('T')[0];
  
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const getDaysArray = () => {
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const pendingTopics = topics.filter(t => t.status === 'pending');
  
  const getScheduleByDate = (date: string) => {
    return schedule.filter(item => item.date === date);
  };

  const checkConflict = (date: string, time: string, excludeId?: string) => {
    return schedule.some(item => 
      item.id !== excludeId && item.date === date && item.time === time
    );
  };

  const handleSubmit = () => {
    if (!newSchedule.topicId) {
      Taro.showToast({ title: '请选择选题', icon: 'none' });
      return;
    }
    if (!newSchedule.date) {
      Taro.showToast({ title: '请选择日期', icon: 'none' });
      return;
    }
    if (!newSchedule.time) {
      Taro.showToast({ title: '请选择时间', icon: 'none' });
      return;
    }
    
    if (checkConflict(newSchedule.date, newSchedule.time)) {
      Taro.showToast({ title: '该时间已有安排', icon: 'none' });
      return;
    }
    
    const topic = topics.find(t => t.id === newSchedule.topicId);
    addSchedule({
      topicId: newSchedule.topicId,
      topicTitle: topic?.title || '',
      type: newSchedule.type,
      date: newSchedule.date,
      time: newSchedule.time,
      location: newSchedule.location || undefined,
      participants: newSchedule.participants.split('、').filter(Boolean)
    });
    
    setShowModal(false);
    setNewSchedule({ topicId: '', type: 'record', date: '', time: '', location: '', participants: '' });
    Taro.showToast({ title: '添加成功', icon: 'success' });
  };

  const handleDateClick = (day: number | null) => {
    if (day === null) return;
    const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(date);
    setNewSchedule(prev => ({ ...prev, date }));
  };

  const getStatusText = (status: ScheduleItem['status']) => {
    const map = { pending: '待执行', completed: '已完成', overdue: '已过期' };
    return map[status];
  };

  const getStatusColor = (status: ScheduleItem['status']) => {
    const map = { pending: '#f59e0b', completed: '#059669', overdue: '#dc2626' };
    return map[status];
  };

  const getTypeText = (type: ScheduleItem['type']) => {
    return type === 'record' ? '录制' : '上线';
  };

  const getTypeColor = (type: ScheduleItem['type']) => {
    return type === 'record' ? '#dc2626' : '#059669';
  };

  const todaySchedule = getScheduleByDate(today);
  const upcomingSchedule = schedule.filter(s => s.date > today && s.status === 'pending').slice(0, 5);

  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>排期管理</Text>
        <Button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <Text className={styles.addText}>+ 添加安排</Text>
        </Button>
      </View>

      <View className={styles.calendarSection}>
        <View className={styles.calendarHeader}>
          <Text className={styles.monthTitle}>{currentYear}年{currentMonth + 1}月</Text>
        </View>
        <View className={styles.weekdayRow}>
          {weekdays.map(day => (
            <Text key={day} className={styles.weekday}>{day}</Text>
          ))}
        </View>
        <View className={styles.daysGrid}>
          {getDaysArray().map((day, index) => (
            <View 
              key={index} 
              className={`${styles.dayCell} ${day === null ? styles.emptyDay : ''} ${selectedDate === `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` ? styles.selectedDay : ''}`}
              onClick={() => handleDateClick(day)}
            >
              {day}
              {day !== null && getScheduleByDate(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`).length > 0 && (
                <View className={styles.dayDot} />
              )}
            </View>
          ))}
        </View>
      </View>

      {todaySchedule.length > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>今日安排</Text>
          <View className={styles.scheduleList}>
            {todaySchedule.map(item => (
              <View key={item.id} className={styles.scheduleCard}>
                <View className={styles.scheduleHeader}>
                  <View className={styles.typeBadge} style={{ backgroundColor: getTypeColor(item.type) }}>
                    <Text className={styles.typeText}>{getTypeText(item.type)}</Text>
                  </View>
                  <Text className={styles.scheduleTime}>{item.time}</Text>
                </View>
                <Text className={styles.scheduleTitle}>{item.topicTitle}</Text>
                {item.location && (
                  <Text className={styles.scheduleLocation}>📍 {item.location}</Text>
                )}
                <Text className={styles.scheduleStatus} style={{ color: getStatusColor(item.status) }}>
                  {getStatusText(item.status)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>近期安排</Text>
        {upcomingSchedule.length > 0 ? (
          <View className={styles.scheduleList}>
            {upcomingSchedule.map(item => (
              <View key={item.id} className={styles.scheduleCard}>
                <View className={styles.scheduleHeader}>
                  <View className={styles.typeBadge} style={{ backgroundColor: getTypeColor(item.type) }}>
                    <Text className={styles.typeText}>{getTypeText(item.type)}</Text>
                  </View>
                  <Text className={styles.scheduleDate}>{item.date} {item.time}</Text>
                </View>
                <Text className={styles.scheduleTitle}>{item.topicTitle}</Text>
                {item.location && (
                  <Text className={styles.scheduleLocation}>📍 {item.location}</Text>
                )}
                {item.participants.length > 0 && (
                  <Text className={styles.scheduleParticipants}>👥 {item.participants.join('、')}</Text>
                )}
              </View>
            ))}
          </View>
        ) : (
          <Text className={styles.emptyText}>暂无近期安排</Text>
        )}
      </View>

      <Modal
        title="添加安排"
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
              {(['record', 'publish'] as const).map(type => (
                <Button 
                  key={type}
                  className={`${styles.typeBtn} ${newSchedule.type === type ? styles.typeActive : ''}`}
                  onClick={() => setNewSchedule(prev => ({ ...prev, type }))}
                >
                  <Text className={styles.typeBtnText}>{getTypeText(type)}</Text>
                </Button>
              ))}
            </View>
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>选题 *</Text>
            <Picker 
              mode="selector" 
              range={pendingTopics.map(t => t.title)} 
              rangeKey="title"
              onChange={(e: any) => setNewSchedule(prev => ({ ...prev, topicId: pendingTopics[e.detail.value]?.id || '' }))}
            >
              <View className={styles.pickerView}>
                <Text className={styles.pickerText}>
                  {newSchedule.topicId ? pendingTopics.find(t => t.id === newSchedule.topicId)?.title : '请选择选题'}
                </Text>
              </View>
            </Picker>
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>日期 *</Text>
            <Picker mode="date" onChange={(e: any) => setNewSchedule(prev => ({ ...prev, date: e.detail.value }))}>
              <View className={styles.pickerView}>
                <Text className={styles.pickerText}>{newSchedule.date || '请选择日期'}</Text>
              </View>
            </Picker>
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>时间 *</Text>
            <Picker mode="time" onChange={(e: any) => setNewSchedule(prev => ({ ...prev, time: e.detail.value }))}>
              <View className={styles.pickerView}>
                <Text className={styles.pickerText}>{newSchedule.time || '请选择时间'}</Text>
              </View>
            </Picker>
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>地点</Text>
            <Input className={styles.formInput} placeholder="如：线上会议室" value={newSchedule.location} onChange={e => setNewSchedule(prev => ({ ...prev, location: e.detail.value }))} />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>参与人员（用顿号分隔）</Text>
            <Input className={styles.formInput} placeholder="如：李明、王芳" value={newSchedule.participants} onChange={e => setNewSchedule(prev => ({ ...prev, participants: e.detail.value }))} />
          </View>
        </View>
      </Modal>

      <View className={styles.bottomSpace} />
    </ScrollView>
  );
};

export default SchedulePage;