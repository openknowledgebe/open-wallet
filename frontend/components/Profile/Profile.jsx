import React from 'react';
import { Divider, Button } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import InputField from '../commons/InputField';
import FormContainer from '../FormContainer';
import useFormInput from '../hooks/useFormInput';
import samePassword from '../../lib/samePassword';

const UPDATE_ME = gql`
  mutation UPDATE_PROFILE($user: UserUpdateInput!) {
    updateProfile(user: $user) {
      id
      name
    }
  }
`;

const Profile = ({ user }) => {
  const { address, bankDetails } = user;
  const name = useFormInput(user.name);
  const email = useFormInput(user.email);
  const street = useFormInput(address ? address.street : '');
  const city = useFormInput(address ? address.city : '');
  const country = useFormInput(address ? address.country : '');
  const zipCode = useFormInput(address ? address.zipCode : '');
  const iban = useFormInput(bankDetails ? bankDetails.iban : '');
  const bic = useFormInput(bankDetails ? bankDetails.bic : '');

  const password = useFormInput('');
  const passwordRepeat = useFormInput('');

  const onSubmit = (e, save) => {
    e.preventDefault();
    save();
  };

  return (
    <FormContainer>
      <h2>General</h2>
      <Divider />
      <br />
      <Mutation
        mutation={UPDATE_ME}
        variables={{
          user: {
            name: name.value
          }
        }}
      >
        {/* TODO handle error */}
        {(save, { loading }) => {
          const saveName = (
            <Button loading={loading} type="submit">
              Save
            </Button>
          );
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
                value={name.value}
                handler={name.onChange}
                disabled={loading}
                name="name"
                rightElement={saveName}
              />
            </form>
          );
        }}
      </Mutation>
      <Mutation
        mutation={UPDATE_ME}
        variables={{
          user: {
            email: email.value
          }
        }}
      >
        {/* TODO handle error */}
        {(save, { loading }) => {
          const saveEmail = (
            <Button loading={loading} type="submit">
              Save
            </Button>
          );
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
                value={email.value}
                handler={email.onChange}
                disabled={loading}
                name="email"
                rightElement={saveEmail}
              />
            </form>
          );
        }}
      </Mutation>
      <br />
      <h2>My address</h2>
      <Divider />
      <br />
      <Mutation
        mutation={UPDATE_ME}
        variables={{
          user: {
            address: {
              street: street.value,
              city: city.value,
              zipCode: zipCode.value,
              country: country.value
            }
          }
        }}
      >
        {/* TODO handle error */}
        {(save, { loading }) => (
          <form method="post" onSubmit={e => onSubmit(e, save)}>
            <InputField
              id="street"
              label="Street"
              value={street.value}
              handler={street.onChange}
              disabled={loading}
              name="street"
            />
            <InputField
              id="city"
              label="City"
              value={city.value}
              handler={city.onChange}
              disabled={loading}
              name="city"
            />
            <InputField
              id="zipCode"
              label="Zip Code"
              value={zipCode.value}
              handler={zipCode.onChange}
              disabled={loading}
              name="zipCode"
              type="number"
            />
            <InputField
              id="country"
              label="Country"
              value={country.value}
              handler={country.onChange}
              disabled={loading}
              name="country"
            />
            <Button loading={loading} type="submit">
              Save
            </Button>
          </form>
        )}
      </Mutation>
      <br />
      <br />
      <h2>My bank details</h2>
      <Divider />
      <br />
      <Mutation
        mutation={UPDATE_ME}
        variables={{
          user: {
            bankDetails: {
              iban: iban.value,
              bic: bic.value
            }
          }
        }}
      >
        {/* TODO handle error */}
        {(save, { loading }) => (
          <form method="post" onSubmit={e => onSubmit(e, save)}>
            <InputField
              id="iban"
              label="IBAN"
              value={iban.value}
              handler={iban.onChange}
              disabled={loading}
              name="iban"
            />
            <InputField
              id="bic"
              label="BIC"
              value={bic.value}
              handler={bic.onChange}
              disabled={loading}
              name="bic"
            />
            <Button loading={loading} type="submit">
              Save
            </Button>
          </form>
        )}
      </Mutation>
      <br />
      <br />
      <h2>Change password</h2>
      <Divider />
      <br />
      <Mutation
        mutation={UPDATE_ME}
        variables={{
          user: {
            password: password.value
          }
        }}
      >
        {/* TODO handle error */}
        {(save, { loading }) => (
          <form
            method="post"
            onSubmit={e => {
              e.preventDefault();
              if (samePassword(password.value, passwordRepeat.value)) {
                save();
              }
            }}
          >
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
        )}
      </Mutation>
    </FormContainer>
  );
};

Profile.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    bankDetails: PropTypes.shape({
      bic: PropTypes.string,
      iban: PropTypes.string
    }),
    address: PropTypes.shape({
      city: PropTypes.string,
      country: PropTypes.string,
      zipCode: PropTypes.number,
      street: PropTypes.string
    })
  }).isRequired
};
export default Profile;
