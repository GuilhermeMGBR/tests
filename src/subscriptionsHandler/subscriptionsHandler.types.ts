import {ReactotronForSubscriptionsHandler} from '../libs/reactotron.types';
import {ILogger} from '../logger/logger.types';
import {IGetQueryByHash} from '../queryClientManager/queryClientManager.types';

export interface StateValuesChange {
  path: string;
  value: unknown;
}

export interface CreateSubscriptionsHandlerProps {
  reactotron: ReactotronForSubscriptionsHandler;
  queryClientManager: IGetQueryByHash;
  logger?: ILogger;
}

export interface ISendSubscriptions {
  sendSubscriptions: () => void;
}

export interface ISendSubscriptionsIfNeeded {
  sendSubscriptionsIfNeeded: () => void;
}

export interface ISetSubscriptions {
  setSubscriptions: (subs: string[]) => void;
}

export interface ISubscriptionsHandler
  extends ISendSubscriptions,
    ISendSubscriptionsIfNeeded,
    ISetSubscriptions {}
