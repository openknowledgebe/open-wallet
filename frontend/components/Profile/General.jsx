import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Form } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import { validateAll } from 'indicative';
import InputField from '../commons/InputField';
import useFormInput from '../hooks/useFormInput';
import { UPDATE_ME } from '../../graphql/queries';
import formatErrors from '../../lib/formatErrors';
import { EMAIL, required } from '../../lib/validation';
import ErrorMessage from '../commons/ErrorMessage';
import SuccessMessage from '../commons/SuccessMessage';

const General = ({ name, email }) => {
  const newName = useFormInput(name);
  const newEmail = useFormInput(email);
  const [errors, setErrors] = useState({});
  const [messages, setMessages] = useState({});

  const succesMessage = fieldName => `Your ${fieldName} has been saved!`;
  const handleCompleted = fieldName => {
    setMessages({ success: succesMessage(fieldName) });
  };
  const handleErrored = error => {
    setMessages({ error });
  };

  const handleNameSubmit = (e, save) => {
    e.preventDefault();
    setErrors({});
    setMessages({});
    const nameValidation = required('Name');
    const data = { name: newName.value };

    validateAll(data, nameValidation.rule, nameValidation.message)
      .then(() => {
        save();
      })
      .catch(errs => {
        setErrors(formatErrors(errs));
      });
  };

  const handleEmailSubmit = (e, save) => {
    e.preventDefault();
    setErrors({});
    setMessages({});
    const data = { email: newEmail.value };

    validateAll(data, { email: EMAIL.rule }, EMAIL.messages)
      .then(() => {
        save();
      })
      .catch(errs => {
        setErrors(formatErrors(errs));
      });
  };

  const saveButton = (
    <Button primary size="big" type="submit">
      Save
    </Button>
  );

  return (
    <Card fluid style={{ height: '100%' }} raised>
      <Card.Content>
        <h2>General</h2>
      </Card.Content>

      {messages.error && (
        <Card.Content>
          <ErrorMessage error={messages.error} />
        </Card.Content>
      )}
      {messages.success && (
        <Card.Content>
          <SuccessMessage message={messages.success} />
        </Card.Content>
      )}

      <Mutation
        mutation={UPDATE_ME}
        variables={{
          user: {
            name: newName.value
          }
        }}
        onCompleted={() => {
          handleCompleted('Name');
        }}
        onError={handleErrored}
      >
        {/* TODO handle error */}
        {(save, { loading }) => {
          return (
            <Card.Content>
              <Form
                size="massive"
                loading={loading}
                method="post"
                onSubmit={e => {
                  handleNameSubmit(e, save);
                }}
              >
                <InputField
                  id="up-profile-gen-name"
                  label="Name"
                  value={newName.value}
                  onChange={newName.onChange}
                  errorMessage={errors.name}
                  name="name"
                  action={saveButton}
                />
              </Form>
            </Card.Content>
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
        onCompleted={() => {
          handleCompleted('Email');
        }}
        onError={handleErrored}
      >
        {/* TODO handle error */}
        {(save, { loading }) => {
          return (
            <Card.Content style={{ height: '100%' }}>
              <Form
                size="massive"
                loading={loading}
                method="post"
                onSubmit={e => {
                  handleEmailSubmit(e, save);
                }}
              >
                <InputField
                  id="up-profile-gen-email"
                  label="Email"
                  value={newEmail.value}
                  onChange={newEmail.onChange}
                  errorMessage={errors.email}
                  name="email"
                  action={saveButton}
                />
              </Form>
            </Card.Content>
          );
        }}
      </Mutation>
    </Card>
  );
};

General.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired
};

export default General;
