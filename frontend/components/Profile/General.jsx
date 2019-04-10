import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Button } from '@blueprintjs/core';
import { Mutation } from 'react-apollo';
import InputField from '../commons/InputField';
import useFormInput from '../hooks/useFormInput';
import { UPDATE_ME } from '../../graphql/queries';

const General = ({ name, email }) => {
  const newName = useFormInput(name);
  const newEmail = useFormInput(email);

  const onSubmit = (e, save) => {
    e.preventDefault();
    save();
  };

  const saveButton = loading => {
    return (
      <Button loading={loading} type="submit">
        Save
      </Button>
    );
  };

  return (
    <div>
      <h2>General</h2>
      <Divider />
      <br />
      <Mutation
        mutation={UPDATE_ME}
        variables={{
          user: {
            name: newName.value
          }
        }}
      >
        {/* TODO handle error */}
        {(save, { loading }) => {
          return (
            <form
              method="post"
              onSubmit={e => {
                onSubmit(e, save);
              }}
            >
              <InputField
                id="name"
                label="Name"
                value={newName.value}
                handler={newName.onChange}
                disabled={loading}
                name="name"
                rightElement={saveButton(loading)}
              />
            </form>
          );
        }}
      </Mutation>
      <Mutation
        mutation={UPDATE_ME}
        variables={{
          user: {
            email: newEmail.value
          }
        }}
      >
        {/* TODO handle error */}
        {(save, { loading }) => {
          return (
            <form
              method="post"
              onSubmit={e => {
                onSubmit(e, save);
              }}
            >
              <InputField
                id="email"
                label="Email"
                value={newEmail.value}
                handler={newEmail.onChange}
                disabled={loading}
                name="email"
                rightElement={saveButton(loading)}
              />
            </form>
          );
        }}
      </Mutation>
    </div>
  );
};

General.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired
};

export default General;
