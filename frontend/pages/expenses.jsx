import React from 'react';
import ExpenseForm from '../components/ExpenseForm';
import Page from '../components/Page';
import redirect from '../lib/redirect';
import checkLoggedIn from '../lib/checkLoggedIn';

const ExpensesPage = () => {
  return (
    <Page>
      <ExpenseForm />
    </Page>
  );
};

ExpensesPage.getInitialProps = async context => {
  const { loggedInUser } = await checkLoggedIn(context.apolloClient);
  if (!loggedInUser.me) {
    redirect(context, '/login');
  }

  return {};
};

export default ExpensesPage;
