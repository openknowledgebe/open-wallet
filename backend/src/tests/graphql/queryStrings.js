/* eslint-disable import/no-extraneous-dependencies */
const gql = require('graphql-tag');

module.exports.GET_ME = gql`
  query me {
    me {
      name
      email
    }
  }
`;

module.exports.LOGIN_ME_IN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      name
      email
    }
  }
`;

module.exports.REGISTER = gql`
  mutation register($user: UserInput!) {
    register(user: $user) {
      name
      email
    }
  }
`;

module.exports.ALL_USERS = gql`
  query users {
    users {
      name
      email
    }
  }
`;
