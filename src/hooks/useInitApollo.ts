import {
  ApolloClient, ApolloLink, InMemoryCache, NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { useMemo } from 'react';
import { WebSocketLink } from '@apollo/client/link/ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';

export const useInitApollo = (token: string | undefined, onUnauthorizedError: Function):ApolloClient<NormalizedCacheObject> => useMemo(() => createApolloClient(token, onUnauthorizedError), [token]);

const createApolloClient = (token: string, onUnauthorizedError: Function):ApolloClient<NormalizedCacheObject> => {
  const authLink = createAuthLink(token);
  const wsLink = createWebSocketLink();
  const errorLink = createErrorLink(onUnauthorizedError);

  return new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_URI,
    cache: new InMemoryCache({ addTypename: false }),
    link: ApolloLink.from([errorLink, wsLink, authLink]),
  });
};

const createAuthLink = (token: string): ApolloLink => {
  const auth = token && { Authorization: `Bearer ${token}` };
  return setContext((request, { headers }) => ({
    headers: { ...headers, ...auth },
  }));
};

const createWebSocketLink = ():ApolloLink => {
  const wsClient = new SubscriptionClient(process.env.REACT_APP_GRAPHQL_WS_URI, {
    reconnect: true,
  });
  return new WebSocketLink(wsClient);
};

const createErrorLink = (onUnauthorizedError: Function): ApolloLink => onError(({ graphQLErrors, networkError = {} as any, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      // eslint-disable-next-line no-console
      console.error(`[GraphQL error]: ${message}`, {
        locations,
        operationName: operation?.operationName,
        path,
      });
    });
  }
  if (networkError) {
    const errorCode = networkError?.response?.status;
    if (errorCode === 401) {
      onUnauthorizedError(networkError);
    } else {
      // eslint-disable-next-line no-console
      console.error('network error when fetching', networkError);
    }
  }
});
