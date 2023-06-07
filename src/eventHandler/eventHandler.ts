import {Reactotron} from 'reactotron-core-client';
import {QueryCacheNotifyEvent} from '../libs/react-query.types';

export const createEventHandler =
  (reactotron: Reactotron, sendSubscriptionsIfNeeded: () => void) =>
  (event: QueryCacheNotifyEvent) => {
    if (
      event.type === 'updated' &&
      event.query.state.fetchStatus !== 'fetching'
    ) {
      reactotron.stateActionComplete &&
        reactotron.stateActionComplete(`${event.query.queryHash} updated`, {
          queryHash: event.query.queryHash,
          data: event.query.state.data,
        });

      reactotron.stateValuesResponse &&
        reactotron.stateValuesResponse(
          event.query.queryHash,
          event.query.state,
        );

      sendSubscriptionsIfNeeded();
    }

    reactotron.display({
      name: `${event.type}${event.query.queryHash}`,
      value: event.query,
    });
  };
