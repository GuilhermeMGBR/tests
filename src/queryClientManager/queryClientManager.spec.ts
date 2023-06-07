import {QueryClientManager} from './queryClientManager';
import {
  createQueryClientForQueryClientManagerMock,
  eventCacheListener,
  testFetchResponse2,
  testQueryHash1,
  testQueryHash2,
} from '../libs/react-query.mock';

describe('QueryClientManager', () => {
  const queryClient = createQueryClientForQueryClientManagerMock();
  const queryClientManager = new QueryClientManager(queryClient);

  it('can have queries', () => {
    expect(2).toBe(queryClientManager.getQueries().length);
  });

  it('can find a query by hash', () => {
    expect(queryClientManager.getQueryByHash(testQueryHash1)).toBeDefined();
  });

  it('can fetch a query by hash', () => {
    expect(queryClientManager.fetchQueryByHash(testQueryHash2)).toBe(
      testFetchResponse2,
    );
  });

  it('can subscribe to query cache events', () => {
    const callback = jest.fn();
    queryClientManager.subscribe(callback);

    eventCacheListener && eventCacheListener();
    eventCacheListener && eventCacheListener();

    expect(callback).toBeCalledTimes(2);
  });

  it('can unsubscribe from query cache events', () => {
    const callback = jest.fn();
    queryClientManager.subscribe(callback);

    queryClientManager.unsubscribe();

    expect(queryClientManager.queryCacheEvent).toBeUndefined();
  });

  it('ignores unsubscribe calls when there are no subscriptions', () => {
    queryClientManager.unsubscribe();

    expect(queryClientManager.queryCacheEvent).toBeUndefined();

    queryClientManager.unsubscribe();
  });
});
