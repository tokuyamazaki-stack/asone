// ===== 基本型定義 =====

export type Role = 'admin' | 'coach' | 'player' | 'parent';

export interface User {
  id: string;
  password: string;
  name: string;
  role: Role;
  roleLabel: string;
}

export interface Evaluation {
  heart: number;
  head: number;
  tech: number;
  body: number;
}

export interface EvalHistory extends Evaluation {
  date: string;
  evaluator: string;
  evaluatorName: string;
  comment: string;
}

export interface Player {
  id: number;
  name: string;
  number: number;
  position: string;
  grade: string;
  age: number;
  height: number;
  weight: number;
  contact: string;
  parentName: string;
  joinDate: string;
  notes: string;
  evaluation: Evaluation;
}

export interface Staff {
  id: number;
  name: string;
  role: string;
  roleLabel: string;
  license: string;
  experience: string;
  contact: string;
  joinDate: string;
}

export interface ReportComment {
  id: number;
  author: string;
  role: string;
  content: string;
  timestamp: string;
}

export interface WeeklyReport {
  id: number;
  weekLabel: string;
  startDate: string;
  endDate: string;
  author: string;
  authorRole: string;
  trainingDays: number;
  practiceContent: string;
  match: string;
  goodPoints: string;
  improvements: string;
  nextWeekPlan: string;
  status: 'published' | 'draft';
  tags: string[];
  comments: ReportComment[];
}

export interface ChatMessage {
  id: number;
  sender: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Notice {
  id: number;
  type: string;
  title: string;
  content: string;
  date: string;
  important: boolean;
}

export interface CheckItem {
  id: string;
  label: string;
  done: boolean;
}

export interface Checklists {
  daily: CheckItem[];
  weekly: CheckItem[];
  monthly: CheckItem[];
}
