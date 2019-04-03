import React from 'react';
import { FormGroup, InputGroup, Button, Intent } from '@blueprintjs/core';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import useFormInput from './hooks/useFormInput';

const LOG_ME_IN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      name
    }
  }
`;

const Login = () => {
  const email = useFormInput('');
  const password = useFormInput('');
  return (
    <Mutation mutation={LOG_ME_IN} variables={{ email: email.value, password: password.value }}>
      {/* TODO handle error */}
      {/* TODO redirect to user home page */}
      {(login, { loading }) => {
        return (
          <div>
            <h1>Sign in</h1>
            <form
              method="post"
              onSubmit={e => {
                e.preventDefault();
                login();
              }}
            >
              <FormGroup label="Email" labelFor="email" disabled={loading}>
                <InputGroup
                  disabled={loading}
                  large
                  type="email"
                  id="email"
                  placeholder="Your email address"
                  {...email}
                />
              </FormGroup>
              <FormGroup label="Password" labelFor="password" disabled={loading}>
                <InputGroup
                  disabled={loading}
                  large
                  type="password"
                  id="password"
                  placeholder="Your password"
                  {...password}
                />
              </FormGroup>
              <Button large type="submit" loading={loading} intent={Intent.PRIMARY}>
                Sign in
              </Button>
            </form>
          </div>
        );
      }}
    </Mutation>
  );
};

export default Login;
