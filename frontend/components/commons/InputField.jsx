import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, InputGroup } from '@blueprintjs/core';

const InputField = ({
  label,
  name,
  id,
  type,
  isRequired,
  placeHolder,
  description,
  disabled,
  value,
  handler,
  rightElement
}) => {
  return (
    <FormGroup large label={label} labelFor={id} disabled={disabled} helperText={description}>
      <InputGroup
        type={type}
        large
        id={id}
        placeholder={placeHolder}
        onChange={handler}
        value={value}
        disabled={disabled}
        required={isRequired}
        name={name}
        rightElement={rightElement}
      />
    </FormGroup>
  );
};

InputField.defaultProps = {
  type: 'text',
  disabled: false,
  isRequired: false,
  description: '',
  placeHolder: '',
  value: '',
  rightElement: null
};

InputField.propTypes = {
  value: PropTypes.string,
  type: PropTypes.string,
  isRequired: PropTypes.bool,
  description: PropTypes.string,
  handler: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeHolder: PropTypes.string,
  label: PropTypes.string.isRequired,
  rightElement: PropTypes.node
};

export default InputField;
