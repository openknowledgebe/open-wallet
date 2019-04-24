import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Divider, Button } from '@blueprintjs/core';
import { Mutation } from 'react-apollo';
import { validateAll } from 'indicative';
import InputField from '../commons/InputField';
import useFormFields from '../hooks/useFormFields';
import { UPDATE_ME } from '../../graphql/queries';
import { addressType } from '../../types';
import formatErrors from '../../lib/formatErrors';
import { required } from '../../lib/validation';

const Address = ({ address }) => {
  const [errors, setErrors] = useState();

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

  const handleSubmit = (e, save) => {
    e.preventDefault();
    const streetValidation = required('Street');
    const cityValidation = required('City');
    const countryValidation = required('Country');

    const data = variables.user.address;

    const rules = {
      ...streetValidation.rule,
      ...cityValidation.rule,
      ...countryValidation.rule,
      zipCode: 'required'
    };
    const messages = {
      ...streetValidation.message,
      ...cityValidation.message,
      ...countryValidation.message,
      'zipCode.required': 'Zip Code is required.'
    };

    validateAll(data, rules, messages)
      .then(() => {
        save();
      })
      .catch(errs => {
        console.log(errs);
        setErrors(formatErrors(errs));
      });
  };

  return (
    <Mutation mutation={UPDATE_ME} variables={variables}>
      {/* TODO handle error */}
      {(save, { loading }) => (
        <UI address={newAddress} handleSubmit={handleSubmit} loading={loading} save={save} />
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

const UI = ({ address, handleSubmit, loading, save }) => {
  return (
    <div>
      <h2>My address</h2>
      <Divider />
      <br />
      <form method="post" onSubmit={e => handleSubmit(e, save)}>
        <InputField
          id="street"
          label="Street"
          value={address.fields.street}
          handler={address.onChange}
          disabled={loading}
          name="street"
        />
        <InputField
          id="city"
          label="City"
          value={address.fields.city}
          handler={address.onChange}
          disabled={loading}
          name="city"
        />
        <InputField
          id="zipCode"
          label="Zip Code"
          value={address.fields.zipCode}
          handler={address.onChange}
          disabled={loading}
          name="zipCode"
          type="number"
        />
        <InputField
          id="country"
          label="Country"
          value={address.fields.country}
          handler={address.onChange}
          disabled={loading}
          name="country"
        />
        <Button loading={loading} type="submit">
          Save
        </Button>
      </form>
    </div>
  );
};

UI.propTypes = {
  address: addressType.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

export default Address;
