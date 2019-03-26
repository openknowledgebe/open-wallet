import React from 'react';
import { Card, Elevation } from '@blueprintjs/core';

const FormContainer = ({ children, ...rest }) => {
  return (
    <Card elevation={Elevation.TWO} {...rest}>
      {children}
    </Card>
  );
};

export default FormContainer;
