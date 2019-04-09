import React from 'react';
import { FormGroup, InputGroup, Button, Intent } from '@blueprintjs/core';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import samePassword from '../lib/samePassword';
import useFormInput from './hooks/useFormInput';

const REGISTER_ME = gql`
  mutation REGISTER($user: UserInput!) {
    register(user: $user) {
      id
      name
    }
  }
`;

const Register = () => {
  const email = useFormInput('');
  const name = useFormInput('');
  const password = useFormInput('');
  const passwordRepeat = useFormInput('');

  return (
    <Mutation
      mutation={REGISTER_ME}
      variables={{
        user: {
          email: email.value,
          name: name.value,
          password: password.value
        }
      }}
    >
      {/* TODO handle error */}
      {/* Alert email sent */}
      {(register, { loading }) => (
        <div>
          <form
            method="post"
            onSubmit={e => {
              e.preventDefault();
              if (samePassword(password.value, passwordRepeat.value)) {
                register();
              }
            }}
          >
            <FormGroup label="First name" labelFor="reg-name" disabled={loading}>
              <InputGroup
                large
                id="reg-name"
                placeholder="Full name (e.g John Doe)"
                {...name}
                disabled={loading}
              />
            </FormGroup>
            <FormGroup label="Email" labelFor="reg-email" disabled={loading}>
              <InputGroup
                large
                type="email"
                id="reg-email"
                placeholder="Your email address"
                {...email}
                disabled={loading}
              />
            </FormGroup>
            <FormGroup label="Password" labelFor="reg-password" disabled={loading}>
              <InputGroup
                large
                type="password"
                id="reg-password"
                placeholder="Your password"
                {...password}
                disabled={loading}
              />
            </FormGroup>
            <FormGroup label="Password Repeat" labelFor="reg-password-repeat" disabled={loading}>
              <InputGroup
                large
                type="password"
                id="reg-password-repeat"
                placeholder="Your password a second time"
                {...passwordRepeat}
                disabled={loading}
              />
            </FormGroup>
            <Button large type="submit" loading={loading} intent={Intent.PRIMARY}>
              Sign up
            </Button>
          </form>
        </div>
      )}
    </Mutation>
  );
};

export default Register;
