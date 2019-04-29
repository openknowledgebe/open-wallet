import React from 'react';
import { Grid } from 'semantic-ui-react';
import General from './General';
import Address from './Address';
import BankDetails from './BankDetails';
import Password from './Password';
import { userType } from '../../types';

const Profile = ({ user }) => {
  const { address, bankDetails } = user;

  return (
    <Grid padded>
      <Grid.Column mobile={16} tablet={8} computer={8} largeScreen={8}>
        <General name={user.name} email={user.email} />
      </Grid.Column>
      <Grid.Column mobile={16} tablet={8} computer={8} largeScreen={8}>
        <Address address={address} />
      </Grid.Column>
      <Grid.Column mobile={16} tablet={8} computer={8} largeScreen={8}>
        <BankDetails bankDetails={bankDetails} />
      </Grid.Column>
      <Grid.Column mobile={16} tablet={8} computer={8} largeScreen={8}>
        <Password />
      </Grid.Column>
    </Grid>
  );
};

Profile.propTypes = {
  user: userType.isRequired
};

export default Profile;
