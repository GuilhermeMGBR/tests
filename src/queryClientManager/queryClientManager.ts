import {Query, QueryCache} from '@tanstack/react-query';
import {IQueryClientManager} from './queryClientManager.types';
import {
  QueryCacheNotifyEvent,
  QueryClientForQueryClientManager,
} from '../libs/react-query.types';

export class QueryClientManager implements IQueryClientManager {
  queryClient: QueryClientForQueryClientManager;

  queryCacheEvent?: () => void;

  constructor(queryClient: QueryClientForQueryClientManager) {
    this.queryClient = queryClient;
  }

  getQueryCache(): QueryCache {
    return this.queryClient.getQueryCache();
  }

  getQueries(): Query[] {
    return this.getQueryCache().getAll();
  }

  getQueryByHash(queryHash: string): Query | undefined {
    return this.getQueryCache().get(queryHash);
  }

  fetchQueryByHash(queryHash: string) {
    return this.getQueryByHash(queryHash)?.fetch();
  }

  subscribe(callback: (event: QueryCacheNotifyEvent) => void) {
    this.queryCacheEvent = this.getQueryCache().subscribe(_event => {
      callback(_event);
    });
  }

  unsubscribe() {
    if (!this.queryCacheEvent) {
      return;
    }

    this.queryCacheEvent();
    this.queryCacheEvent = undefined;
  }
}
