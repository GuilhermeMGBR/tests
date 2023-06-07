import {
  fetchQueryByHash,
  fetchQueryByInputHash,
  fetchQueryBySetHash,
  getDefaultReactotronCustomCommands,
} from './commandHandler.utils';
import {createLoggerMock} from '../logger/logger.mock';
import {ILogger} from '../logger/logger.types';
import {createQueryClientManagerMock} from '../queryClientManager/queryClientManager.mock';

describe('commandHandler.utils', () => {
  const mockConsoleLog = jest.spyOn(console, 'log');

  const mockConsoleLogOnce = () => {
    mockConsoleLog.mockImplementationOnce(() => {
      return;
    });
  };

  it.each([
    ['default logger', true],
    ['custom logger', false],
  ])(
    'delegates the query fetching to the QueryClientManager (%s)',
    (_case: string, defaultLogger: boolean) => {
      const mockQueryClientManager = createQueryClientManagerMock();
      const mockLogger = createLoggerMock();

      if (defaultLogger) {
        mockConsoleLogOnce();
      }

      const testQueryHash = 'queryHash_XYZ';

      fetchQueryByHash(
        testQueryHash,
        mockQueryClientManager,
        defaultLogger ? undefined : mockLogger,
      );

      expect(mockQueryClientManager.fetchQueryByHash).toHaveBeenCalledWith(
        testQueryHash,
      );

      expect(
        defaultLogger ? mockConsoleLog : mockLogger.log,
      ).toHaveBeenCalledWith(`Fetching ${testQueryHash}`);
    },
  );

  it.each([
    ['default logger', true],
    ['custom logger', false],
  ])(
    'creates the default text input command (%s)',
    (_case: string, defaultLogger: boolean) => {
      const mockQueryClientManager = createQueryClientManagerMock();
      const mockLogger = createLoggerMock();

      if (defaultLogger) {
        mockConsoleLogOnce();
      }

      const queryHashInput = 'queryHash_XYZ';

      const command = fetchQueryByInputHash(
        defaultLogger ? undefined : mockLogger,
      )(mockQueryClientManager);
      expect(command).not.toBeNull();

      command.handler({queryHash: queryHashInput});

      expect(mockQueryClientManager.fetchQueryByHash).toHaveBeenCalledWith(
        queryHashInput,
      );

      expect(
        defaultLogger ? mockConsoleLog : mockLogger.log,
      ).toHaveBeenCalled();
    },
  );

  it.each([
    ['default logger', true],
    ['custom logger', false],
  ])(
    'creates a command from a query key (%s)',
    (_case: string, defaultLogger: boolean) => {
      const mockQueryClientManager = createQueryClientManagerMock();
      const mockLogger = createLoggerMock();

      if (defaultLogger) {
        mockConsoleLogOnce();
      }

      const testKey = 'testKey_XYZ';

      const command = fetchQueryBySetHash(
        testKey,
        defaultLogger ? undefined : mockLogger,
      )(mockQueryClientManager);

      expect(command).not.toBeNull();
      expect(command.title).toContain(testKey);
      expect(command.command).toContain(testKey);
      expect(command.description).toContain(testKey);

      command.handler();

      expect(mockQueryClientManager.fetchQueryByHash).toHaveBeenCalled();
      expect(
        defaultLogger ? mockConsoleLog : mockLogger.log,
      ).toHaveBeenCalled();
    },
  );

  it.each([
    ['undefined list', undefined],
    ['1 key', ['key1']],
    ['3 keys', ['key1', 'key2', 'key3']],
  ])(
    'creates a command list from a list of keys (%s)',
    (_desc: string, testKeys?: string[]) => {
      const commands = getDefaultReactotronCustomCommands(testKeys);

      expect(commands).not.toBeNull();
      expect(commands.length).toBe(1 + (testKeys?.length ?? 0));
    },
  );
});
