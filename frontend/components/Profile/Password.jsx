import React from 'react';
import { Button, Card, Form } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import useFormInput from '../hooks/useFormInput';
import samePassword from '../../lib/samePassword';
import { UPDATE_ME } from '../../graphql/queries';
import InputField from '../commons/InputField';

const renderUI = (password, passwordRepeat, onSubmit, save, loading) => {
  return (
    <Card fluid>
      <Card.Content>
        <h2>Change password</h2>
      </Card.Content>
      <Card.Content>
        <Form size="massive" loading={loading} method="post" onSubmit={e => onSubmit(e, save)}>
          <InputField
            id="password"
            label="Password"
            value={password.value}
            handler={password.onChange}
            disabled={loading}
            name="password"
            type="password"
          />
          <InputField
            id="password-repeat"
            label="Confirm password"
            value={passwordRepeat.value}
            handler={passwordRepeat.onChange}
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

  const variables = {
    user: {
      password: password.value
    }
  };

  const onSubmit = (e, save) => {
    e.preventDefault();
    if (samePassword(password.value, passwordRepeat.value)) {
      save();
    }
  };

  return (
    <Mutation mutation={UPDATE_ME} variables={variables}>
      {/* TODO handle error */}
      {(save, { loading }) => renderUI(password, passwordRepeat, onSubmit, save, loading)}
    </Mutation>
  );
};

export default Password;
