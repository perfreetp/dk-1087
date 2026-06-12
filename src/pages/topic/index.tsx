import React, { useState } from 'react';
import { View, Text, ScrollView, Button, Input, Textarea, Modal, Picker } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useApp } from '@/context/AppContext';
import type { Topic } from '@/types';

const TopicPage: React.FC = () => {
  const { topics, addTopic, addComment, addVote } = useApp();
  
  const [showModal, setShowModal] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [newTopic, setNewTopic] = useState({
    title: '',
    description: '',
    guests: '',
    audienceQuestions: '',
    references: '',
    highlights: ''
  });
  const [commentText, setCommentText] = useState('');

  const selectedTopic = topics.find(t => t.id === selectedTopicId) || null;

  const handleSubmit = () => {
    if (!newTopic.title.trim()) {
      Taro.showToast({ title: '请输入主题', icon: 'none' });
      return;
    }
    addTopic({
      title: newTopic.title,
      description: newTopic.description,
      guests: newTopic.guests.split('\n').filter(Boolean),
      audienceQuestions: newTopic.audienceQuestions.split('\n').filter(Boolean),
      references: newTopic.references.split('\n').filter(Boolean),
      highlights: newTopic.highlights.split('\n').filter(Boolean),
      status: 'pending'
    });
    setShowModal(false);
    setNewTopic({ title: '', description: '', guests: '', audienceQuestions: '', references: '', highlights: '' });
    Taro.showToast({ title: '创建成功', icon: 'success' });
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !selectedTopicId) return;
    addComment(selectedTopicId, commentText);
    setCommentText('');
    Taro.showToast({ title: '评论成功', icon: 'success' });
  };

  const handleVote = (choice: 'approve' | 'reject') => {
    if (!selectedTopicId) return;
    addVote(selectedTopicId, choice);
    Taro.showToast({ title: '投票成功', icon: 'success' });
  };

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

  const getVoteStats = (topic: Topic) => {
    const approve = topic.votes.filter(v => v.choice === 'approve').length;
    const reject = topic.votes.filter(v => v.choice === 'reject').length;
    return { approve, reject, total: approve + reject };
  };

  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>选题管理</Text>
        <Button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <Text className={styles.addText}>+ 新建选题</Text>
        </Button>
      </View>

      <View className={styles.topicList}>
        {topics.map(topic => {
          const voteStats = getVoteStats(topic);
          return (
            <View key={topic.id} className={styles.topicCard} onClick={() => { setSelectedTopicId(topic.id); setShowDetail(true); }}>
              <View className={styles.cardHeader}>
                <Text className={styles.topicTitle}>{topic.title}</Text>
                <Text className={styles.topicStatus} style={{ color: getStatusColor(topic.status) }}>
                  {getStatusText(topic.status)}
                </Text>
              </View>
              <Text className={styles.topicDesc}>{topic.description}</Text>
              <View className={styles.cardFooter}>
                <View className={styles.footerItem}>
                  <Text className={styles.footerLabel}>嘉宾</Text>
                  <Text className={styles.footerValue}>{topic.guests.length}人</Text>
                </View>
                <View className={styles.footerItem}>
                  <Text className={styles.footerLabel}>评论</Text>
                  <Text className={styles.footerValue}>{topic.comments.length}条</Text>
                </View>
                <View className={styles.footerItem}>
                  <Text className={styles.footerLabel}>投票</Text>
                  <Text className={styles.footerValue}>{voteStats.approve}/{voteStats.total}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <Modal
        title="新建选题"
        visible={showModal}
        confirmText="创建"
        cancelText="取消"
        onConfirm={handleSubmit}
        onCancel={() => setShowModal(false)}
      >
        <View className={styles.form}>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>主题 *</Text>
            <Input className={styles.formInput} placeholder="输入选题主题" value={newTopic.title} onChange={e => setNewTopic({ ...newTopic, title: e.detail.value })} />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>简介</Text>
            <Textarea className={styles.formTextarea} placeholder="简要描述选题内容" value={newTopic.description} onChange={e => setNewTopic({ ...newTopic, description: e.detail.value })} />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>嘉宾（每行一人）</Text>
            <Textarea className={styles.formTextarea} placeholder="输入嘉宾姓名" value={newTopic.guests} onChange={e => setNewTopic({ ...newTopic, guests: e.detail.value })} />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>受众问题（每行一条）</Text>
            <Textarea className={styles.formTextarea} placeholder="听众可能关心的问题" value={newTopic.audienceQuestions} onChange={e => setNewTopic({ ...newTopic, audienceQuestions: e.detail.value })} />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>参考资料（每行一条）</Text>
            <Textarea className={styles.formTextarea} placeholder="相关书籍、文章、报告" value={newTopic.references} onChange={e => setNewTopic({ ...newTopic, references: e.detail.value })} />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>预期亮点（每行一条）</Text>
            <Textarea className={styles.formTextarea} placeholder="节目亮点、看点" value={newTopic.highlights} onChange={e => setNewTopic({ ...newTopic, highlights: e.detail.value })} />
          </View>
        </View>
      </Modal>

      <Modal
        title={selectedTopic?.title || ''}
        visible={showDetail}
        confirmText="关闭"
        onCancel={() => setShowDetail(false)}
        onConfirm={() => setShowDetail(false)}
      >
        {selectedTopic && (
          <ScrollView scrollY className={styles.detailContent}>
            <View className={styles.detailSection}>
              <Text className={styles.detailLabel}>简介</Text>
              <Text className={styles.detailValue}>{selectedTopic.description}</Text>
            </View>
            <View className={styles.detailSection}>
              <Text className={styles.detailLabel}>嘉宾</Text>
              <View className={styles.tagList}>
                {selectedTopic.guests.map((guest, i) => (
                  <Text key={i} className={styles.tag}>{guest}</Text>
                ))}
              </View>
            </View>
            <View className={styles.detailSection}>
              <Text className={styles.detailLabel}>受众问题</Text>
              {selectedTopic.audienceQuestions.map((q, i) => (
                <Text key={i} className={styles.detailValue}>{i + 1}. {q}</Text>
              ))}
            </View>
            <View className={styles.detailSection}>
              <Text className={styles.detailLabel}>参考资料</Text>
              {selectedTopic.references.map((ref, i) => (
                <Text key={i} className={styles.detailValue}>{i + 1}. {ref}</Text>
              ))}
            </View>
            <View className={styles.detailSection}>
              <Text className={styles.detailLabel}>预期亮点</Text>
              {selectedTopic.highlights.map((h, i) => (
                <Text key={i} className={styles.detailValue}>{i + 1}. {h}</Text>
              ))}
            </View>
            <View className={styles.voteSection}>
              <Text className={styles.detailLabel}>投票</Text>
              <View className={styles.voteButtons}>
                <Button className={styles.voteBtn} onClick={() => handleVote('approve')}>
                  <Text className={styles.voteText}>赞成 {getVoteStats(selectedTopic).approve}</Text>
                </Button>
                <Button className={styles.voteBtn} onClick={() => handleVote('reject')}>
                  <Text className={styles.voteText}>反对 {getVoteStats(selectedTopic).reject}</Text>
                </Button>
              </View>
            </View>
            <View className={styles.commentSection}>
              <Text className={styles.detailLabel}>评论 ({selectedTopic.comments.length})</Text>
              {selectedTopic.comments.length > 0 ? (
                <View className={styles.commentList}>
                  {selectedTopic.comments.map(comment => (
                    <View key={comment.id} className={styles.commentItem}>
                      <Text className={styles.commentUser}>{comment.userName}</Text>
                      <Text className={styles.commentContent}>{comment.content}</Text>
                      <Text className={styles.commentTime}>{comment.createdAt}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text className={styles.noComment}>暂无评论</Text>
              )}
              <View className={styles.commentInput}>
                <Input className={styles.commentField} placeholder="发表评论" value={commentText} onChange={e => setCommentText(e.detail.value)} />
                <Button className={styles.commentBtn} onClick={handleAddComment}>
                  <Text className={styles.commentBtnText}>发送</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        )}
      </Modal>

      <View className={styles.bottomSpace} />
    </ScrollView>
  );
};

export default TopicPage;