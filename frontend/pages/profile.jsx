import React from 'react';
import Profile from '../components/Profile';
import Page from '../components/Page';
import redirect from '../lib/redirect';
import checkLoggedIn from '../lib/checkLoggedIn';

const ProfilePage = () => {
  return (
    <Page>
      <Profile />
    </Page>
  );
};

ProfilePage.getInitialProps = async context => {
  const { loggedInUser } = await checkLoggedIn(context.apolloClient);
  if (!loggedInUser.me) {
    // Already logged in? No need to continue.
    // Throw them back to the main page
    redirect(context, '/login');
  }

  return {};
};

export default ProfilePage;
