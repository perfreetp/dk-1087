import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import Taro from '@tarojs/taro';
import type { Topic, Inspiration, ScheduleItem, ArchiveItem, StatusSummary } from '@/types';
import { mockTopics, mockInspirations, mockSchedule, mockArchives } from '@/data/mock';

const STORAGE_KEY = 'podcast_assistant_data';

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
  getMonthlySummary: (month: number, year: number) => StatusSummary;
  exportOutline: (topicId: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const loadFromStorage = (): { topics: Topic[]; inspirations: Inspiration[]; schedule: ScheduleItem[] } => {
  try {
    const stored = Taro.getStorageSync(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load from storage:', e);
  }
  return { topics: [...mockTopics], inspirations: [...mockInspirations], schedule: [...mockSchedule] };
};

const saveToStorage = (data: { topics: Topic[]; inspirations: Inspiration[]; schedule: ScheduleItem[] }) => {
  try {
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to storage:', e);
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [storageData, setStorageData] = useState<{ topics: Topic[]; inspirations: Inspiration[]; schedule: ScheduleItem[] }>(loadFromStorage);
  
  const topics = storageData.topics;
  const inspirations = storageData.inspirations;
  const schedule = storageData.schedule;
  const archives = mockArchives;

  useEffect(() => {
    saveToStorage(storageData);
  }, [storageData]);

  const addTopic = useCallback((topicData: Omit<Topic, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'votes'>) => {
    const newTopic: Topic = {
      ...topicData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      comments: [],
      votes: []
    };
    setStorageData(prev => ({ ...prev, topics: [newTopic, ...prev.topics] }));
  }, []);

  const updateTopic = useCallback((id: string, updates: Partial<Topic>) => {
    setStorageData(prev => ({ 
      ...prev, 
      topics: prev.topics.map(topic => 
        topic.id === id ? { ...topic, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : topic
      )
    }));
  }, []);

  const deleteTopic = useCallback((id: string) => {
    setStorageData(prev => ({ ...prev, topics: prev.topics.filter(topic => topic.id !== id) }));
  }, []);

  const addComment = useCallback((topicId: string, content: string) => {
    const newComment = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: '当前用户',
      content,
      createdAt: new Date().toLocaleString()
    };
    setStorageData(prev => ({ 
      ...prev,
      topics: prev.topics.map(topic => 
        topic.id === topicId ? { ...topic, comments: [...topic.comments, newComment] } : topic
      )
    }));
  }, []);

  const addVote = useCallback((topicId: string, choice: 'approve' | 'reject') => {
    const newVote = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: '当前用户',
      choice,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setStorageData(prev => ({ 
      ...prev,
      topics: prev.topics.map(topic => 
        topic.id === topicId ? { ...topic, votes: [...topic.votes, newVote] } : topic
      )
    }));
  }, []);

  const addInspiration = useCallback((inspirationData: Omit<Inspiration, 'id' | 'createdAt' | 'isConverted'>) => {
    const newInspiration: Inspiration = {
      ...inspirationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      isConverted: false
    };
    setStorageData(prev => ({ ...prev, inspirations: [newInspiration, ...prev.inspirations] }));
  }, []);

  const convertInspiration = useCallback((id: string) => {
    setStorageData(prev => {
      const inspiration = prev.inspirations.find(insp => insp.id === id);
      if (!inspiration || inspiration.isConverted) {
        return prev;
      }
      
      const newTopic: Topic = {
        id: Date.now().toString(),
        title: inspiration.title,
        description: inspiration.content,
        guests: [],
        audienceQuestions: [],
        references: inspiration.source ? [inspiration.source] : [],
        highlights: [],
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        comments: [],
        votes: []
      };
      
      return {
        ...prev,
        inspirations: prev.inspirations.map(insp => 
          insp.id === id ? { ...insp, isConverted: true } : insp
        ),
        topics: [newTopic, ...prev.topics]
      };
    });
  }, []);

  const addSchedule = useCallback((itemData: Omit<ScheduleItem, 'id' | 'status'>) => {
    const newItem: ScheduleItem = {
      ...itemData,
      id: Date.now().toString(),
      status: 'pending'
    };
    setStorageData(prev => ({ ...prev, schedule: [...prev.schedule, newItem] }));
  }, []);

  const updateSchedule = useCallback((id: string, updates: Partial<ScheduleItem>) => {
    setStorageData(prev => ({ 
      ...prev,
      schedule: prev.schedule.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    }));
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

  const getMonthlySummary = useCallback((month: number, year: number): StatusSummary => {
    const summary: StatusSummary = { pending: 0, recording: 0, editing: 0, pendingPublish: 0, published: 0 };
    topics.forEach(topic => {
      const topicDate = new Date(topic.createdAt);
      if (topicDate.getMonth() === month && topicDate.getFullYear() === year) {
        switch (topic.status) {
          case 'pending': summary.pending++; break;
          case 'recording': summary.recording++; break;
          case 'editing': summary.editing++; break;
          case 'pending-publish': summary.pendingPublish++; break;
          case 'published': summary.published++; break;
        }
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
    outline += `嘉宾：${topic.guests.join('、') || '无'}\n\n`;
    outline += `听众问题：\n`;
    if (topic.audienceQuestions.length > 0) {
      topic.audienceQuestions.forEach((q, i) => outline += `${i + 1}. ${q}\n`);
    } else {
      outline += `暂无\n`;
    }
    outline += `\n参考资料：\n`;
    if (topic.references.length > 0) {
      topic.references.forEach((ref, i) => outline += `${i + 1}. ${ref}\n`);
    } else {
      outline += `暂无\n`;
    }
    outline += `\n预期亮点：\n`;
    if (topic.highlights.length > 0) {
      topic.highlights.forEach((h, i) => outline += `${i + 1}. ${h}\n`);
    } else {
      outline += `暂无\n`;
    }
    
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
      getMonthlySummary,
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