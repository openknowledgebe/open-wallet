import React from 'react';
import Link from 'next/link';
import { Card } from 'semantic-ui-react';
import CenteredCard from '../components/CenteredCard';
import Register from '../components/Register';
import redirect from '../lib/redirect';
import checkLoggedIn from '../lib/checkLoggedIn';
import CardFooter from '../components/CardFooter';
import CardHeader from '../components/CardHeader';

const RegisterPage = () => {
  return (
    <CenteredCard>
      <CardHeader backLink="/" title="Register" />
      <Card.Content>
        <Register />
      </Card.Content>
      <CardFooter>
        <Link href="/login">
          <a>Already registerd?</a>
        </Link>
      </CardFooter>
    </CenteredCard>
  );
};

RegisterPage.getInitialProps = async context => {
  const { loggedInUser } = await checkLoggedIn(context.apolloClient);

  if (loggedInUser.me) {
    // Already logged in? No need to continue.
    // Throw them back to the main page
    redirect(context, '/profile');
  }

  return {};
};

export default RegisterPage;
