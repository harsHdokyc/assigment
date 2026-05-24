import axios from "axios";
import type {
  AuditLogItem,
  DashboardStats,
  DataSourceItem,
  MeResponse,
  Paginated,
  RecordDetail,
  RecordListItem,
  UploadResult,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.startsWith("/login")) {
      logout();
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

export async function login(username: string, password: string) {
  const { data } = await axios.post(`${API_URL}/api/auth/token/`, { username, password });
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  return data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("organization_id");
}

export async function fetchMe() {
  const { data } = await api.get<MeResponse>("/me/");
  if (data.organizations[0]) {
    localStorage.setItem("organization_id", data.organizations[0].id);
  }
  return data;
}

export function getOrganizationId() {
  return localStorage.getItem("organization_id") ?? "";
}

export async function fetchStats() {
  const { data } = await api.get<DashboardStats>("/stats/");
  return data;
}

export async function fetchDataSources() {
  const { data } = await api.get<DataSourceItem[]>("/datasources/");
  return data;
}

export async function fetchRecords(params?: { status?: string; page?: number }) {
  const { data } = await api.get<Paginated<RecordListItem>>("/records/", { params });
  return data;
}

export async function fetchRecord(id: string) {
  const { data } = await api.get<RecordDetail>(`/records/${id}/`);
  return data;
}

export async function patchRecord(id: string, body: Record<string, unknown>) {
  const { data } = await api.patch<RecordDetail>(`/records/${id}/`, body);
  return data;
}

export async function approveRecord(id: string) {
  const { data } = await api.post<RecordDetail>(`/records/${id}/approve/`);
  return data;
}

export async function rejectRecord(id: string) {
  const { data } = await api.post<RecordDetail>(`/records/${id}/reject/`);
  return data;
}

export async function uploadCsv(file: File, sourceType: string, organizationId: string) {
  const form = new FormData();
  form.append("file", file);
  form.append("source_type", sourceType);
  form.append("organization_id", organizationId);
  const { data } = await api.post<UploadResult>("/uploads/", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function fetchGlobalAudit() {
  const { data } = await api.get<AuditLogItem[]>("/audit-log/");
  return data;
}

export function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
