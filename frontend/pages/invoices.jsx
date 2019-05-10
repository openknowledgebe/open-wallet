import React from 'react';
import Page from '../components/Page';
import redirect from '../lib/redirect';
import checkLoggedIn from '../lib/checkLoggedIn';
import InvoiceUploadForm from '../components/InvoiceUploadForm';
import InvoiceCreationForm from '../components/InvoiceCreationForm';

const InvoicesPage = () => {
  return (
    <Page>
      <InvoiceUploadForm />
      <InvoiceCreationForm />
    </Page>
  );
};

InvoicesPage.getInitialProps = async context => {
  const { loggedInUser } = await checkLoggedIn(context.apolloClient);
  if (!loggedInUser.me) {
    redirect(context, '/login');
  }

  return {};
};

export default InvoicesPage;
