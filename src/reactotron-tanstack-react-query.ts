import {Reactotron} from 'reactotron-core-client';
import {createCommandHandler} from './commandHandler';
import {createEventHandler} from './eventHandler';
import {IReactotronPluginCreator} from './libs/reactotron.types';
import {DEFAULT_LOGGER} from './logger/logger.types';
import {
  IQueryClientManager,
  ISubscribe,
} from './queryClientManager/queryClientManager.types';
import {
  CreateReactQueryPluginProps,
  ReactQueryCustomCommand,
} from './reactotron-tanstack-react-query.types';
import {createSubscriptionsHandler} from './subscriptionsHandler';
import {ISendSubscriptionsIfNeeded} from './subscriptionsHandler/subscriptionsHandler.types';

function configureEventSubscriptions(
  reactotron: Reactotron,
  subscriptionsHandler: ISendSubscriptionsIfNeeded,
  queryClientManager: ISubscribe,
) {
  const eventHandler = createEventHandler(
    reactotron,
    subscriptionsHandler.sendSubscriptionsIfNeeded,
  );

  queryClientManager.subscribe(event => {
    eventHandler(event);
  });
}

function configureCustomCommands(
  reactotron: Reactotron,
  queryClientManager: IQueryClientManager,
  customCommands?: ReactQueryCustomCommand[],
) {
  customCommands?.forEach(command =>
    reactotron.onCustomCommand(command(queryClientManager)),
  );
}

export function createReactQueryPlugin({
  queryClientManager,
  customCommands,
  logger = DEFAULT_LOGGER,
}: CreateReactQueryPluginProps): IReactotronPluginCreator {
  return (reactotron: Reactotron) => {
    configureCustomCommands(reactotron, queryClientManager, customCommands);

    const subscriptionsHandler = createSubscriptionsHandler({
      reactotron,
      queryClientManager,
      logger,
    });

    configureEventSubscriptions(
      reactotron,
      subscriptionsHandler,
      queryClientManager,
    );

    const commandHandler = createCommandHandler(subscriptionsHandler);

    return {
      onCommand: commandHandler,
    };
  };
}
