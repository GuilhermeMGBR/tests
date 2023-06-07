import {CustomCommand} from 'reactotron-core-client';
import {ILogger} from './logger/logger.types';
import {IQueryClientManager} from './queryClientManager/queryClientManager.types';

export type ReactQueryCustomCommand = (
  queryClientManager: IQueryClientManager,
) => CustomCommand;

export interface CreateReactQueryPluginProps {
  queryClientManager: IQueryClientManager;
  customCommands?: ReactQueryCustomCommand[];
  logger?: ILogger;
}
