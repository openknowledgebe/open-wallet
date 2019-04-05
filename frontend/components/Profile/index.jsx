import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Profile from './Profile';

const QUERY_ME = gql`
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
`;

const ProfileContainer = () => {
  return (
    <Query query={QUERY_ME}>
      {({ data }) => {
        const { me } = data;
        return <Profile user={me} />;
      }}
    </Query>
  );
};

export default ProfileContainer;
