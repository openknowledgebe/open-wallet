import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import withApollo from 'next-with-apollo';
import { endpoint } from '../configs';

export default withApollo(
  ({ initialState, headers = {} }) => {
    const httpLink = createUploadLink({
      uri: process.env.NODE_ENV === 'development' ? endpoint : process.env.ENDPOINT,
      fetchOptions: { credentials: 'include' }
    });

    const contextLink = setContext(async () => ({
      headers
    }));

    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(err => console.log(`[GraphQL error]: Message: ${err.message}`));
      }
      if (networkError) console.log(`[Network error]: ${networkError}`);
    });

    const link = ApolloLink.from([errorLink, contextLink, httpLink]);

    const cache = new InMemoryCache().restore(initialState || {});

    return new ApolloClient({ link, cache });
  },
  { getDataFromTree: 'ssr' }
);
