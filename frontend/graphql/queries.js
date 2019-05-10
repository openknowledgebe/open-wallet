import gql from 'graphql-tag';

export const UPDATE_ME = gql`
  mutation UPDATE_PROFILE($user: UserUpdateInput!) {
    updateProfile(user: $user) {
      id
      name
    }
  }
`;

export const QUERY_ME = gql`
  query ME {
    me {
      name
      email
      bankDetails {
        iban
        bic
      }
      address {
        street
        city
        country
        zipCode
      }
    }
  }
`;

export const QUERY_COMPANIES = gql`
  query COMPANIES {
    companies {
      name
      VAT
      bankDetails {
        iban
        bic
      }
      address {
        street
        city
        country
        zipCode
      }
    }
  }
`;

export const LOG_ME_IN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      name
    }
  }
`;

export const REGISTER_ME = gql`
  mutation REGISTER($user: UserInput!) {
    register(user: $user) {
      id
      name
    }
  }
`;

export const EXPENSE_CLAIM = gql`
  mutation($expense: Expense!) {
    expenseClaim(expense: $expense) {
      id
      user {
        id
        name
      }
    }
  }
`;

export const INVOICE_UPLOAD = gql`
  mutation($invoice: InvoiceUpload!) {
    uploadInvoice(invoice: $invoice) {
      id
    }
  }
`;

export const LOG_ME_OUT = gql`
  mutation {
    logout
  }
`;
