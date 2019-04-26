import React from 'react';
import Link from 'next/link';
import { Card } from 'semantic-ui-react';
import CenteredCard from '../components/CenteredCard';
import Login from '../components/Login';
import redirect from '../lib/redirect';
import checkLoggedIn from '../lib/checkLoggedIn';
import CardFooter from '../components/CardFooter';
import CardHeader from '../components/CardHeader';

const LoginPage = () => {
  return (
    <CenteredCard>
      <CardHeader backLink="/" title="Login" />
      <Card.Content>
        <Login />
      </Card.Content>
      <CardFooter>
        <Link href="/register">
          <a>No account yet?</a>
        </Link>
        <Link href="/">
          <a>Password forgotten?</a>
        </Link>
      </CardFooter>
    </CenteredCard>
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
