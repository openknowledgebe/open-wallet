const { gql } = require('apollo-server-express');

module.exports = gql`
  directive @guest on FIELD_DEFINITION
  directive @auth on FIELD_DEFINITION

  # types
  type Query {
    "Returns all the users - inaccessible for unauthenticated users"
    users: [User]! @auth #TODO restrict access
    "Returns the authenticated user profile"
    me: User @auth
    "Returns the authenticated user expenses"
    myExpenses: [Transaction]! @auth
    "Returns all transactions - inaccessible for unauthenticated users"
    transactions: [Transaction]! @auth #TODO restrict access
    "Returns all companies - inaccessible for unauthenticated users"
    companies: [Company] @auth
  }

  type Mutation {
    "Registers a user"
    register(user: UserInput!): User! @guest
    logout: Boolean!
    login(email: String!, password: String!): User! @guest
    "Handles expense claims - inaccessible for unauthenticated users"
    expenseClaim(expense: Expense!): Transaction! @auth
    "Handles profile updates - inaccessible for unauthenticated users"
    updateProfile(user: UserUpdateInput!): User! @auth
    "Handles invoice uploads - inaccessible for unauthenticated users"
    uploadInvoice(invoice: InvoiceUpload!): Transaction! @auth #TODO restrict access
    "Handles invoice generations - inaccessible for unauthenticated users"
    generateInvoice(invoice: GenerateInvoiceInput!): Transaction! @auth #TODO restrict access
  }
  type Success {
    status: Boolean!
  }
  type Address {
    street: String!
    city: String!
    country: String!
    zipCode: Int!
  }

  type BankDetails { # need attention
    iban: String!
    bic: String
  }

  type User {
    id: ID!
    name: String!
    email: String!
    bankDetails: BankDetails
    address: Address
    expenses: [String]
  }

  type Transaction {
    id: ID!
    category: Category
    company: Company
    flow: Flow!
    state: State!
    user: User!
    amount: Float!
    date: String!
    expDate: String
    description: String
    file: String
    "VAT rate"
    VAT: Int
    type: TransactionType!
    ref: String
  }

  type Category {
    id: ID!
    name: String!
  }

  type Company {
    name: String!
    email: String
    phone: String
    "VAT number"
    VAT: String
    bankDetails: BankDetails
    address: Address
  }

  #inputs
  input AdressInput {
    street: String!
    city: String!
    country: String!
    zipCode: Int!
  }

  input BankDetailsInput {
    iban: String!
    bic: String
  }

  input UserInput {
    name: String!
    password: String!
    email: String!
    bankDetails: BankDetailsInput
    address: AdressInput
  }

  input UserUpdateInput {
    name: String
    password: String
    email: String
    bankDetails: BankDetailsInput
    address: AdressInput
  }

  input Expense {
    amount: Float!
    date: String
    description: String!
    receipt: Upload!
    "VAT rate"
    VAT: Int
  }

  input InvoiceUpload {
    amount: Float!
    date: String
    category: String
    company: CompanyInput
    expDate: String
    invoice: Upload!
    "VAT rate"
    VAT: Int
  }

  input CompanyInput {
    id: ID
    name: String
    email: String
    phone: String
    VAT: String
    bankDetails: BankDetailsInput
    address: AdressInput
  }

  input GenerateInvoiceInput {
    company: CompanyInput!
    details: [GenerateInvoiceDetailsInput!]!
    # add category
    "VAT rate"
    VAT: Int!
  }

  input GenerateInvoiceDetailsInput {
    description: String!
    amount: Float!
  }

  #enums

  "Transaction flow"
  enum Flow {
    "Incoming transaction"
    IN
    "Outgoing transaction"
    OUT
  }

  "Transaction state"
  enum State {
    "An unreviewed transaction"
    UNCLEARED
    "An accepted transaction"
    CLEARED
    PAID
    REJECTED
  }

  enum TransactionType {
    INVOICE
    EXPENSE
  }
`;
