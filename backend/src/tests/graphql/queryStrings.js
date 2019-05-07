/* eslint-disable import/no-extraneous-dependencies */
const gql = require('graphql-tag');

module.exports.GET_ME = gql`
  query me {
    me {
      name
      email
    }
  }
`;

module.exports.LOGIN_ME_IN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      name
      email
    }
  }
`;

module.exports.REGISTER = gql`
  mutation register($user: UserInput!) {
    register(user: $user) {
      name
      email
      bankDetails {
        iban
        bic
      }
      address {
        street
        city
        zipCode
        country
      }
    }
  }
`;

module.exports.UPDATE_PROFILE = gql`
  mutation updateProfile($user: UserUpdateInput!) {
    updateProfile(user: $user) {
      name
      email
      bankDetails {
        iban
        bic
      }
      address {
        street
        city
        zipCode
        country
      }
    }
  }
`;

module.exports.ALL_USERS = gql`
  query users {
    users {
      name
      email
    }
  }
`;

module.exports.EXPENSE_CLAIM = gql`
  mutation($amount: Float!, $description: String!, $receipt: Upload!) {
    expenseClaim(expense: { amount: $amount, description: $description, receipt: $receipt }) {
      id
      type
      flow
      user {
        name
        email
        expenses
      }
    }
  }
`;

module.exports.EXPENSE_CLAIM_WITHOUT_GQL = `
  mutation($amount: Float!, $description: String!, $receipt: Upload!) {
    expenseClaim(expense: { amount: $amount, description: $description, receipt: $receipt }) {
      id
      type
      flow
      user {
        name
        email
        expenses
      }
    }
  }
`;

module.exports.INVOICE_UPLOAD_WITHOUT_GQL = `
  mutation($amount: Float!, $invoice: Upload!) {
    uploadInvoice(invoice: { amount: $amount, invoice: $invoice }) {
      id
      type
      flow
    }
  }
`;

module.exports.GENERATE_INVOICE = gql`
  mutation($invoice: GenerateInvoiceInput!) {
    generateInvoice(invoice: $invoice) {
      id
      type
      flow
      ref
    }
  }
`;
