// Hook genérico para ejecutar llamadas API con React Query
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { httpClient } from '@shared/lib/httpClient';
import type { AxiosRequestConfig } from 'axios';

interface UseApiOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  url: string;
  config?: AxiosRequestConfig;
}

export function useApi<T>(queryKey: string[], { url, config, ...options }: UseApiOptions<T>) {
  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      const { data } = await httpClient.get<T>(url, config);
      return data;
    },
    ...options,
  });
}
