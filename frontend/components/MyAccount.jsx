import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Button, Intent, Dialog } from '@blueprintjs/core';
import Router from 'next/router';
import PropTypes from 'prop-types';

const FloatingButton = styled.div`
  float: right;
  margin-right: 130px;
  margin-top: 15px;
  button {
    position: fixed;
    top: 10px;
    z-index: -1;
    opacity: 0.7;
    border-radius: 15px;
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
  padding: 30px 0 10px 0;
  text-align: center;
  font-weight: bold;
  a {
    font-size: 24px;
  }
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
        <Button intent={Intent.SUCCESS} large onClick={toggleDialog}>
          My Account
        </Button>
      </FloatingButton>
      <Dialog
        icon="info-sign"
        title="You are not authenticated"
        isOpen={isOpen}
        onClose={toggleDialog}
        usePortal
        autoFocus
        canEscapeKeyClose
        canOutsideClickClose
        enforceFocus
      >
        <InnerDialog>
          <Link href="/login">
            <a>Login</a>
          </Link>
          <br />
          or
          <br />
          <Link href="/register">
            <a>Register</a>
          </Link>
          <br />
        </InnerDialog>
      </Dialog>
    </div>
  );
};

MyAccount.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

export default MyAccount;
