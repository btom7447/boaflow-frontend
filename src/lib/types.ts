// ─── Auth ────────────────────────────────────────────────

import { PlanKey } from "./plans";

export type Role = "admin" | "sales" | "client" 

export interface User {
  id: number;
  email: string;
  role: "admin" | "sales" | "client";
  full_name: string | null;
  avatar: string | null; 
  organization_id: number; 
  organization?: Organization; 
  token?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  role: Role;
  full_name: string | null;
  avatar?: string;
  id: number;
  organization_id: number;
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

// ─── Search Configurations ──────────────────────────────────────────

export interface SearchConfiguration {
  id: number;
  organization_id: number;
  name: string;
  description: string | null;
  criteria_prompt: string;
  check_website: boolean;
  check_google_reviews: boolean;
  check_social_media: boolean;
  check_jobs_page: boolean;
  use_email_finder: boolean;
  use_clearbit: boolean;
  is_active: boolean;
  created_by: number | null;
  created_at: string;
  updated_at: string | null;
}

export interface SearchConfigurationCreate {
  name: string;
  description?: string;
  criteria_prompt: string;
  check_website?: boolean;
  check_google_reviews?: boolean;
  check_social_media?: boolean;
  check_jobs_page?: boolean;
  use_email_finder?: boolean;
  use_clearbit?: boolean;
}

export interface SearchConfigurationUpdate {
  name?: string;
  description?: string;
  criteria_prompt?: string;
  check_website?: boolean;
  check_google_reviews?: boolean;
  check_social_media?: boolean;
  check_jobs_page?: boolean;
  use_email_finder?: boolean;
  use_clearbit?: boolean;
  is_active?: boolean;
}

// ─── Organization ───────────────────────────────────────────────────

export interface Organization {
  id: number;
  name: string;
  slug: string;
  plan: PlanKey;
  monthly_search_limit: number;
  monthly_searches_used: number;
  billing_email: string | null;
  is_active: boolean;
  created_at: string;
  trial_ends_at: string | null;
}

export interface OrganizationStats {
  searches_remaining: number;
  searches_used: number;
  searches_limit: number;
  usage_percentage: number;
  total_leads: number;
  total_configurations: number;
  team_members: number;
}

// ─── UI ───────────────────────────────────────────────────
export interface PipelineTableRun {
  id: number;
  status: string;
  leads_found: number;
  leads_match: number;
  created_at: string;
}