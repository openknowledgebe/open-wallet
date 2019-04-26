import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import { Button, Card, Form } from 'semantic-ui-react';
import { validateAll } from 'indicative';
import { UPDATE_ME } from '../../graphql/queries';
import useFormInput from '../hooks/useFormInput';
import InputField from '../commons/InputField';
import { bankDetailsType } from '../../types';
import formatErrors from '../../lib/formatErrors';
import { required } from '../../lib/validation';

const renderUI = (iban, bic, handleSubmit, save, loading) => {
  return (
    <Card fluid>
      <Card.Content>
        <h2>My bank details</h2>
      </Card.Content>
      <Card.Content>
        <Form size="massive" loading={loading} method="post" onSubmit={e => handleSubmit(e, save)}>
          <InputField
            id="up-profile-bankdetails-iban"
            label="IBAN"
            value={iban.value}
            onChange={iban.onChange}
            name="iban"
          />
          <InputField
            id="up-profile-bankdetails-bic"
            label="BIC"
            value={bic.value}
            onChange={bic.onChange}
            name="bic"
          />
          <Button primary size="massive" type="submit">
            Save
          </Button>
        </Form>
      </Card.Content>
    </Card>
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
