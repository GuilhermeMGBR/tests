import {ArgType} from 'reactotron-core-client';
import {ReactQueryCustomCommand} from '../reactotron-tanstack-react-query.types';
import {DEFAULT_LOGGER, ILogger} from '../logger/logger.types';
import {IFetchQueryByHash} from '../queryClientManager/queryClientManager.types';

export function fetchQueryByHash(
  queryHash: string,
  queryClientManager: IFetchQueryByHash,
  logger: ILogger = DEFAULT_LOGGER,
) {
  logger.log(`Fetching ${queryHash}`);
  queryClientManager.fetchQueryByHash(queryHash);
}

export const fetchQueryByInputHash =
  (logger: ILogger = DEFAULT_LOGGER) =>
  (queryClientManager: IFetchQueryByHash) => ({
    title: 'React Query Fetch',
    command: 'ReactQueryFetch',
    description:
      'Manually triggers the react query fetch associated with the queryHash',
    handler: (params: {queryHash: string}) => {
      fetchQueryByHash(params.queryHash, queryClientManager, logger);
    },
    args: [
      {
        name: 'queryHash',
        type: ArgType.String,
      },
    ],
  });

export const fetchQueryBySetHash =
  (key: string, logger: ILogger = DEFAULT_LOGGER) =>
  (queryClientManager: IFetchQueryByHash) => ({
    title: `Fetch ["${key}"]`,
    command: `ReactQueryFetch_${key}`,
    description: `Manually triggers a react query ["${key}"] fetch`,
    handler: () => fetchQueryByHash(`["${key}"]`, queryClientManager, logger),
  });

export const getDefaultReactotronCustomCommands = (
  keys?: string[],
  logger: ILogger = DEFAULT_LOGGER,
) => {
  const customCommands: ReactQueryCustomCommand[] = [
    fetchQueryByInputHash(logger),
  ];

  keys?.forEach(key => {
    customCommands.push(fetchQueryBySetHash(key, logger));
  });

  return customCommands;
};
