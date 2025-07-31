export const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 5 * 60 * 1000, // 5 minutes
  dedupingInterval: 2000,
  fetcher: (url: string) => fetch(url).then(res => res.json()),
};