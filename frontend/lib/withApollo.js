import withApollo from "next-with-apollo";
import ApolloClient, { InMemoryCache } from "apollo-boost";
import { endpoint } from "../configs";

export default withApollo(
  ({ ctx, headers, initialState }) =>
    new ApolloClient({
      uri:
        process.env.NODE_ENV === "development"
          ? endpoint
          : process.env.ENDPOINT,
      cache: new InMemoryCache().restore(initialState || {}),
      fetchOptions: {
        credentials: "include"
      }
    })
);
