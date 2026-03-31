export type ContentStatus = 'draft' | 'review' | 'approved' | 'scheduled' | 'published';
export type ContentType = 'blog' | 'linkedin' | 'twitter' | 'newsletter';

export interface ContentItem {
  id: string;
  title: string;
  body: string;
  contentType: ContentType;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  scheduledFor?: string;
  publishedAt?: string;
  topic: string;
  wordCount: number;
  imageUrl?: string;
  researchNotes?: ResearchNote[];
  tags: string[];
}

export interface ResearchNote {
  id: string;
  topic: string;
  findings: string;
  sources: string[];
  createdAt: string;
}

export interface GenerationRun {
  id: string;
  inputPrompt: string;
  contentType: ContentType;
  status: 'running' | 'completed' | 'failed';
  steps: StreamStep[];
  startedAt: string;
  completedAt?: string;
  contentId?: string;
}

export interface StreamStep {
  id: string;
  type: 'planning' | 'researching' | 'writing' | 'generating_image' | 'reviewing' | 'completed';
  message: string;
  timestamp: string;
  detail?: string;
}

export interface BrandSettings {
  tone: string;
  audience: string;
  styleGuidelines: string;
  blogTemplate: string;
  linkedinTemplate: string;
  twitterTemplate: string;
  companyName: string;
  industry: string;
}

export interface ScheduleItem {
  id: string;
  contentId: string;
  contentTitle: string;
  contentType: ContentType;
  publishAt: string;
  platform: string;
  status: ContentStatus;
}

export interface DashboardStats {
  totalContent: number;
  published: number;
  scheduled: number;
  drafts: number;
  generatedThisWeek: number;
  publishRate: number;
}
