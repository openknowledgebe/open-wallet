import React from 'react';
import { Divider, Button } from '@blueprintjs/core';
import { Mutation } from 'react-apollo';
import useFormInput from '../hooks/useFormInput';
import samePassword from '../../lib/samePassword';
import { UPDATE_ME } from '../../graphql/queries';
import InputField from '../commons/InputField';

const renderUI = (password, passwordRepeat, onSubmit, save, loading) => {
  return (
    <div>
      <h2>Change password</h2>
      <Divider />
      <br />
      <form method="post" onSubmit={e => onSubmit(e, save)}>
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
        <Button type="submit">Save</Button>
      </form>
    </div>
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
