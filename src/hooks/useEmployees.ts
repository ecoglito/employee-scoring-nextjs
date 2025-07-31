import useSWR from 'swr';
import { NotionEmployee } from '@/lib/notionEmployeeService';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useEmployees() {
  const { data, error, isLoading, mutate } = useSWR<NotionEmployee[]>(
    '/api/employees',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 5 * 60 * 1000, // 5 minutes
      dedupingInterval: 2000,
    }
  );

  return {
    employees: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useEmployeeStats() {
  const { data, error, isLoading } = useSWR(
    '/api/employees/stats',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 5 * 60 * 1000, // 5 minutes
      dedupingInterval: 2000,
    }
  );

  return {
    stats: data,
    isLoading,
    isError: error,
  };
}