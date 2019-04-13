import React from 'react';
// import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';

// const Inner = styled.div`
//   margin: 0 auto;
//   width: 1200px;
// `;

const Page = ({ children }) => {
  return <Container>{children}</Container>;
};

Page.propTypes = {
  children: PropTypes.node.isRequired
};

export default Page;
