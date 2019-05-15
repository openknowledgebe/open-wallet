/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Label } from 'semantic-ui-react';

const InputField = ({
  label,
  name,
  id,
  type,
  isRequired,
  placeholder,
  disabled,
  value,
  onChange,
  action,
  errorMessage,
  autoFocus,
  children
}) => {
  return (
    <Form.Field error={!!errorMessage}>
      <label htmlFor={id}>{label}</label>
      <Input
        fluid
        labelPosition={children && 'right'}
        id={id}
        required={isRequired}
        placeholder={placeholder}
        name={name}
        type={type}
        disabled={disabled}
        value={value === null ? '' : value}
        onChange={onChange}
        autoFocus={autoFocus}
        action={action}
      >
        {children}
      </Input>
      {errorMessage && (
        <Label size="big" basic color="red" pointing>
          {errorMessage}
        </Label>
      )}
    </Form.Field>
  );
};

InputField.defaultProps = {
  type: 'text',
  disabled: false,
  isRequired: false,
  placeholder: '',
  value: '',
  action: undefined,
  errorMessage: undefined,
  autoFocus: false,
  children: undefined
};

InputField.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string,
  isRequired: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string.isRequired,
  action: PropTypes.node,
  errorMessage: PropTypes.string,
  autoFocus: PropTypes.bool,
  children: PropTypes.node
};

export default InputField;
