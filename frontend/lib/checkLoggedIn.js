import { QUERY_ME } from '../graphql/queries';

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
