export interface Topic {
  id: string;
  title: string;
  description: string;
  guests: string[];
  audienceQuestions: string[];
  references: string[];
  highlights: string[];
  status: 'pending' | 'recording' | 'editing' | 'pending-publish' | 'published';
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  votes: Vote[];
  rating?: Rating;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Vote {
  id: string;
  userId: string;
  userName: string;
  choice: 'approve' | 'reject';
  createdAt: string;
}

export interface Rating {
  freshness: number;
  depth: number;
  difficulty: number;
  average: number;
}

export interface Inspiration {
  id: string;
  type: 'listener' | 'hot' | 'media';
  title: string;
  content: string;
  source?: string;
  tags: string[];
  createdAt: string;
  isConverted: boolean;
}

export interface ScheduleItem {
  id: string;
  topicId: string;
  topicTitle: string;
  type: 'record' | 'publish';
  date: string;
  time: string;
  location?: string;
  participants: string[];
  status: 'pending' | 'completed' | 'overdue';
}

export interface ArchiveItem {
  id: string;
  topicId: string;
  title: string;
  publishDate: string;
  playCount: number;
  feedback: string;
  review: string;
  series?: string;
}

export interface StatusSummary {
  pending: number;
  recording: number;
  editing: number;
  pendingPublish: number;
  published: number;
}