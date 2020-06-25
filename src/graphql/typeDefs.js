import gql from 'graphql-tag';

const typeDefs = gql`
    type User {
        name: String!
        photoURL: String!
    }

    type Query {
        getToken: String!
        getUser: User
    }

    extend type Launch {
        isInCart: Boolean!
    }

    extend type Mutation {
        addOrRemoveFromCart(id: ID!): [Launch]
    }
`;

export default typeDefs;
