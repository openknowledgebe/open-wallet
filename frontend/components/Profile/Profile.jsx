import React from 'react';
import General from './General';
import Address from './Address';
import BankDetails from './BankDetails';
import Password from './Password';
import { userType } from '../../types';

const Profile = ({ user }) => {
  const { address, bankDetails } = user;

  return (
    <>
      <General name={user.name} email={user.email} />
      <Address address={address} />
      <BankDetails bankDetails={bankDetails} />
      <Password />
    </>
  );
};

Profile.propTypes = {
  user: userType.isRequired
};

export default Profile;
