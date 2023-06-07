import {Reactotron} from 'reactotron-core-client';
import {ReactotronForSubscriptionsHandler} from './reactotron.types';

export const createReactotronMock = () => {
  return {
    stateActionComplete: jest.fn(),
    stateValuesResponse: jest.fn(),
    display: jest.fn(),
  } as unknown as Reactotron;
};

export const createReactotronForSubscriptionsHandlerMock =
  (): ReactotronForSubscriptionsHandler => {
    return {
      stateValuesChange: jest.fn(),
    };
  };
