import {ILogger} from './logger.types';

export const createLoggerMock = (): ILogger => {
  return {
    log: jest.fn(),
    warn: jest.fn(),
  };
};
