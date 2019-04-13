import React from 'react';
import { Form } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import InputField from './commons/InputField';
import samePassword from '../lib/samePassword';
import useFormInput from './hooks/useFormInput';
import { REGISTER_ME } from '../graphql/queries';

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
          <Form
            size="massive"
            loading={loading}
            method="post"
            onSubmit={e => {
              e.preventDefault();
              if (samePassword(password.value, passwordRepeat.value)) {
                register();
              }
            }}
          >
            <InputField
              autoFocus
              name="name"
              label="First name"
              id="reg-name"
              placeholder="Full name (e.g John Doe)"
              {...name}
            />
            <InputField
              name="email"
              label="Email"
              type="email"
              id="reg-email"
              placeholder="Your email address"
              {...email}
            />
            <InputField
              name="password"
              label="Password"
              type="password"
              id="reg-password"
              placeholder="Your password"
              {...password}
            />
            <InputField
              name="password-repeat"
              label="Password Repeat"
              type="password"
              id="reg-password-repeat"
              placeholder="Confirm your password"
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
