import { expressMiddleware } from '@as-integrations/express5';

import { apolloServer } from './graphql.server';
import { createGraphQLContext } from './graphql.context';

export const getGraphQLMiddleware = () => {
  return expressMiddleware(apolloServer, {
    context: createGraphQLContext,
  });
};
