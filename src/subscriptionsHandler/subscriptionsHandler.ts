import {DEFAULT_LOGGER} from '../logger/logger.types';
import {
  StateValuesChange,
  ISubscriptionsHandler,
  CreateSubscriptionsHandlerProps,
} from './subscriptionsHandler.types';

export function createSubscriptionsHandler({
  reactotron,
  queryClientManager,
  logger = DEFAULT_LOGGER,
}: CreateSubscriptionsHandlerProps): ISubscriptionsHandler {
  let subscriptions: string[] = [];

  function setSubscriptions(subs: string[]) {
    logger.log('[ReactQuery -> Reactotron]: Updating subscriptions:', {
      paths: subs,
    });

    subscriptions = subs;
  }

  function getChanges(): StateValuesChange[] {
    if (!reactotron || !queryClientManager) {
      logger.warn('[ReactQuery -> Reactotron]: Missing dependency:', {
        reactotron: reactotron ? 'found' : 'missing',
        queryClientManager: queryClientManager ? 'found' : 'missing',
      });

      return [];
    }

    return subscriptions.flatMap(path => {
      const query = queryClientManager.getQueryByHash(path);

      if (!query) {
        return [];
      }

      return [
        {
          path: query.queryHash,
          value: query.state,
        },
      ];
    });
  }

  function sendSubscriptions() {
    const changes = getChanges();
    reactotron?.stateValuesChange && reactotron.stateValuesChange(changes);
  }

  function sendSubscriptionsIfNeeded() {
    const changes = getChanges();

    if (changes.length > 0) {
      reactotron?.stateValuesChange && reactotron.stateValuesChange(changes);
    }
  }

  return {
    sendSubscriptions,
    sendSubscriptionsIfNeeded,
    setSubscriptions,
  };
}
