import React from 'react';
import styled from 'styled-components';
import { Divider } from '@blueprintjs/core';
import PropTypes from 'prop-types';

const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
`;

const CardFooter = ({ children }) => {
  return (
    <div style={{ marginTop: '15px' }}>
      <Divider style={{ marginBottom: '10px' }} />
      <Footer>{children}</Footer>
    </div>
  );
};

CardFooter.propTypes = {
  children: PropTypes.node.isRequired
};

export default CardFooter;
