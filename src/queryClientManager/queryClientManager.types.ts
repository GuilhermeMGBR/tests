import {Query, QueryCache} from '@tanstack/react-query';
import {QueryCacheNotifyEvent} from '../libs/react-query.types';

export interface IGetQueryByHash {
  getQueryByHash: (queryHash: string) => Query | undefined;
}

export interface IGetQueryCache {
  getQueryCache: () => QueryCache;
}

export interface IGetQueries {
  getQueries: () => Query[];
}

export interface IFetchQueryByHash {
  fetchQueryByHash: (queryHash: string) => Promise<unknown> | undefined;
}

export interface ISubscribe {
  subscribe: (callback: (event: QueryCacheNotifyEvent) => void) => void;
}

export interface IUnsubscribe {
  unsubscribe: () => void;
}

export interface IQueryClientManager
  extends IGetQueryByHash,
    IGetQueryCache,
    IGetQueries,
    IFetchQueryByHash,
    ISubscribe,
    IUnsubscribe {}
