import React, { useState } from 'react';
import { Button, Card, Form } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import { validateAll } from 'indicative';
import useFormInput from '../hooks/useFormInput';
import { UPDATE_ME } from '../../graphql/queries';
import InputField from '../commons/InputField';
import formatErrors from '../../lib/formatErrors';
import { PASSWORD } from '../../lib/validation';

const renderUI = (password, passwordRepeat, handleSubmit, save, loading) => {
  return (
    <Card fluid>
      <Card.Content>
        <h2>Change password</h2>
      </Card.Content>
      <Card.Content>
        <Form size="massive" loading={loading} method="post" onSubmit={e => handleSubmit(e, save)}>
          <InputField
            id="password"
            label="Password"
            value={password.value}
            onChange={password.onChange}
            disabled={loading}
            name="password"
            type="password"
          />
          <InputField
            id="password-repeat"
            label="Confirm password"
            value={passwordRepeat.value}
            onChange={passwordRepeat.onChange}
            disabled={loading}
            name="password-repeat"
            type="password"
          />
          <Button size="massive" primary type="submit">
            Save
          </Button>
        </Form>
      </Card.Content>
    </Card>
  );
};

const Password = () => {
  const password = useFormInput('');
  const passwordRepeat = useFormInput('');
  const [errors, setErrors] = useState();

  const variables = {
    user: {
      password: password.value
    }
  };

  const handleSubmit = (e, save) => {
    e.preventDefault();

    const data = { password: password.value, password_confirmation: passwordRepeat.value };

    const rules = {
      password: PASSWORD.rule
    };

    const messages = {
      ...PASSWORD.messages
    };

    validateAll(data, rules, messages)
      .then(() => {
        save();
      })
      .catch(errs => {
        setErrors(formatErrors(errs));
      });
  };

  return (
    <Mutation mutation={UPDATE_ME} variables={variables}>
      {/* TODO handle error */}
      {(save, { loading }) => renderUI(password, passwordRepeat, handleSubmit, save, loading)}
    </Mutation>
  );
};

export default Password;
