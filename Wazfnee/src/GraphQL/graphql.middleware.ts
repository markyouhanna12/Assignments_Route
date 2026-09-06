import { expressMiddleware } from '@as-integrations/express5';

import { apolloServer } from './graphql.server';

export const getGraphQLMiddleware = () => {
  return expressMiddleware(apolloServer);
};
