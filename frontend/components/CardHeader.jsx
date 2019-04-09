import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Icon, Divider } from '@blueprintjs/core';
import PropTypes from 'prop-types';

const Header = styled.header`
  display: flex;
  justify-content: space-around;
  margin-bottom: -10px;
  a {
    align-self: center;
  }
`;

const CardHeader = ({ backLink, title }) => {
  return (
    <div>
      <Header>
        {backLink && (
          <Link href={backLink}>
            <a>
              <h4>
                <Icon icon="chevron-left" /> Home
              </h4>
            </a>
          </Link>
        )}
        <h1>{title}</h1>
      </Header>
      <Divider style={{ marginBottom: '15px' }} />
    </div>
  );
};

CardHeader.propTypes = {
  backLink: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default CardHeader;
