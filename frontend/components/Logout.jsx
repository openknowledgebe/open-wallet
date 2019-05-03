import React from 'react';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import { Menu } from 'semantic-ui-react';
import { LOG_ME_OUT } from '../graphql/queries';

const Logout = () => {
  return (
    <Mutation mutation={LOG_ME_OUT}>
      {(logout, { client, data }) => {
        if (data) {
          client.clearStore();
          Router.push('/');
        }
        // TODO handle error
        return (
          <Menu.Item as="a" onClick={logout}>
            Logout
          </Menu.Item>
        );
      }}
    </Mutation>
  );
};

export default Logout;
