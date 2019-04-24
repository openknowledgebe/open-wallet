import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Card, Elevation } from '@blueprintjs/core';

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CenteredCard = ({ children, ...rest }) => {
  return (
    <Center>
      <Card elevation={Elevation.TWO} {...rest}>
        {children}
      </Card>
    </Center>
  );
};

CenteredCard.propTypes = {
  children: PropTypes.node.isRequired
};

export default CenteredCard;
