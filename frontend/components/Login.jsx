import React, { useState } from 'react';
import { validateAll } from 'indicative';
import { Mutation } from 'react-apollo';
import { Form } from 'semantic-ui-react';
import InputField from './commons/InputField';
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
            <Form
              loading={loading}
              size="massive"
              method="post"
              onSubmit={e => handleSubmit(e, login)}
            >
              <InputField
                label="Email"
                name="email"
                type="email"
                id="login-email"
                placeholder="Your email address"
                autoFocus
                {...email}
              />
              <InputField
                name="password"
                label="Password"
                type="password"
                id="login-password"
                placeholder="Your password"
                {...password}
              />
              <Form.Button primary size="massive" type="submit">
                Sign in
              </Form.Button>
            </Form>
          </div>
        );
      }}
    </Mutation>
  );
};

export default Login;
