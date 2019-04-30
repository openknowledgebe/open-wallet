import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Form } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import { validateAll } from 'indicative';
import InputField from '../commons/InputField';
import useFormFields from '../hooks/useFormFields';
import { UPDATE_ME } from '../../graphql/queries';
import { addressType } from '../../types';
import formatErrors from '../../lib/formatErrors';
import { required } from '../../lib/validation';
import ErrorMessage from '../commons/ErrorMessage';
import SuccessMessage from '../commons/SuccessMessage';

const Address = ({ address }) => {
  const [errors, setErrors] = useState({});

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
        zipCode: newAddress.fields.zipCode ? parseInt(newAddress.fields.zipCode, 10) : undefined,
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
        setErrors(formatErrors(errs));
      });
  };

  return (
    <Mutation mutation={UPDATE_ME} variables={variables}>
      {/* TODO handle error */}
      {(save, { data, error, loading }) => (
        <UI
          success={!!data}
          error={error}
          address={newAddress}
          errors={errors}
          handleSubmit={handleSubmit}
          loading={loading}
          save={save}
        />
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

const UI = ({ address, errors, success, error, handleSubmit, loading, save }) => {
  return (
    <Card fluid raised style={{ height: '100%' }}>
      <Card.Content>
        <h2>My address</h2>
      </Card.Content>
      <Card.Content style={{ height: '100%' }}>
        <Form
          size="massive"
          success={success}
          error={!!error}
          loading={loading}
          method="post"
          onSubmit={e => handleSubmit(e, save)}
        >
          <ErrorMessage error={error} />
          <SuccessMessage message="Your address has been saved!" />
          <InputField
            id="up-profile-address-street"
            label="Street"
            value={address.fields.street}
            onChange={address.onChange}
            errorMessage={errors.street}
            name="street"
          />
          <InputField
            id="up-profile-address-city"
            label="City"
            value={address.fields.city}
            onChange={address.onChange}
            errorMessage={errors.city}
            name="city"
          />
          <InputField
            id="up-profile-address-zipCode"
            label="Zip Code"
            value={address.fields.zipCode}
            onChange={address.onChange}
            errorMessage={errors.zipCode}
            name="zipCode"
            type="number"
          />
          <InputField
            id="up-profile-address-country"
            label="Country"
            value={address.fields.country}
            onChange={address.onChange}
            errorMessage={errors.country}
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

UI.defaultProps = {
  error: undefined
};

UI.propTypes = {
  address: addressType.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  error: PropTypes.object
};

export default Address;
