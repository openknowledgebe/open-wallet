import React, { useState } from 'react';
import { Form } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import { validateAll } from 'indicative';
import InputField from './commons/InputField';
import useFormInput from './hooks/useFormInput';
import { REGISTER_ME } from '../graphql/queries';
import formatErrors from '../lib/formatErrors';
import { EMAIL, required, PASSWORD } from '../lib/validation';
import ErrorMessage from './commons/ErrorMessage';
import SuccessMessage from './commons/SuccessMessage';

const Register = () => {
  const email = useFormInput('');
  const name = useFormInput('');
  const password = useFormInput('');
  const passwordRepeat = useFormInput('');

  const [errors, setErrors] = useState({});

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
      {(register, { loading, data, error }) => (
        <div>
          <Form
            success={!!data}
            error={!!error}
            size="massive"
            loading={loading}
            method="post"
            onSubmit={e => handleSubmit(e, register)}
          >
            <ErrorMessage error={error} />
            <SuccessMessage message="Account succesfully created. You can login." />
            <InputField
              autoFocus
              name="name"
              label="Name"
              id="reg-name"
              placeholder="Full name (e.g John Doe)"
              errorMessage={errors.name}
              {...name}
            />
            <InputField
              name="email"
              label="Email"
              type="email"
              id="reg-email"
              placeholder="Your email address"
              errorMessage={errors.email}
              {...email}
            />
            <InputField
              name="password"
              label="Password"
              type="password"
              id="reg-password"
              placeholder="Your password"
              errorMessage={errors.password}
              {...password}
            />
            <InputField
              name="password-repeat"
              label="Password Repeat"
              type="password"
              id="reg-password-repeat"
              placeholder="Confirm your password"
              errorMessage={errors.password}
              {...passwordRepeat}
            />
            <Form.Button primary size="massive" type="submit">
              Sign up
            </Form.Button>
          </Form>
        </div>
      )}
    </Mutation>
  );
};

export default Register;
