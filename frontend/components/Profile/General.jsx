import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Divider, Button } from '@blueprintjs/core';
import { Mutation } from 'react-apollo';
import { validateAll } from 'indicative';
import InputField from '../commons/InputField';
import useFormInput from '../hooks/useFormInput';
import { UPDATE_ME } from '../../graphql/queries';
import formatErrors from '../../lib/formatErrors';
import { EMAIL, required } from '../../lib/validation';

const General = ({ name, email }) => {
  const newName = useFormInput(name);
  const newEmail = useFormInput(email);
  const [errors, setErrors] = useState();

  const handleNameSubmit = (e, save) => {
    e.preventDefault();
    const nameValidarion = required('Name');
    const data = { name: newName.value };

    validateAll(data, nameValidarion.rule, nameValidarion.message)
      .then(() => {
        save();
      })
      .catch(errs => {
        setErrors(formatErrors(errs));
      });
  };

  const handleEmailSubmit = (e, save) => {
    e.preventDefault();
    const data = { email: newEmail.value };

    validateAll(data, { email: EMAIL.rule }, EMAIL.messages)
      .then(() => {
        save();
      })
      .catch(errs => {
        setErrors(formatErrors(errs));
      });
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
                handleNameSubmit(e, save);
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
                handleEmailSubmit(e, save);
              }}
            >
              <InputField
                id="email"
                type="email"
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
