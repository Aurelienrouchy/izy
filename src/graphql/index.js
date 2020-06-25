import * as SecureStore from 'expo-secure-store';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from "apollo-link-error";
import { ApolloLink } from 'apollo-link';

const graphQLClient = function() {
    const httpLink = createHttpLink({ uri: 'https://izy-back.herokuapp.com/graphql' });
    const withToken = setContext( async (_, { headers }) => {
        try {
            // get the authentication token from local storage if it exists
            const token = await SecureStore.getItemAsync('token');
    
            if (token == null) {
                return;
            }
            return {
                headers: {
                    ...headers,
                    authorization: token ? `Bearer ${token}` : '',
                },
            };
        } catch (e) {
            throw Error(e);
        }
    });
    const errorLink = onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
            graphQLErrors.forEach(({ message, locations, path }) =>
                console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
            );
        }
        if (networkError) {
            console.log(`[Network error]: ${networkError}`);
        }
    });
    
    const link = ApolloLink.from([
        withToken,
        errorLink,
        httpLink
    ]);
    
    const client = new ApolloClient({
        link,
        cache: new InMemoryCache()
    });

    return client;
};

export default graphQLClient;