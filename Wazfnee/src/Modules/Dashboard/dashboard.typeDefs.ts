import { gql } from 'graphql-tag';

export const dashboardTypeDefs = gql`
  type User {
    id: ID!
    username: String
    email: String!
    provider: String!
    role: String!
    isConfirmed: Boolean!
    deletedAt: String
    bannedAt: String
  }

  type Company {
    id: ID!
    companyName: String!
    description: String!
    industry: String!
    address: String!
    numberOfEmployees: String!
    companyEmail: String!
    approvedByAdmin: Boolean!
    deletedAt: String
    bannedAt: String
  }

  type Dashboard {
    users: [User!]!
    companies: [Company!]!
  }

  type Query {
    dashboard: Dashboard!
  }
`;
