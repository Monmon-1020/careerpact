export enum SkillType {
  WRITING = "文章作成",
  DATA_ENTRY = "データ入力", 
  CUSTOMER_SUPPORT = "カスタマーサポート",
  DESIGN = "デザイン",
  TRANSLATION = "翻訳"
}

export enum ContactMethod {
  SLACK = "Slack",
  EMAIL = "メール", 
  PHONE = "電話"
}

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  SUPPORT_NEEDED = "support_needed"
}

export interface UserProfile {
  available_days: string[];
  available_time_slots: string[];
  weekly_hours: number;
  skills: SkillType[];
  preferred_contact: ContactMethod;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  estimated_hours: number;
  required_skills: SkillType[];
  priority: number;
  status: TaskStatus;
}

export interface DigitalBadge {
  id: string;
  title: string;
  description: string;
  issued_date: string;
  issuer_company: string;
  task_id: string;
}