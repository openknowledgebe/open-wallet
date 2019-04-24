import React, { useState } from 'react';
import { FormGroup, InputGroup, Button, Intent } from '@blueprintjs/core';
import { validateAll } from 'indicative';
import { Mutation } from 'react-apollo';
import useFormInput from './hooks/useFormInput';
import { REGISTER_ME } from '../graphql/queries';
import formatErrors from '../lib/formatErrors';
import { EMAIL, required, PASSWORD } from '../lib/validation';

const Register = () => {
  const email = useFormInput('');
  const name = useFormInput('');
  const password = useFormInput('');
  const passwordRepeat = useFormInput('');

  const [errors, setErrors] = useState();

  const variables = {
    user: {
      email: email.value,
      name: name.value,
      password: password.value
    }
  };

  const handleSubmit = (e, register) => {
    e.preventDefault();
    setErrors({});
    const data = variables.user;
    data.password_confirmation = passwordRepeat.value;

    const nameValidation = required('Name');
    const rules = {
      ...nameValidation.rule,
      email: EMAIL.rule,
      password: PASSWORD.rule
    };

    const messages = {
      ...nameValidation.message,
      ...EMAIL.messages,
      ...PASSWORD.messages
    };

    validateAll(data, rules, messages)
      .then(() => register())
      .catch(errs => {
        setErrors(formatErrors(errs));
      });
  };

  return (
    <Mutation mutation={REGISTER_ME} variables={variables}>
      {/* TODO handle error */}
      {/* Alert email sent */}
      {(register, { loading }) => (
        <div>
          <form method="post" onSubmit={e => handleSubmit(e, register)}>
            <FormGroup label="Name" labelFor="reg-name" disabled={loading}>
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
