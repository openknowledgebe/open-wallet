import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CardFooter = ({ children }) => {
  return (
    <Card.Content as="footer">
      <Footer>{children}</Footer>
    </Card.Content>
  );
};

CardFooter.propTypes = {
  children: PropTypes.node.isRequired
};

export default CardFooter;
