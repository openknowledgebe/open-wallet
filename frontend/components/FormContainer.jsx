import React from 'react';
import PropTypes from 'prop-types';
import { Card, Elevation } from '@blueprintjs/core';

const FormContainer = ({ children, ...rest }) => {
  return (
    <Card elevation={Elevation.TWO} {...rest}>
      {children}
    </Card>
  );
};

FormContainer.propTypes = {
  children: PropTypes.node.isRequired
};

export default FormContainer;
