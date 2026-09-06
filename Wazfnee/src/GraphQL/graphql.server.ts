import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { Request, Response } from 'express';

import { dashboardTypeDefs } from '../Modules/Dashboard/dashboard.typeDefs';
import { dashboardResolvers } from '../Modules/Dashboard/dashboard.resolver';

export const apolloServer = new ApolloServer({
  typeDefs: dashboardTypeDefs,
  resolvers: dashboardResolvers,
});
