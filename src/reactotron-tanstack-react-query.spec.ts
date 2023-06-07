import {ReactotronImpl} from 'reactotron-core-client';
import ReactotronInstance from 'reactotron-react-native';
import {createLoggerMock} from './logger/logger.mock';
import {createQueryClientManagerMock} from './queryClientManager/queryClientManager.mock';
import {IFetchQueryByHash} from './queryClientManager/queryClientManager.types';
import {createReactQueryPlugin} from './reactotron-tanstack-react-query';
import {ReactQueryCustomCommand} from './reactotron-tanstack-react-query.types';

describe('createReactQueryPlugin', () => {
  const getPluginWithMocks = (
    customCommands: ReactQueryCustomCommand[] = [],
  ) => {
    const mockQueryClientManager = createQueryClientManagerMock();
    const mockLogger = createLoggerMock();

    const reactQueryPlugin = createReactQueryPlugin({
      queryClientManager: mockQueryClientManager,
      customCommands,
      logger: mockLogger,
    });

    return {
      reactQueryPlugin,
      mockQueryClientManager,
      mockLogger,
    };
  };

  it("registers custom 'React Query' commands", () => {
    const testCommandName = 'TestCommand';

    const testCommand: ReactQueryCustomCommand = (
      _queryClientManager: IFetchQueryByHash,
    ) => ({
      title: 'Test Command',
      command: testCommandName,
      description: 'Sample command for test case',
      handler: jest.fn(),
    });

    const {reactQueryPlugin} = getPluginWithMocks([testCommand]);

    reactQueryPlugin(ReactotronInstance);

    expect(
      (ReactotronInstance as unknown as ReactotronImpl).customCommands[0]
        .command,
    ).toBe(testCommandName);
  });

  it("subscribes to 'Query Cache' events", () => {
    const {reactQueryPlugin, mockQueryClientManager} = getPluginWithMocks();

    reactQueryPlugin(ReactotronInstance);

    expect(mockQueryClientManager.subscribe).toHaveBeenCalled();
  });
});
