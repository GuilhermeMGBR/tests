import {ISubscriptionsHandler} from '../subscriptionsHandler/subscriptionsHandler.types';
import {isStateSubscriptionPayload} from './commandHandler.types';

export const createCommandHandler =
  (subscriptionsHandler: ISubscriptionsHandler) =>
  ({type, payload}: {type: string; payload?: unknown}) => {
    if (isStateSubscriptionPayload(type, payload)) {
      subscriptionsHandler.setSubscriptions(payload.paths);

      subscriptionsHandler.sendSubscriptions();
    }
  };
