import React from 'react';
import { Query } from 'react-apollo';
import Profile from './Profile';
import { QUERY_ME } from '../../graphql/queries';

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
