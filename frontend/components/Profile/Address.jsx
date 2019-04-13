import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Form } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import InputField from '../commons/InputField';
import useFormFields from '../hooks/useFormFields';
import { UPDATE_ME } from '../../graphql/queries';
import { addressType } from '../../types';

const Address = ({ address }) => {
  let addr = address;
  if (!addr) {
    addr = {
      street: '',
      city: '',
      country: ''
    };
  }

  const newAddress = useFormFields({
    ...addr
  });

  const onSubmit = (e, save) => {
    e.preventDefault();
    save();
  };

  const variables = {
    user: {
      address: {
        street: newAddress.fields.street,
        city: newAddress.fields.city,
        zipCode: parseInt(newAddress.fields.zipCode, 10),
        country: newAddress.fields.country
      }
    }
  };

  return (
    <Mutation mutation={UPDATE_ME} variables={variables}>
      {/* TODO handle error */}
      {(save, { loading }) => (
        <UI address={newAddress} onSubmit={onSubmit} loading={loading} save={save} />
      )}
    </Mutation>
  );
};

Address.defaultProps = {
  address: null
};

Address.propTypes = {
  address: addressType
};

const UI = ({ address, onSubmit, loading, save }) => {
  return (
    <Card fluid>
      <Card.Content>
        <h2>My address</h2>
      </Card.Content>
      <Card.Content>
        <Form size="massive" loading={loading} method="post" onSubmit={e => onSubmit(e, save)}>
          <InputField
            id="up-profile-address-street"
            label="Street"
            value={address.fields.street}
            onChange={address.onChange}
            name="street"
          />
          <InputField
            id="up-profile-address-city"
            label="City"
            value={address.fields.city}
            onChange={address.onChange}
            name="city"
          />
          <InputField
            id="up-profile-address-zipCode"
            label="Zip Code"
            value={address.fields.zipCode}
            onChange={address.onChange}
            name="zipCode"
            type="number"
          />
          <InputField
            id="up-profile-address-country"
            label="Country"
            value={address.fields.country}
            onChange={address.onChange}
            name="country"
          />
          <Button size="massive" primary type="submit">
            Save
          </Button>
        </Form>
      </Card.Content>
    </Card>
  );
};

UI.propTypes = {
  address: addressType.isRequired,
  onSubmit: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

export default Address;
