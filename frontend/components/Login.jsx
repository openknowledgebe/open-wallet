import React from 'react';
import { FormGroup, InputGroup, Button, Intent } from '@blueprintjs/core';

const Login = () => {
  return (
    <form method="post">
      <FormGroup label="Email" labelFor="email">
        <InputGroup large type="email" id="email" placeholder="Your email address" />
      </FormGroup>
      <FormGroup label="Password" labelFor="password">
        <InputGroup large type="password" id="password" placeholder="Your password" />
      </FormGroup>
      <Button large type="submit" intent={Intent.PRIMARY}>
        Sign in
      </Button>
    </form>
  );
};

export default Login;
