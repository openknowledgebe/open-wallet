import React, { useState } from 'react';
import { validateAll } from 'indicative';
import { Mutation } from 'react-apollo';
import { Button, Card, Form, Label } from 'semantic-ui-react';
import Link from 'next/link';
import InputField from './commons/InputField';
import formatErrors from '../lib/formatErrors';
import useFormFields from './hooks/useFormFields';
import useInputFile from './hooks/useInputFile';
import { validateFile, NON_NEGATIVE, required } from '../lib/validation';
import { EXPENSE_CLAIM } from '../graphql/queries';
import SuccessMessage from './commons/SuccessMessage';
import ErrorMessage from './commons/ErrorMessage';
import InfoMessage from './commons/InfoMessage';

const renderUI = (expense, receipt, errors, success, error, handleSubmit, save, loading) => {
  return (
    <Card fluid>
      <Card.Content>
        <h2>Submit an expense</h2>
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
          <InfoMessage>
            Please make sure your personal data (especially bank details) are up to date!{' '}
            <Link href="/profile">
              <a> Click here for a quick update!</a>
            </Link>
          </InfoMessage>
          <ErrorMessage error={error} />
          <SuccessMessage message="Your expense has been submitted." />
          <InputField
            type="file"
            name="receipt"
            label="Receipt"
            id="expense-form-receipt"
            value={receipt.file.value}
            onChange={receipt.onChange}
            errorMessage={errors.receipt}
          />
          <InputField
            name="description"
            label="Description"
            id="expense-form-description"
            value={expense.fields.description}
            onChange={expense.onChange}
            errorMessage={errors.description}
          />
          <InputField
            type="number"
            name="amount"
            label="Amount"
            id="expense-form-amount"
            value={expense.fields.amount}
            onChange={expense.onChange}
            errorMessage={errors.amount}
          >
            <input />
            <Label style={{ fontSize: 'inherit', display: 'flex', alignItems: 'center' }}>€</Label>
          </InputField>
          <InputField
            type="number"
            name="VAT"
            label="VAT"
            id="expense-form-vat"
            value={expense.fields.VAT}
            onChange={expense.onChange}
            errorMessage={errors.VAT}
          >
            <input />
            <Label style={{ fontSize: 'inherit', display: 'flex', alignItems: 'center' }}>%</Label>
          </InputField>
          <Button type="submit" primary size="massive">
            Claim
          </Button>
        </Form>
      </Card.Content>
    </Card>
  );
};

const ExpenseForm = () => {
  const expense = useFormFields({ VAT: 21 });
  const receipt = useInputFile({});
  const [errors, setErrors] = useState({});
  const variables = {
    receipt: receipt.file.file,
    amount: expense.fields.amount ? parseFloat(expense.fields.amount) : undefined,
    description: expense.fields.description,
    VAT: expense.fields.VAT ? parseInt(expense.fields.VAT, 10) : undefined
  };
  const handleSubmit = (e, claim) => {
    e.preventDefault();
    setErrors({});
    validateFile(expense.fields.receipt);

    const descriptionValidation = required('Description');
    const amountRequired = required('Amount');

    const messages = {
      ...descriptionValidation.message,
      ...amountRequired.message,
      above: NON_NEGATIVE.message
    };

    const rules = {
      ...descriptionValidation.rule,
      amount: `${amountRequired.rule.amount}|${NON_NEGATIVE.rule}`,
      VAT: NON_NEGATIVE.rule
    };

    validateAll(variables, rules, messages)
      .then(() => claim())
      .catch(errs => {
        setErrors(formatErrors(errs));
      });
  };

  return (
    <Mutation mutation={EXPENSE_CLAIM} variables={variables}>
      {(claim, { data, error, loading }) => {
        return renderUI(expense, receipt, errors, !!data, error, handleSubmit, claim, loading);
      }}
    </Mutation>
  );
};

export default ExpenseForm;
