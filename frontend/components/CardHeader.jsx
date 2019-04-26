import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Card, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const Content = styled.div`
  display: flex;
  a {
    margin-right: 30px;
    align-self: center;
  }
`;

const CardHeader = ({ backLink, title }) => {
  return (
    <Card.Content as="header">
      <Content>
        {backLink && (
          <Link href={backLink}>
            <a>
              <h4>
                <Icon name="chevron circle left" /> Home
              </h4>
            </a>
          </Link>
        )}
        <h1>{title}</h1>
      </Content>
    </Card.Content>
  );
};

CardHeader.propTypes = {
  backLink: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default CardHeader;
