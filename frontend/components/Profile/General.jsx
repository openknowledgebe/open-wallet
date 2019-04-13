import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Form } from 'semantic-ui-react';
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

  const saveButton = (
    <Button primary size="big" type="submit">
      Save
    </Button>
  );

  return (
    <Card fluid>
      <Card.Content>
        <h2>General</h2>
      </Card.Content>
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
            <Card.Content>
              <Form
                size="massive"
                loading={loading}
                method="post"
                onSubmit={e => {
                  onSubmit(e, save);
                }}
              >
                <InputField
                  id="up-profile-gen-name"
                  label="Name"
                  value={newName.value}
                  onChange={newName.onChange}
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
                  onSubmit(e, save);
                }}
              >
                <InputField
                  id="up-profile-gen-email"
                  label="Email"
                  value={newEmail.value}
                  onChange={newEmail.onChange}
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
