import {Query} from '@tanstack/react-query';
import {createSubscriptionsHandler} from './subscriptionsHandler';
import {CreateSubscriptionsHandlerProps} from './subscriptionsHandler.types';
import {createReactotronForSubscriptionsHandlerMock} from '../libs/reactotron.mock';
import {createLoggerMock} from '../logger/logger.mock';
import {createQueryClientManagerMock} from '../queryClientManager/queryClientManager.mock';
import {IGetQueryByHash} from '../queryClientManager/queryClientManager.types';

describe('subscriptionsHandler', () => {
  const getHandlerWithMocks = () => {
    const mockReactotron = createReactotronForSubscriptionsHandlerMock();
    const mockQueryClientManager =
      createQueryClientManagerMock() as IGetQueryByHash;
    const mockLogger = createLoggerMock();

    const subscriptionsHandler = createSubscriptionsHandler({
      reactotron: mockReactotron,
      queryClientManager: mockQueryClientManager,
      logger: mockLogger,
    });

    const expectToLogSubscriptionsUpdate = (
      callNumber: number,
      paths: string[],
    ) => {
      expect(mockLogger.log).toHaveBeenNthCalledWith(
        callNumber,
        '[ReactQuery -> Reactotron]: Updating subscriptions:',
        {paths},
      );
    };

    return {
      subscriptionsHandler,
      mockReactotron,
      mockQueryClientManager,
      mockLogger,
      expectToLogSubscriptionsUpdate,
    };
  };

  it('logs subscriptions updates', () => {
    const {
      subscriptionsHandler,
      mockReactotron,
      mockQueryClientManager,
      mockLogger,
      expectToLogSubscriptionsUpdate,
    } = getHandlerWithMocks();

    const firstSubscriptions = ['queryHash1', 'queryHash2'];
    subscriptionsHandler.setSubscriptions(firstSubscriptions);
    expectToLogSubscriptionsUpdate(1, firstSubscriptions);

    const newSubscriptions = ['queryHash3', 'queryHash4'];
    subscriptionsHandler.setSubscriptions(newSubscriptions);
    expectToLogSubscriptionsUpdate(2, newSubscriptions);

    expect(mockLogger.log).toHaveBeenCalledTimes(2);
    expect(mockReactotron.stateValuesChange).not.toHaveBeenCalled();
    expect(mockQueryClientManager.getQueryByHash).not.toHaveBeenCalled();
  });

  it('uses the console.log/warn as a fallback for logging', () => {
    const mockReactotron = createReactotronForSubscriptionsHandlerMock();
    const mockQueryClientManager =
      createQueryClientManagerMock() as IGetQueryByHash;

    const fallbackLogger = jest
      .spyOn(console, 'log')
      .mockImplementationOnce(() => {
        return;
      });

    const subscriptionsHandler = createSubscriptionsHandler({
      reactotron: mockReactotron,
      queryClientManager: mockQueryClientManager,
    });

    const subscriptions = ['queryHash'];
    subscriptionsHandler.setSubscriptions(subscriptions);

    expect(fallbackLogger).toHaveBeenCalledWith(
      '[ReactQuery -> Reactotron]: Updating subscriptions:',
      {paths: subscriptions},
    );
    expect(fallbackLogger).toHaveBeenCalledTimes(1);

    expect(mockReactotron.stateValuesChange).not.toHaveBeenCalled();
    expect(mockQueryClientManager.getQueryByHash).not.toHaveBeenCalled();
  });

  it.each([
    ['', 'sendSubscriptions'],
    [' when needed', 'sendSubscriptionsIfNeeded'],
  ])(
    'sends subscriptions (with query) on demand%s (%s)',
    (_desc: string, method: string) => {
      const {subscriptionsHandler, mockReactotron, mockQueryClientManager} =
        getHandlerWithMocks();

      const queryHash = 'queryHash_XYZ';
      const queryState = 'queryState_XYZ';
      const subscriptions = [queryHash];

      mockQueryClientManager.getQueryByHash = jest.fn(hash => {
        if (hash === queryHash) {
          return {queryHash: queryHash, state: queryState} as unknown as Query;
        }

        return undefined;
      });

      subscriptionsHandler.setSubscriptions(subscriptions);

      if (method === 'sendSubscriptions') {
        subscriptionsHandler.sendSubscriptions();
      } else {
        subscriptionsHandler.sendSubscriptionsIfNeeded();
      }

      expect(mockReactotron.stateValuesChange).toHaveBeenCalledWith([
        {
          path: queryHash,
          value: queryState,
        },
      ]);
      expect(mockQueryClientManager.getQueryByHash).toHaveBeenCalledWith(
        queryHash,
      );

      expect(mockReactotron.stateValuesChange).toHaveBeenCalledTimes(1);
      expect(mockQueryClientManager.getQueryByHash).toHaveBeenCalledTimes(1);
    },
  );

  it('does not throws when sending subscriptions without query', () => {
    const {subscriptionsHandler, mockReactotron, mockQueryClientManager} =
      getHandlerWithMocks();

    const queryHash1 = 'queryHash1';
    const queryHash2 = 'queryHash2';
    const subscriptions = [queryHash1, queryHash2];

    mockQueryClientManager.getQueryByHash = jest.fn(_hash => {
      return undefined;
    });

    subscriptionsHandler.setSubscriptions(subscriptions);
    subscriptionsHandler.sendSubscriptions();
    expect(mockReactotron.stateValuesChange).toHaveBeenCalledWith([]);
    expect(mockQueryClientManager.getQueryByHash).toHaveBeenCalledWith(
      queryHash1,
    );
    expect(mockQueryClientManager.getQueryByHash).toHaveBeenCalledWith(
      queryHash2,
    );

    expect(mockReactotron.stateValuesChange).toHaveBeenCalledTimes(1);
    expect(mockQueryClientManager.getQueryByHash).toHaveBeenCalledTimes(2);
  });

  it('does not send subscriptions when not needed (sendSubscriptionsIfNeeded)', () => {
    const {subscriptionsHandler, mockReactotron, mockQueryClientManager} =
      getHandlerWithMocks();

    const queryHash = 'queryHash';
    const subscriptions = [queryHash];

    mockQueryClientManager.getQueryByHash = jest.fn(_hash => {
      return undefined;
    });

    subscriptionsHandler.sendSubscriptionsIfNeeded();
    expect(mockQueryClientManager.getQueryByHash).not.toHaveBeenCalled();

    subscriptionsHandler.setSubscriptions(subscriptions);
    subscriptionsHandler.sendSubscriptionsIfNeeded();

    expect(mockQueryClientManager.getQueryByHash).toHaveBeenCalledWith(
      queryHash,
    );

    expect(mockReactotron.stateValuesChange).not.toHaveBeenCalled();
    expect(mockQueryClientManager.getQueryByHash).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['found', 'missing'],
    ['missing', 'found'],
    ['missing', 'missing'],
  ])(
    'warns about missing dependencies (reactotron: %s, queryClientManager: %s)',
    (reactotronState, queryClientManagerState) => {
      const mockReactotron = createReactotronForSubscriptionsHandlerMock();
      const mockQueryClientManager =
        createQueryClientManagerMock() as IGetQueryByHash;
      const mockLogger = createLoggerMock();

      const subscriptionsHandler = createSubscriptionsHandler({
        reactotron: reactotronState === 'found' ? mockReactotron : undefined,
        queryClientManager:
          queryClientManagerState === 'found'
            ? mockQueryClientManager
            : undefined,
        logger: mockLogger,
      } as unknown as CreateSubscriptionsHandlerProps);

      subscriptionsHandler.sendSubscriptions();

      expect(mockLogger.warn).toHaveBeenCalledWith(
        '[ReactQuery -> Reactotron]: Missing dependency:',
        {
          reactotron: reactotronState,
          queryClientManager: queryClientManagerState,
        },
      );
      expect(mockLogger.warn).toHaveBeenCalledTimes(1);
    },
  );
});
