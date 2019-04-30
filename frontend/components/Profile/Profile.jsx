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
    <Grid stackable columns={2}>
      <Grid.Column>
        <General name={user.name} email={user.email} />
      </Grid.Column>
      <Grid.Column>
        <Address address={address} />
      </Grid.Column>
      <Grid.Column>
        <BankDetails bankDetails={bankDetails} />
      </Grid.Column>
      <Grid.Column>
        <Password />
      </Grid.Column>
    </Grid>
  );
};

Profile.propTypes = {
  user: userType.isRequired
};

export default Profile;
