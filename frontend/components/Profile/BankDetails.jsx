import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import { Divider, Button } from '@blueprintjs/core';
import { validateAll } from 'indicative';
import { UPDATE_ME } from '../../graphql/queries';
import useFormInput from '../hooks/useFormInput';
import InputField from '../commons/InputField';
import { bankDetailsType } from '../../types';
import formatErrors from '../../lib/formatErrors';
import { required } from '../../lib/validation';

const renderUI = (iban, bic, handleSubmit, save, loading) => {
  return (
    <div>
      <h2>My bank details</h2>
      <Divider />
      <br />
      <form method="post" onSubmit={e => handleSubmit(e, save)}>
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
    </div>
  );
};

const BankDetails = ({ bankDetails }) => {
  const iban = useFormInput(bankDetails ? bankDetails.iban : '');
  const bic = useFormInput(bankDetails ? bankDetails.bic : '');
  const [errors, setErrors] = useState();

  const variables = {
    user: {
      bankDetails: {
        iban: iban.value,
        bic: bic.value
      }
    }
  };

  const handleSubmit = (e, save) => {
    e.preventDefault();
    const ibanValidation = required('IBAN');
    validateAll(iban.value, ibanValidation.rule, ibanValidation.message)
      .then(() => save())
      .catch(errs => {
        setErrors(formatErrors(errs));
      });
  };
  return (
    <Mutation mutation={UPDATE_ME} variables={variables}>
      {/* TODO handle error */}
      {(save, { loading }) => renderUI(iban, bic, handleSubmit, save, loading)}
    </Mutation>
  );
};

BankDetails.defaultProps = {
  bankDetails: null
};

BankDetails.propTypes = {
  bankDetails: bankDetailsType
};

export default BankDetails;
