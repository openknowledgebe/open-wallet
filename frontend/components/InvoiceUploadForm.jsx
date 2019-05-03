import React, { useState } from 'react';
import { validateAll } from 'indicative';
import { Mutation } from 'react-apollo';
import { Button, Card, Form, Label } from 'semantic-ui-react';
import InputField from './commons/InputField';
import formatErrors from '../lib/formatErrors';
import useFormFields from './hooks/useFormFields';
import useInputFile from './hooks/useInputFile';
import { validateFile, NON_NEGATIVE, required } from '../lib/validation';
import { INVOICE_UPLOAD } from '../graphql/queries';
import SuccessMessage from './commons/SuccessMessage';
import ErrorMessage from './commons/ErrorMessage';

const renderUI = (invoice, invoiceFile, errors, success, error, handleSubmit, save, loading) => {
  return (
    <Card fluid raised>
      <Card.Content>
        <h2>Submit an invoice</h2>
      </Card.Content>
      <Card.Content>
        <Form
          success={success}
          error={!!error}
          size="massive"
          loading={loading}
          method="post"
          onSubmit={e => handleSubmit(e, save)}
        >
          <ErrorMessage error={error} />
          <SuccessMessage message="The invoice has been submitted." />
          <InputField
            type="file"
            name="invoice"
            label="Invoice"
            id="invoice-up-form-invoice"
            value={invoiceFile.file.value}
            onChange={invoiceFile.onChange}
            errorMessage={errors.invoice}
          />
          <InputField
            type="number"
            name="amount"
            label="Amount"
            id="invoice-up-form-amount"
            value={invoice.fields.amount}
            onChange={invoice.onChange}
            errorMessage={errors.amount}
          >
            <input />
            <Label style={{ fontSize: 'inherit' }}>€</Label>
          </InputField>
          <InputField
            type="date"
            name="date"
            label="Date"
            id="invoice-up-form-date"
            value={invoice.fields.date}
            onChange={invoice.onChange}
            errorMessage={errors.date}
          />
          <InputField
            type="date"
            name="expDate"
            label="Expiration date"
            id="invoice-up-form-exp-date"
            value={invoice.fields.expDate}
            onChange={invoice.onChange}
            errorMessage={errors.date}
          />
          <InputField
            type="number"
            name="VAT"
            label="VAT"
            id="invoice-up-form-vat"
            value={invoice.fields.VAT}
            onChange={invoice.onChange}
            errorMessage={errors.VAT}
          >
            <input />
            <Label style={{ fontSize: 'inherit' }}>%</Label>
          </InputField>
          <Button type="submit" primary size="massive">
            Submit
          </Button>
        </Form>
      </Card.Content>
    </Card>
  );
};

const InvoiceUploadForm = () => {
  const invoice = useFormFields({ VAT: 21 });
  const invoiceFile = useInputFile({});
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ success: false });

  const variables = {
    invoice: {
      amount: invoice.fields.amount ? parseFloat(invoice.fields.amount) : undefined,
      VAT: invoice.fields.VAT ? parseInt(invoice.fields.VAT, 10) : undefined,
      date: invoice.fields.date,
      expDate: invoice.fields.expDate,
      invoice: invoiceFile.file.file
    }
  };

  const handleCompleted = () => {
    setState({ success: true });
  };

  const handleError = error => setState({ error });

  const handleSubmit = (e, submit) => {
    e.preventDefault();
    setErrors({});
    validateFile(invoiceFile);

    setState({});

    const amountRequired = required('Amount');

    const messages = {
      ...amountRequired.message,
      above: NON_NEGATIVE.message
    };

    const rules = {
      amount: `${amountRequired.rule.amount}|${NON_NEGATIVE.rule}`,
      VAT: NON_NEGATIVE.rule
    };

    validateAll(variables.invoice, rules, messages)
      .then(() => submit())
      .catch(errs => {
        setErrors(formatErrors(errs));
      });
  };

  return (
    <Mutation
      mutation={INVOICE_UPLOAD}
      variables={variables}
      onCompleted={handleCompleted}
      onError={handleError}
    >
      {(claim, { loading }) => {
        return renderUI(
          invoice,
          invoiceFile,
          errors,
          state.success,
          state.error,
          handleSubmit,
          claim,
          loading
        );
      }}
    </Mutation>
  );
};

export default InvoiceUploadForm;
