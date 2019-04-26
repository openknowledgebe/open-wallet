import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';

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
  error,
  autoFocus
}) => {
  return (
    <Form.Input
      id={id}
      required={isRequired}
      label={label}
      placeholder={placeholder}
      name={name}
      type={type}
      disabled={disabled}
      value={value}
      onChange={onChange}
      error={error}
      autoFocus={autoFocus}
      action={action}
    />
  );
};

InputField.defaultProps = {
  type: 'text',
  disabled: false,
  isRequired: false,
  placeholder: '',
  value: '',
  action: undefined,
  error: false,
  autoFocus: false
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
  error: PropTypes.bool,
  autoFocus: PropTypes.bool
};

export default InputField;
