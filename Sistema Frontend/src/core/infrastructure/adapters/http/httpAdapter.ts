// Adaptador HTTP que implementa operaciones genéricas sobre la API
import { apiClient } from './apiClient';

export class HttpAdapter {
  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const { data } = await apiClient.get<T>(url, { params });
    return data;
  }

  async post<T>(url: string, body?: unknown): Promise<T> {
    const { data } = await apiClient.post<T>(url, body);
    return data;
  }

  async patch<T>(url: string, body?: unknown): Promise<T> {
    const { data } = await apiClient.patch<T>(url, body);
    return data;
  }

  async delete(url: string): Promise<void> {
    await apiClient.delete(url);
  }
}
