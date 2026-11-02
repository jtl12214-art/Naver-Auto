/**
 * NAVER Trend Studio - Shared Types & Contracts
 */

// Health Check API Response
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  backendPid?: number;
  instanceId?: string;
  startedAt?: string;
  serverPort?: number;
  desktopName?: string;
  isInteractiveDesktop?: boolean;
}

// Browser Status State Machine
export type BrowserStatus =
  | 'DISCONNECTED'
  | 'LAUNCHING'
  | 'BROWSER_OPEN'
  | 'LOGIN_REQUIRED'
  | 'AUTHENTICATED'
  | 'ERROR';

export interface BrowserStatusResponse {
  status: BrowserStatus;
  message?: string;
  connectedAt?: string;
  profilePath?: string;
  currentUrl?: string;
  channel?: string;
  error?: string | null;
  uiVerified?: boolean;
  chromePid?: number;
  chromeSessionId?: number;
  desktopName?: string;
  isInteractiveDesktop?: boolean;
}

// Category
export interface Category {
  id: string;
  name: string;
  displayOrder: number;
  referenceDate: string;
  createdAt: string;
}

// Keyword
export interface Keyword {
  id: string;
  categoryId: string;
  keyword: string;
  rank: number;
  rankChange?: number | null;
  trafficRatio?: number | null;
  referenceDate: string;
  collectedAt: string;
  sourceType: 'AUTHORIZED' | 'MANUAL' | 'MOCK';
  postCount?: number;
}

// Post Top 5
export interface Post {
  id: string;
  keywordId: string;
  rank: number;
  rankType?: string | null;
  title: string;
  blogName: string;
  postUrl: string;
  blogUrl?: string | null;
  referenceDate: string;
  collectedAt: string;
  sourceType: 'AUTHORIZED' | 'MANUAL' | 'MOCK';
  selected?: boolean;
}

// Selection item
export interface Selection {
  id: string;
  keywordId: string;
  postId?: string | null;
  createdAt: string;
}

// API General Response Format
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
