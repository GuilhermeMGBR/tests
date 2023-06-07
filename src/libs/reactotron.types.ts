import {Reactotron} from 'reactotron-core-client';

export type ReactotronForSubscriptionsHandler = Pick<
  Reactotron,
  'stateValuesChange'
>;

export type IReactotronPluginCreator = NonNullable<
  Parameters<Reactotron['use']>[0]
>;
