import React from 'react';
import Link from 'next/link';
import Page from '../components/Page';
import CenteredCard from '../components/CenteredCard';
import Login from '../components/Login';
import redirect from '../lib/redirect';
import checkLoggedIn from '../lib/checkLoggedIn';
import CardFooter from '../components/CardFooter';
import CardHeader from '../components/CardHeader';

const LoginPage = () => {
  return (
    <Page>
      <CenteredCard>
        <CardHeader backLink="/" title="Login" />
        <Login />
        <CardFooter>
          <Link href="/register">
            <a>No account yet?</a>
          </Link>
          <Link href="/">
            <a>Password forgotten?</a>
          </Link>
        </CardFooter>
      </CenteredCard>
    </Page>
  );
};

LoginPage.getInitialProps = async context => {
  const { loggedInUser } = await checkLoggedIn(context.apolloClient);

  if (loggedInUser.me) {
    // Already logged in? No need to continue.
    // Throw them back to the main page
    redirect(context, '/profile');
  }
  return {};
};

export default LoginPage;
