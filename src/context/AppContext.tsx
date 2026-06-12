import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Topic, Inspiration, ScheduleItem, ArchiveItem, StatusSummary } from '@/types';
import { mockTopics, mockInspirations, mockSchedule, mockArchives } from '@/data/mock';

interface AppContextType {
  topics: Topic[];
  inspirations: Inspiration[];
  schedule: ScheduleItem[];
  archives: ArchiveItem[];
  addTopic: (topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'votes'>) => void;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;
  addComment: (topicId: string, content: string) => void;
  addVote: (topicId: string, choice: 'approve' | 'reject') => void;
  addInspiration: (inspiration: Omit<Inspiration, 'id' | 'createdAt' | 'isConverted'>) => void;
  convertInspiration: (id: string) => void;
  addSchedule: (item: Omit<ScheduleItem, 'id' | 'status'>) => void;
  updateSchedule: (id: string, updates: Partial<ScheduleItem>) => void;
  getStatusSummary: () => StatusSummary;
  exportOutline: (topicId: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [topics, setTopics] = useState<Topic[]>(mockTopics);
  const [inspirations, setInspirations] = useState<Inspiration[]>(mockInspirations);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(mockSchedule);
  const [archives] = useState<ArchiveItem[]>(mockArchives);

  const addTopic = useCallback((topicData: Omit<Topic, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'votes'>) => {
    const newTopic: Topic = {
      ...topicData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      comments: [],
      votes: []
    };
    setTopics(prev => [newTopic, ...prev]);
  }, []);

  const updateTopic = useCallback((id: string, updates: Partial<Topic>) => {
    setTopics(prev => prev.map(topic => 
      topic.id === id ? { ...topic, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : topic
    ));
  }, []);

  const deleteTopic = useCallback((id: string) => {
    setTopics(prev => prev.filter(topic => topic.id !== id));
  }, []);

  const addComment = useCallback((topicId: string, content: string) => {
    const newComment = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: '当前用户',
      content,
      createdAt: new Date().toLocaleString()
    };
    setTopics(prev => prev.map(topic => 
      topic.id === topicId ? { ...topic, comments: [...topic.comments, newComment] } : topic
    ));
  }, []);

  const addVote = useCallback((topicId: string, choice: 'approve' | 'reject') => {
    const newVote = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: '当前用户',
      choice,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTopics(prev => prev.map(topic => 
      topic.id === topicId ? { ...topic, votes: [...topic.votes, newVote] } : topic
    ));
  }, []);

  const addInspiration = useCallback((inspirationData: Omit<Inspiration, 'id' | 'createdAt' | 'isConverted'>) => {
    const newInspiration: Inspiration = {
      ...inspirationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      isConverted: false
    };
    setInspirations(prev => [newInspiration, ...prev]);
  }, []);

  const convertInspiration = useCallback((id: string) => {
    setInspirations(prev => prev.map(insp => 
      insp.id === id ? { ...insp, isConverted: true } : insp
    ));
  }, []);

  const addSchedule = useCallback((itemData: Omit<ScheduleItem, 'id' | 'status'>) => {
    const newItem: ScheduleItem = {
      ...itemData,
      id: Date.now().toString(),
      status: 'pending'
    };
    setSchedule(prev => [...prev, newItem]);
  }, []);

  const updateSchedule = useCallback((id: string, updates: Partial<ScheduleItem>) => {
    setSchedule(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const getStatusSummary = useCallback((): StatusSummary => {
    const summary: StatusSummary = { pending: 0, recording: 0, editing: 0, pendingPublish: 0, published: 0 };
    topics.forEach(topic => {
      switch (topic.status) {
        case 'pending': summary.pending++; break;
        case 'recording': summary.recording++; break;
        case 'editing': summary.editing++; break;
        case 'pending-publish': summary.pendingPublish++; break;
        case 'published': summary.published++; break;
      }
    });
    return summary;
  }, [topics]);

  const exportOutline = useCallback((topicId: string): string => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return '';
    
    let outline = `【录制提纲】\n\n`;
    outline += `主题：${topic.title}\n\n`;
    outline += `简介：${topic.description}\n\n`;
    outline += `嘉宾：${topic.guests.join('、')}\n\n`;
    outline += `听众问题：\n`;
    topic.audienceQuestions.forEach((q, i) => outline += `${i + 1}. ${q}\n`);
    outline += `\n参考资料：\n`;
    topic.references.forEach((ref, i) => outline += `${i + 1}. ${ref}\n`);
    outline += `\n预期亮点：\n`;
    topic.highlights.forEach((h, i) => outline += `${i + 1}. ${h}\n`);
    
    return outline;
  }, [topics]);

  return (
    <AppContext.Provider value={{
      topics,
      inspirations,
      schedule,
      archives,
      addTopic,
      updateTopic,
      deleteTopic,
      addComment,
      addVote,
      addInspiration,
      convertInspiration,
      addSchedule,
      updateSchedule,
      getStatusSummary,
      exportOutline
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};