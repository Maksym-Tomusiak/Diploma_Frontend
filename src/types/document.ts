export enum DocumentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface Document {
  id: number;
  google_doc_id: string;
  title: string | null;
  status: DocumentStatus;
  created_at: string;
}

export interface DocumentCreate {
  google_doc_id: string;
  template_id: number;
}

export interface Template {
  id: number;
  name: string;
  description: string;
  params: TemplateParams;
  is_active: boolean;
  created_at: string;
}

export interface TemplateParams {
  page?: Record<string, any>;
  typography?: Record<string, any>;
  headings?: Record<string, any>;
  numbering?: Record<string, any>;
}

export interface Issue {
  type: string;
  severity: "low" | "medium" | "high";
  details: string;
}

export interface CheckResult {
  id: number;
  document_id: number;
  template_id: number;
  passed: boolean;
  overall_score: number | null;
  issues_count: number;
  issues: Issue[];
  processing_time_ms: number;
  created_at: string;
}
