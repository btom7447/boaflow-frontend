// ─── Auth ────────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  role: "admin" | "sales" | "client";
  full_name: string | null;
  avatar: string | null; // base64 encoded image
  token?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  role: string;
  full_name: string | null;
}

// ─── Leads ───────────────────────────────────────────────

export type FitType = "yes" | "no" | "maybe" | "unclassified";
export type LeadStatus =
  | "new"
  | "contacted"
  | "interested"
  | "not_interested"
  | "converted"
  | "ignored";

export interface Lead {
  id: number;
  company_id: number | null;
  title: string;
  job_url: string;
  location: string | null;
  remote_flag: string | null;
  boaflow_fit: FitType | null;
  confidence: number | null;
  role_type: string | null;
  reasons: string | null; // JSON string — parse before display
  suggested_pitch: string | null;
  lead_status: LeadStatus | null;
  notes: string | null;
  assigned_to: string | null;
  first_seen_at: string;
  notified: boolean;
}

export interface LeadUpdate {
  lead_status?: LeadStatus;
  notes?: string;
  assigned_to?: string;
}

export interface LeadFilters {
  fit?: FitType;
  status?: LeadStatus;
  role_type?: string;
  min_confidence?: number;
  limit?: number;
  offset?: number;
}

// ─── Pipeline ────────────────────────────────────────────

export type RunStatus = "queued" | "running" | "completed" | "failed";

export interface PipelineRun {
  id: number;
  status: RunStatus;
  triggered_by: string | null;
  companies_total: number;
  companies_processed: number;
  jobs_found: number;
  jobs_new: number;
  leads_yes: number;
  leads_maybe: number;
  leads_no: number;
  errors: number;
  dry_run: boolean;
  async_mode: boolean;
  csv_path: string | null;
  error_message: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

export interface CompanyRow {
  name: string;
  website_url: string;
  industry?: string;
  location?: string;
}

export interface TriggerPipelineRequest {
  input_file?: string;
  companies?: CompanyRow[];
  limit?: number | null;
  dry_run?: boolean;
  async_mode?: boolean;
  concurrency?: number;
}

// ─── Settings ────────────────────────────────────────────

export interface RoleConfig {
  id: number;
  key: string;
  label: string;
  description: string;
  examples: string | null; // JSON string — parse before display
  is_active: boolean;
  updated_at: string | null;
  updated_by: string | null;
}

export interface FitCriteria {
  id: number;
  criteria_type: "required_for_fit" | "automatic_disqualifier";
  text: string;
  is_active: boolean;
}

export interface AppUser {
  id: number;
  email: string;
  full_name?: string;
  role: "admin" | "sales" | "client";
  is_active: boolean;
}

// ─── API Responses ────────────────────────────────────────

export interface ApiError {
  detail: string;
}
