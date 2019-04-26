import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const CenteredCard = ({ children, ...rest }) => {
  return (
    <Center>
      <Card style={{ width: '400px' }} raised {...rest}>
        {children}
      </Card>
    </Center>
  );
};

CenteredCard.propTypes = {
  children: PropTypes.node.isRequired
};

export default CenteredCard;
