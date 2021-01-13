import {
  ApolloClient, split, InMemoryCache, NormalizedCacheObject, createHttpLink, ApolloLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { useMemo } from 'react';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

export const useInitApollo = (token: string | null, onUnauthorizedError: Function, onReceivedResponse: Function):ApolloClient<NormalizedCacheObject> => useMemo(() => createApolloClient(token, onUnauthorizedError, onReceivedResponse), [token]);

const createApolloClient = (token: string | null, onUnauthorizedError: Function, onReceivedResponse: Function):ApolloClient<NormalizedCacheObject> => {
  const authLink = createAuthLink(token);
  const errorLink = createErrorLink(onUnauthorizedError);
  const afterwareLink = createAfterLink(onReceivedResponse);
  const splitLink = createSplitLink(token, afterwareLink);

  return new ApolloClient({
    cache: new InMemoryCache({ addTypename: false }),
    link: ApolloLink.from([authLink, splitLink, errorLink]),
  });
};

const createAuthLink = (token: string | null): ApolloLink => {
  const auth = token && { Authorization: `Bearer ${token}` };
  return setContext((request, { headers }) => ({
    headers: { ...headers, ...auth },
  }));
};

const createErrorLink = (onUnauthorizedError: Function): ApolloLink => onError(({
  graphQLErrors, networkError = {} as any, operation, forward,
}) => {
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

const createAfterLink = (onReceivedResponse: Function) => new ApolloLink((operation, forward) => forward(operation).map((response) => {
  const context = operation.getContext();
  const { response: { headers } } = context;
  if (headers) {
    const authHeader = headers.get('Authorization') as string;
    authHeader && onReceivedResponse(authHeader);
  }
  return response;
}));

const createSplitLink = (token: string | null, afterwareLink: ApolloLink): ApolloLink => {
  const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_GRAPHQL_WS_URI as any,
    options: {
      reconnect: true,
      connectionParams: {
        ...token && { Authorization: `Bearer ${token}` },
      },
    },
  });

  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_URI,
    fetchOptions: { credentials: 'include' },
  });

  return split(({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  }, wsLink, afterwareLink.concat(httpLink));
};
