export const STATE_SUBSCRIPTION_COMMAND_TYPE = 'state.values.subscribe';

export interface StateSubscriptionPayload {
  paths: string[];
}

export interface StateValuesChange {
  path: string;
  value: unknown;
}

export function isStateSubscriptionPayload(
  type: string,
  payload?: unknown,
): payload is StateSubscriptionPayload {
  return (
    type === STATE_SUBSCRIPTION_COMMAND_TYPE &&
    payload !== null &&
    typeof payload === 'object' &&
    'paths' in payload
  );
}
