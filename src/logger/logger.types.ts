export interface ILogger {
  log: typeof console.log;
  warn: typeof console.warn;
}

export const DEFAULT_LOGGER = console;
