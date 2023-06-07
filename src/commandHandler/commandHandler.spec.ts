import {createSubscriptionsHandlerMock} from '../subscriptionsHandler/subscriptionsHandler.mock';
import {createCommandHandler} from './commandHandler';
import {STATE_SUBSCRIPTION_COMMAND_TYPE} from './commandHandler.types';

describe('commandHandler', () => {
  const SUPPORTED_TYPE = STATE_SUBSCRIPTION_COMMAND_TYPE;
  const getHandlerWithMocks = () => {
    const subscriptionsHandler = createSubscriptionsHandlerMock();

    const commandHandler = createCommandHandler(subscriptionsHandler);

    return {
      commandHandler,
      subscriptionsHandler,
    };
  };

  it.each([
    ['unsupported type', 'ramdomType_XYZ', {paths: 'pathXYZ'}],
    ['typo in type name', SUPPORTED_TYPE + 'xyz', {paths: 'pathXYZ'}],
    ['null payload', SUPPORTED_TYPE, null],
  ])('ignores commands due to %s', (_desc, type, payload) => {
    const {commandHandler, subscriptionsHandler} = getHandlerWithMocks();

    commandHandler({type, payload});

    expect(subscriptionsHandler.setSubscriptions).not.toHaveBeenCalled();
    expect(subscriptionsHandler.sendSubscriptions).not.toHaveBeenCalled();
  });

  it('handles state subscription commands', () => {
    const {commandHandler, subscriptionsHandler} = getHandlerWithMocks();

    commandHandler({
      type: STATE_SUBSCRIPTION_COMMAND_TYPE,
      payload: {paths: 'pathXYZ'},
    });

    expect(subscriptionsHandler.setSubscriptions).toHaveBeenCalled();
    expect(subscriptionsHandler.sendSubscriptions).toHaveBeenCalled();
  });
});
