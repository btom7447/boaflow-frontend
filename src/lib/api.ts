import axios, { AxiosInstance, AxiosError } from "axios";
import {
  TokenResponse,
  User,
  Lead,
  LeadUpdate,
  LeadFilters,
  PipelineRun,
  TriggerPipelineRequest,
  RoleConfig,
  FitCriteria,
  AppUser,
  LeadStatus,
  SearchConfiguration,
  SearchConfigurationCreate,
  SearchConfigurationUpdate,
  OrganizationStats,
  Organization,
} from "./types";

// ─── Client Setup ─────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Inject auth token from localStorage on every request
client.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("boaflow_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Global error handler — 401 clears session and redirects to login
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("boaflow_token");
        localStorage.removeItem("boaflow_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// ─── Auth ─────────────────────────────────────────────────

export const authApi = {
  login: async (email: string, password: string): Promise<TokenResponse> => {
    const { data } = await client.post<TokenResponse>("/api/auth/login", {
      email,
      password,
    });
    return data;
  },

  me: async (token?: string): Promise<User> => {
    const { data } = await client.get<User>("/api/auth/me", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data;
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<void> => {
    await client.post("/api/auth/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },
};

// ─── Profile ──────────────────────────────────────────────

export const profileApi = {
  updateProfile: async (payload: {
    full_name?: string
    avatar_base64?: string
  }): Promise<User> => {
    const { data } = await client.patch<User>("/api/profile/", payload)
    return data
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const { data } = await client.post<{ message: string }>(
      "/api/profile/change-password",
      {
        current_password: currentPassword,
        new_password: newPassword,
      }
    )
    return data
  },
}

// ─── Leads ────────────────────────────────────────────────

export const leadsApi = {
  getLeads: async (
    filters: LeadFilters = {},
  ): Promise<{ data: Lead[]; total: number }> => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== null),
    );
    const response = await client.get<Lead[]>("/api/leads/", { params });
    const total = parseInt(response.headers["x-total-count"] ?? "0", 10);
    return { data: response.data, total };
  },

  getLead: async (id: number): Promise<Lead> => {
    const { data } = await client.get<Lead>(`/api/leads/${id}`);
    return data;
  },

  updateLead: async (id: number, update: LeadUpdate): Promise<Lead> => {
    const { data } = await client.patch<Lead>(`/api/leads/${id}`, update);
    return data;
  },

  // Add to leadsApi:
  bulkUpdateLeads: async (
    leadIds: number[],
    status: LeadStatus,
  ): Promise<{ updated: number; total: number }> => {
    const { data } = await client.patch<{ updated: number; total: number }>(
      "/api/leads/bulk-update",
      { lead_ids: leadIds, lead_status: status },
    );
    return data;
  },
};

// ─── Export ───────────────────────────────────────────────

export const exportApi = {
  exportLeadsCSV: async (filters: LeadFilters = {}): Promise<Blob> => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== null)
    )
    const response = await client.get("/api/export/leads", {
      params,
      responseType: "blob",
    })
    return response.data
  },
}

// ─── Pipeline ─────────────────────────────────────────────

export const pipelineApi = {
  getRuns: async (): Promise<PipelineRun[]> => {
    const { data } = await client.get<PipelineRun[]>("/api/pipeline/runs");
    return data;
  },

  getRun: async (id: number): Promise<PipelineRun> => {
    const { data } = await client.get<PipelineRun>(`/api/pipeline/runs/${id}`);
    return data;
  },

  triggerRun: async (request: TriggerPipelineRequest): Promise<PipelineRun> => {
    const { data } = await client.post<PipelineRun>(
      "/api/pipeline/run",
      request,
    );
    return data;
  },
};

// ─── Settings ─────────────────────────────────────────────

export const settingsApi = {
  getRoles: async (): Promise<RoleConfig[]> => {
    const { data } = await client.get<RoleConfig[]>("/api/settings/roles");
    return data;
  },

  createRole: async (
    payload: Omit<RoleConfig, "id" | "is_active" | "updated_at" | "updated_by">,
  ): Promise<RoleConfig> => {
    const { data } = await client.post<RoleConfig>(
      "/api/settings/roles",
      payload,
    );
    return data;
  },

  updateRole: async (
    id: number,
    payload: Partial<RoleConfig>,
  ): Promise<RoleConfig> => {
    const { data } = await client.patch<RoleConfig>(
      `/api/settings/roles/${id}`,
      payload,
    );
    return data;
  },

  deleteRole: async (id: number): Promise<void> => {
    await client.delete(`/api/settings/roles/${id}`);
  },

  getCriteria: async (): Promise<FitCriteria[]> => {
    const { data } = await client.get<FitCriteria[]>("/api/settings/criteria");
    return data;
  },

  createCriteria: async (
    payload: Omit<FitCriteria, "id" | "is_active">,
  ): Promise<FitCriteria> => {
    const { data } = await client.post<FitCriteria>(
      "/api/settings/criteria",
      payload,
    );
    return data;
  },

  deleteCriteria: async (id: number): Promise<void> => {
    await client.delete(`/api/settings/criteria/${id}`);
  },

  getUsers: async (): Promise<AppUser[]> => {
    const { data } = await client.get<AppUser[]>("/api/users/");
    return data;
  },

  createUser: async (payload: {
    email: string;
    password: string;
    full_name?: string;
    role: string;
  }): Promise<AppUser> => {
    const { data } = await client.post<AppUser>("/api/users/", payload);
    return data;
  },

  deactivateUser: async (id: number): Promise<void> => {
    await client.delete(`/api/users/${id}`);
  },
};

// ─── Dashboard ────────────────────────────────────────────

export const dashboardApi = {
  getStats: async (): Promise<{
    total_leads: number;
    leads_match: number;
    leads_no_match: number; 
    avg_confidence: number;
    conversion_rate: number;
    leads_over_time: { date: string; count: number }[];
    recent_runs: Array<{
      id: number;
      status: string;
      leads_found: number;
      leads_match: number;
      created_at: string;
    }>;
  }> => {
    const { data } = await client.get("/api/dashboard/stats");
    return data;
  },
};

// ─── Configurations ─────────────────────────────────────────────────

export const configurationsApi = {
  getAll: async (): Promise<SearchConfiguration[]> => {
    const { data } = await client.get<SearchConfiguration[]>("/api/configurations/");
    return data;
  },

  getById: async (id: number): Promise<SearchConfiguration> => {
    const { data } = await client.get<SearchConfiguration>(`/api/configurations/${id}`);
    return data;
  },

  create: async (payload: SearchConfigurationCreate): Promise<SearchConfiguration> => {
    const { data } = await client.post<SearchConfiguration>("/api/configurations/", payload);
    return data;
  },

  update: async (id: number, payload: SearchConfigurationUpdate): Promise<SearchConfiguration> => {
    const { data } = await client.patch<SearchConfiguration>(`/api/configurations/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await client.delete(`/api/configurations/${id}`);
  },
};

// ─── Organization ───────────────────────────────────────────────────

export const organizationApi = {
  getStats: async (): Promise<OrganizationStats> => {
    const { data } = await client.get<OrganizationStats>("/api/organization/stats");
    return data;
  },

  getOrganization: async (): Promise<Organization> => {
    const { data } = await client.get<Organization>("/api/organization/");
    return data;
  },
};

export default client;
