/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Button, Header, Modal } from 'semantic-ui-react';

import Router from 'next/router';
import PropTypes from 'prop-types';

const FloatingButton = styled.div`
  right: 0;
  position: fixed;
  top: 10px;
  button {
    z-index: 4;
    opacity: 0.7;
    animation: shadow-pulse 1s infinite;
  }

  @keyframes shadow-pulse {
    0% {
      box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
    }
    100% {
      box-shadow: 0 0 0 15px rgba(0, 0, 0, 0);
    }
  }
`;

const InnerDialog = styled.div`
  margin: 0 auto;
  padding: 0 0 10px 0;
  text-align: center;
  font-weight: bold;
  font-size: 2.4rem;
`;

const MyAccount = ({ isAuthenticated }) => {
  const [isOpen, setDialogStatus] = useState(false);
  const toggleDialog = () => {
    if (isAuthenticated) {
      Router.push('/profile');
      return;
    }
    setDialogStatus(!isOpen);
  };

  return (
    <div>
      <FloatingButton>
        <Button size="huge" color="olive" circular onClick={toggleDialog}>
          My Account
        </Button>
      </FloatingButton>
      <Modal dimmer="blurring" size="small" open={isOpen} onClose={toggleDialog} closeIcon>
        <Header size="huge" icon="warning circle" content="You are not authenticated" />
        <Modal.Content>
          <InnerDialog>
            <Link href="/login">
              <a onClick={() => setDialogStatus(!isOpen)}>Login</a>
            </Link>
            <br />
            or
            <br />
            <Link href="/register">
              <a onClick={() => setDialogStatus(!isOpen)}>Register</a>
            </Link>
            <br />
          </InnerDialog>
        </Modal.Content>
      </Modal>
    </div>
  );
};

MyAccount.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

export default MyAccount;
