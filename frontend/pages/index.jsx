import React from 'react';
import PropTypes from 'prop-types';
import Landing from '../components/Landing';
import MyAccount from '../components/MyAccount';
import checkLoggedIn from '../lib/checkLoggedIn';

function Home(props) {
  const { isAuthenticated } = props;
  return (
    <>
      <Landing />
      <MyAccount isAuthenticated={isAuthenticated} />
    </>
  );
}

Home.getInitialProps = async ({ apolloClient }) => {
  // TODO fix when logout will be implemented
  const { loggedInUser } = await checkLoggedIn(apolloClient);

  if (loggedInUser.me) return { isAuthenticated: true };

  return { isAuthenticated: false };
};

Home.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};
export default Home;
