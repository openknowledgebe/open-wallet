import gql from 'graphql-tag';

export default apolloClient =>
  apolloClient
    .query({
      query: gql`
        query ME {
          me {
            name
            email
            bankDetails {
              iban
              bic
            }
            address {
              street
              city
              country
              zipCode
            }
          }
        }
      `
    })
    .then(({ data }) => {
      return { loggedInUser: data };
    })
    .catch(() => {
      // Fail gracefully
      return { loggedInUser: {} };
    });
