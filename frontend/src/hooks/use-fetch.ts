import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export const useFetch = <T extends unknown = unknown>(url: string | null) => {
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher);

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
