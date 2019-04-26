import React from 'react';
// import styled from 'styled-components';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Container, Menu, Sticky, Icon } from 'semantic-ui-react';

const Page = ({ children }) => {
  return (
    <Container fluid>
      <Sticky style={{ marginBottom: '10px' }}>
        <Menu style={{ fontSize: 'inherit', marginRight: 0 }} inverted>
          <Link href="/" passHref>
            <Menu.Item as="a">
              <Icon name="chevron left chevron" />
              Overview
            </Menu.Item>
          </Link>
          <Container>
            <Menu.Item as="h1" style={{ fontSize: '2rem' }}>
              Open Wallet
            </Menu.Item>
            <Link href="/dashboard" passHref>
              <Menu.Item as="a">Dashboard</Menu.Item>
            </Link>
            <Menu.Item as="a">Expenses</Menu.Item>
            <Menu.Menu position="right">
              <Link passHref href="/profile">
                <Menu.Item as="a">Profile</Menu.Item>
              </Link>
              <Menu.Item as="a">Logout</Menu.Item>
            </Menu.Menu>
          </Container>

          <Menu.Item>
            <a
              href="https://github.com/openknowledgebe/open-wallet"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="github" inverted />
            </a>
          </Menu.Item>
        </Menu>
      </Sticky>
      <Container>{children}</Container>
    </Container>
  );
};

Page.propTypes = {
  children: PropTypes.node.isRequired
};

export default Page;
