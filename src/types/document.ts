export enum DocumentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface Document {
  id: string;
  google_doc_id: string;
  title: string | null;
  status: DocumentStatus;
  created_at: string;
  last_checked_at: string | null;
}

export interface Font {
  id: number;
  family: string;
  category: string | null;
  variants: string | null;
  subsets: string | null;
  version: string | null;
  last_modified: string | null;
  created_at: string;
}

export interface DocumentCreate {
  google_doc_id: string;
  template_id: number;
  title?: string;
}

export interface Template {
  id: number;
  name: string;
  description: string;
  font_id: number | null;
  font_family: string | null; // Returned from API for convenience
  params: TemplateParams;
  is_active: boolean;
  created_at: string;
}

export interface PageMargins {
  top: number; // Відступ зверху (мм)
  bottom: number; // Відступ знизу (мм)
  left: number; // Відступ зліва (мм)
  right: number; // Відступ справа (мм)
}

export interface TemplateParams {
  font_size: number; // Розмір шрифту
  line_spacing: number; // Міжрядковий інтервал
  margins: PageMargins; // Відступи для сторінок
  check_numbering: boolean; // Чи перевіряти нумерацію сторінок
  start_from_number: number; // З якого номера починати нумерацію
  skip_first_page: boolean; // Чи пропускати першу сторінку (перша сторінка без номера)
}

export interface TemplateCreate {
  name: string;
  description: string;
  font_id?: number | null;
  params: TemplateParams;
}

export interface TemplateUpdate {
  name?: string;
  description?: string;
  font_id?: number | null;
  params?: TemplateParams;
  is_active?: boolean;
}

export interface Issue {
  type: string;
  severity: "low" | "medium" | "high";
  details: string;
  expected?: string;
  actual?: string;
}

// Request body for checking a document
export interface CheckDocumentRequest {
  template_id?: number;
  custom_params?: TemplateParams;
  font_family?: string;
}

export interface CheckResult {
  id: string;
  document_id: string;
  template_id: number | null;
  custom_params?: TemplateParams | null;
  custom_font_family?: string | null;
  passed: boolean;
  overall_score: number | null;
  issues_count: number;
  issues: Issue[];
  processing_time_ms: number;
  created_at: string;
}

// Request body for formatting a document
export interface FormatDocumentRequest {
  template_id?: number;
  custom_params?: TemplateParams;
  font_family?: string;
}

// Format change applied to document
export interface FormatChange {
  type: string;
  description: string;
  before?: string | null;
  after?: string | null;
}

// Result of format operation
export interface FormatResult {
  success: boolean;
  changes_applied: number;
  changes: FormatChange[];
  processing_time_ms: number;
  document_title?: string | null;
  error_message?: string | null;
}
