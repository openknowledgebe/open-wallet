import React from 'react';
import FormContainer from '../FormContainer';
import General from './General';
import Address from './Address';
import BankDetails from './BankDetails';
import Password from './Password';
import { userType } from '../../types';

const Profile = ({ user }) => {
  const { address, bankDetails } = user;

  return (
    <FormContainer>
      <General name={user.name} email={user.email} />
      <br />
      <Address address={address} />
      <br />
      <BankDetails bankDetails={bankDetails} />
      <br />
      <br />
      <Password />
    </FormContainer>
  );
};

Profile.propTypes = {
  user: userType.isRequired
};

export default Profile;
