import React, { useState } from 'react';
import { validateAll } from 'indicative';
import { FormGroup, InputGroup, Button, Intent } from '@blueprintjs/core';
import { Mutation } from 'react-apollo';
import useFormInput from './hooks/useFormInput';
import { LOG_ME_IN } from '../graphql/queries';
import formatErrors from '../lib/formatErrors';
import { EMAIL, required } from '../lib/validation';

const Login = () => {
  const [errors, setErrors] = useState({ email: '', password: '' });
  const email = useFormInput('');
  const password = useFormInput('');

  const handleSubmit = (event, login) => {
    event.preventDefault();
    setErrors({});
    const passwordValidation = required('Password');
    const data = { email: email.value, password: password.value };
    const rules = {
      email: EMAIL.rule,
      ...passwordValidation.rule
    };

    const messages = {
      ...EMAIL.messages,
      ...passwordValidation.message
    };

    validateAll(data, rules, messages)
      .then(() => {
        login();
      })
      .catch(errs => {
        setErrors(formatErrors(errs));
      });
  };

  return (
    <Mutation mutation={LOG_ME_IN} variables={{ email: email.value, password: password.value }}>
      {/* TODO handle error */}
      {/* TODO redirect to user home page */}
      {(login, { loading }) => {
        return (
          <div>
            <form method="post" onSubmit={e => handleSubmit(e, login)}>
              <FormGroup label="Email" labelFor="email" disabled={loading}>
                <div>{errors.email}</div>
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
                <div>{errors.password}</div>
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
