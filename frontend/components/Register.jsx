import React from 'react';
import { FormGroup, InputGroup, Button, Intent } from '@blueprintjs/core';

const Register = () => {
  return (
    <div>
      <h1>Sign up</h1>
      <form method="post">
        <FormGroup label="First name" labelFor="reg-firstname">
          <InputGroup large id="reg-firstname" placeholder="Your first name" />
        </FormGroup>
        <FormGroup label="Last name" labelFor="reg-lastname">
          <InputGroup large id="reg-lastname" placeholder="Your last name" />
        </FormGroup>
        <FormGroup label="Email" labelFor="reg-email">
          <InputGroup large type="email" id="reg-email" placeholder="Your email address" />
        </FormGroup>
        <FormGroup label="Password" labelFor="reg-password">
          <InputGroup large type="password" id="reg-password" placeholder="Your password" />
        </FormGroup>
        <FormGroup label="Password Repeat" labelFor="reg-password-repeat">
          <InputGroup
            large
            type="password"
            id="reg-password-repeat"
            placeholder="Your password a second time"
          />
        </FormGroup>
        <Button large type="submit" intent={Intent.PRIMARY}>
          Sign up
        </Button>
      </form>
    </div>
  );
};

export default Register;
