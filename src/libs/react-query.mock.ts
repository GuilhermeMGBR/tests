import {QueryCache} from '@tanstack/react-query';
import {QueryClientForQueryClientManager} from './react-query.types';

export const testQueryHash1 = 'testQueryHash';
export const testQueryHash2 = 'testQueryHash';
export const testFetchResponse1 = 'testFetchResponse';
export const testFetchResponse2 = 'testFetchResponse';
export let eventCacheListener: (() => void) | undefined;

export const createQueryClientForQueryClientManagerMock =
  (): QueryClientForQueryClientManager => {
    return {
      getQueryCache: () => {
        return {
          subscribe(callback: () => void) {
            eventCacheListener = callback;
            return () => {
              eventCacheListener = undefined;
            };
          },
          getAll() {
            return [
              {
                queryHash: testQueryHash1,
                fetch() {
                  return testFetchResponse1;
                },
              },
              {
                queryHash: testQueryHash2,
                fetch() {
                  return testFetchResponse2;
                },
              },
            ];
          },
          get(queryHash: string) {
            if (queryHash !== testQueryHash2) {
              return undefined;
            }
            return {
              queryHash: testQueryHash2,
              fetch() {
                return testFetchResponse2;
              },
            };
          },
        } as unknown as QueryCache;
      },
    };
  };
