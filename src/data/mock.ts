import type { Topic, Inspiration, ScheduleItem, ArchiveItem } from '@/types';

export const mockTopics: Topic[] = [
  {
    id: '1',
    title: '人工智能时代的创意工作',
    description: '探讨AI如何影响创意产业，以及创意工作者如何应对',
    guests: ['李明', '王芳'],
    audienceQuestions: ['AI会取代创意工作吗？', '如何利用AI提升效率？'],
    references: ['《AI时代的创造力》', '相关研究报告'],
    highlights: ['最新AI工具介绍', '行业专家观点', '实战案例分享'],
    status: 'pending',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    comments: [
      { id: 'c1', userId: 'u1', userName: '张三', content: '这个话题很有深度！', createdAt: '2024-01-15 10:30' }
    ],
    votes: [
      { id: 'v1', userId: 'u1', userName: '张三', choice: 'approve', createdAt: '2024-01-15' },
      { id: 'v2', userId: 'u2', userName: '李四', choice: 'approve', createdAt: '2024-01-15' }
    ],
    rating: { freshness: 9, depth: 8, difficulty: 6, average: 7.7 }
  },
  {
    id: '2',
    title: '远程办公的未来趋势',
    description: '分析后疫情时代远程办公的发展趋势和挑战',
    guests: ['陈静'],
    audienceQuestions: ['远程办公如何保持团队协作？', '如何平衡工作与生活？'],
    references: ['远程办公调研报告', '企业实践案例'],
    highlights: ['全球远程办公数据', '企业管理经验', '员工体验分享'],
    status: 'recording',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14',
    comments: [],
    votes: [],
    rating: { freshness: 7, depth: 7, difficulty: 5, average: 6.3 }
  },
  {
    id: '3',
    title: '可持续消费的新机遇',
    description: '探索可持续消费市场的新兴机遇和商业模式',
    guests: ['刘洋', '赵雪'],
    audienceQuestions: ['消费者愿意为可持续产品付费吗？', '企业如何实现可持续转型？'],
    references: ['可持续消费白皮书', '行业分析报告'],
    highlights: ['市场数据解读', '成功品牌案例', '未来趋势预测'],
    status: 'editing',
    createdAt: '2024-01-13',
    updatedAt: '2024-01-13',
    comments: [
      { id: 'c2', userId: 'u2', userName: '李四', content: '期待这期节目！', createdAt: '2024-01-13 14:20' }
    ],
    votes: [
      { id: 'v3', userId: 'u1', userName: '张三', choice: 'approve', createdAt: '2024-01-13' }
    ],
    rating: { freshness: 8, depth: 7, difficulty: 6, average: 7.0 }
  },
  {
    id: '4',
    title: '心理健康与数字生活',
    description: '讨论数字时代如何维护心理健康',
    guests: ['孙医生'],
    audienceQuestions: ['如何减少社交媒体对心理的影响？', '数字时代的心理健康挑战有哪些？'],
    references: ['心理健康研究报告', '相关书籍'],
    highlights: ['专家解读', '实用建议', '听众故事'],
    status: 'pending-publish',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12',
    comments: [],
    votes: [],
    rating: { freshness: 8, depth: 9, difficulty: 5, average: 7.3 }
  },
  {
    id: '5',
    title: '创业路上的坑与成长',
    description: '分享创业者的真实经历和经验教训',
    guests: ['周总'],
    audienceQuestions: ['创业最容易踩的坑是什么？', '如何判断一个想法是否值得投入？'],
    references: ['创业书籍', '成功案例'],
    highlights: ['失败案例分析', '成功经验总结', '给新手的建议'],
    status: 'published',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
    comments: [
      { id: 'c3', userId: 'u3', userName: '王五', content: '非常有价值的分享！', createdAt: '2024-01-10 16:00' }
    ],
    votes: [],
    rating: { freshness: 6, depth: 8, difficulty: 5, average: 6.3 }
  }
];

export const mockInspirations: Inspiration[] = [
  {
    id: 'i1',
    type: 'listener',
    title: '听众提问：关于时间管理',
    content: '很多听众留言希望聊一聊高效时间管理的方法，特别是如何平衡工作和学习',
    tags: ['时间管理', '效率'],
    createdAt: '2024-01-15',
    isConverted: false
  },
  {
    id: 'i2',
    type: 'hot',
    title: 'ChatGPT引爆AI热潮',
    content: 'OpenAI发布的ChatGPT引发广泛关注，讨论AI对各行各业的影响',
    source: '新闻头条',
    tags: ['AI', '热点'],
    createdAt: '2024-01-14',
    isConverted: true
  },
  {
    id: 'i3',
    type: 'media',
    title: '《置身事内》读书心得',
    content: '这本书从政府视角解读中国经济发展，非常有深度的分析',
    source: '书籍',
    tags: ['读书', '经济'],
    createdAt: '2024-01-13',
    isConverted: false
  },
  {
    id: 'i4',
    type: 'listener',
    title: '听众建议：职业发展话题',
    content: '多位听众建议增加职业发展相关的话题，包括职业选择、职场晋升等',
    tags: ['职业', '职场'],
    createdAt: '2024-01-12',
    isConverted: false
  },
  {
    id: 'i5',
    type: 'hot',
    title: '元宇宙概念持续升温',
    content: '各大科技公司纷纷布局元宇宙，探讨元宇宙的未来可能性',
    source: '科技新闻',
    tags: ['元宇宙', '科技'],
    createdAt: '2024-01-11',
    isConverted: true
  },
  {
    id: 'i6',
    type: 'media',
    title: '电影《瞬息全宇宙》观后感',
    content: '这部电影以独特的视角探讨人生意义，引发很多思考',
    source: '电影',
    tags: ['电影', '人生'],
    createdAt: '2024-01-10',
    isConverted: false
  }
];

export const mockSchedule: ScheduleItem[] = [
  {
    id: 's1',
    topicId: '1',
    topicTitle: '人工智能时代的创意工作',
    type: 'record',
    date: '2024-01-20',
    time: '14:00',
    location: '线上会议室',
    participants: ['李明', '王芳'],
    status: 'pending'
  },
  {
    id: 's2',
    topicId: '4',
    topicTitle: '心理健康与数字生活',
    type: 'publish',
    date: '2024-01-21',
    time: '08:00',
    participants: [],
    status: 'pending'
  },
  {
    id: 's3',
    topicId: '2',
    topicTitle: '远程办公的未来趋势',
    type: 'record',
    date: '2024-01-18',
    time: '10:00',
    location: '工作室',
    participants: ['陈静'],
    status: 'completed'
  },
  {
    id: 's4',
    topicId: '3',
    topicTitle: '可持续消费的新机遇',
    type: 'record',
    date: '2024-01-16',
    time: '15:00',
    location: '线上会议室',
    participants: ['刘洋', '赵雪'],
    status: 'completed'
  }
];

export const mockArchives: ArchiveItem[] = [
  {
    id: 'a1',
    topicId: '5',
    title: '创业路上的坑与成长',
    publishDate: '2024-01-10',
    playCount: 12580,
    feedback: '听众反馈非常积极，很多人表示深受启发',
    review: '这期节目整体效果不错，嘉宾分享很真诚。可以考虑做一个创业系列。',
    series: '创业系列'
  },
  {
    id: 'a2',
    topicId: 'a2',
    title: '数字化转型的挑战与机遇',
    publishDate: '2024-01-08',
    playCount: 8920,
    feedback: '专业内容，适合对企业数字化感兴趣的听众',
    review: '内容偏专业，建议增加更多案例分析。',
    series: '数字化系列'
  },
  {
    id: 'a3',
    topicId: 'a3',
    title: '读书的意义与方法',
    publishDate: '2024-01-05',
    playCount: 15680,
    feedback: '非常受欢迎的一期，听众互动热烈',
    review: '可以考虑做读书俱乐部系列，定期推荐好书。',
    series: '读书俱乐部'
  },
  {
    id: 'a4',
    topicId: 'a4',
    title: '健康生活方式分享',
    publishDate: '2024-01-03',
    playCount: 9870,
    feedback: '实用信息多，听众表示收获很大',
    review: '内容很好，可以结合季节做更多健康主题。'
  }
];