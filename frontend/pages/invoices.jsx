import React from 'react';
import Page from '../components/Page';
import redirect from '../lib/redirect';
import checkLoggedIn from '../lib/checkLoggedIn';

const InvoicesPage = () => {
  return <Page>This is the invoices page</Page>;
};

InvoicesPage.getInitialProps = async context => {
  const { loggedInUser } = await checkLoggedIn(context.apolloClient);
  if (!loggedInUser.me) {
    redirect(context, '/login');
  }

  return {};
};

export default InvoicesPage;
