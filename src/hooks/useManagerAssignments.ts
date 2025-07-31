import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useManagerAssignments() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/manager-assignments',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 5 * 60 * 1000, // 5 minutes
      dedupingInterval: 2000,
    }
  );

  return {
    assignments: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}