import {ISubscriptionsHandler} from './subscriptionsHandler.types';

export const createSubscriptionsHandlerMock = (): ISubscriptionsHandler => {
  return {
    sendSubscriptions: jest.fn(),
    sendSubscriptionsIfNeeded: jest.fn(),
    setSubscriptions: jest.fn(),
  };
};
