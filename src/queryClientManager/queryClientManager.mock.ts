import {IQueryClientManager} from './queryClientManager.types';

export const createQueryClientManagerMock = (): IQueryClientManager => {
  return {
    getQueryCache: jest.fn(),
    getQueries: jest.fn(),
    getQueryByHash: jest.fn(),
    fetchQueryByHash: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
  };
};
