import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Inner = styled.div`
  margin: 0 auto;
  width: 1200px;
`;

const Page = ({ children }) => {
  return <Inner>{children}</Inner>;
};

Page.propTypes = {
  children: PropTypes.node.isRequired
};

export default Page;
