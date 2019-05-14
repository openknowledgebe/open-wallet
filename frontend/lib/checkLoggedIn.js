/**
 * inspired by = https://github.com/zeit/next.js/blob/canary/examples/with-apollo-auth/lib/checkLoggedIn.js
 */
import { QUERY_ME } from '../graphql/queries';

/**
 * Retrieves the logged in user.
 *
 * @param {ApolloClient} apolloClient
 * @returns {object} An object wrapping the logged in user.
 */
export default apolloClient =>
  apolloClient
    .query({
      query: QUERY_ME
    })
    .then(({ data }) => {
      return { loggedInUser: data };
    })
    .catch(() => {
      // Fail gracefully
      return { loggedInUser: {} };
    });
