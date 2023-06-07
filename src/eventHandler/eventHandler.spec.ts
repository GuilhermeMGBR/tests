import {FetchStatus} from '@tanstack/query-core';
import {createEventHandler} from './eventHandler';
import {QueryCacheNotifyEvent} from '../libs/react-query.types';
import {createReactotronMock} from '../libs/reactotron.mock';

describe('eventHandler', () => {
  const getHandlerWithMocks = () => {
    const mockReactotron = createReactotronMock();
    const mockSendSubscriptionsIfNeeded = jest.fn();

    const reactQueryEventHandler = createEventHandler(
      mockReactotron,
      mockSendSubscriptionsIfNeeded,
    );

    return {
      reactQueryEventHandler,
      mockReactotron,
      mockSendSubscriptionsIfNeeded,
    };
  };

  const expectToDisplayAsStandardEvent = (
    mockReactotronDisplay: jest.Mock,
    event: QueryCacheNotifyEvent,
  ) => {
    expect(mockReactotronDisplay).toHaveBeenCalledWith({
      name: `${event.type}${event.query.queryHash}`,
      value: event.query,
    });
  };

  const getEvent = ({
    type,
    queryHash,
    data,
    fetchStatus = 'idle',
  }: {
    type: string;
    queryHash: string;
    data: string;
    fetchStatus?: FetchStatus;
  }): QueryCacheNotifyEvent =>
    ({
      type,
      query: {
        queryHash,
        state: {
          data,
          fetchStatus,
        },
      },
    } as unknown as QueryCacheNotifyEvent);

  it.each<[string, FetchStatus]>([
    ['when fetching', 'fetching'],
    ['and as state update on fetch completion', 'idle'],
  ])(
    'broadcasts "updated" events as standard reactotron event %s',
    (_description: string, fetchStatus: FetchStatus) => {
      const {
        reactQueryEventHandler,
        mockReactotron,
        mockSendSubscriptionsIfNeeded,
      } = getHandlerWithMocks();

      const event = getEvent({
        type: 'updated',
        queryHash: 'queryHash1',
        data: 'new Data1',
        fetchStatus,
      });

      reactQueryEventHandler(event);

      if (fetchStatus !== 'idle') {
        expect(mockReactotron.stateActionComplete).not.toHaveBeenCalled();
        expect(mockReactotron.stateValuesResponse).not.toHaveBeenCalled();
      } else {
        expect(mockReactotron.stateActionComplete).toHaveBeenCalledWith(
          `${event.query.queryHash} updated`,
          {
            queryHash: event.query.queryHash,
            data: event.query.state.data,
          },
        );

        expect(mockReactotron.stateValuesResponse).toHaveBeenCalledWith(
          event.query.queryHash,
          event.query.state,
        );

        expect(mockSendSubscriptionsIfNeeded).toHaveBeenCalledTimes(1);
      }

      expectToDisplayAsStandardEvent(
        mockReactotron.display as jest.Mock,
        event,
      );
    },
  );

  it('broadcasts events to reactotron.display', () => {
    const {
      reactQueryEventHandler,
      mockReactotron,
      mockSendSubscriptionsIfNeeded,
    } = getHandlerWithMocks();

    const event = getEvent({
      type: 'randomEventType',
      queryHash: 'queryHash2',
      data: 'new Data2',
    });

    reactQueryEventHandler(event);

    expect(mockReactotron.stateActionComplete).not.toHaveBeenCalled();

    expect(mockReactotron.stateValuesResponse).not.toHaveBeenCalled();

    expect(mockSendSubscriptionsIfNeeded).not.toHaveBeenCalled();

    expectToDisplayAsStandardEvent(mockReactotron.display as jest.Mock, event);
  });
});
