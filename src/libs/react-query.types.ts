import {QueryCache, QueryClient} from '@tanstack/react-query';

export type QueryCacheNotifyEvent = Parameters<QueryCache['notify']>[0];

export type QueryClientForQueryClientManager = Pick<
  QueryClient,
  'getQueryCache'
>;
