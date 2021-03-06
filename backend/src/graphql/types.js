const { gql } = require('apollo-server-express');

module.exports = gql`
  directive @guest on FIELD_DEFINITION
  directive @auth on FIELD_DEFINITION

  # types
  type Query {
    users: [User]! @auth
    me: User @auth
    myExpenses: [Transaction]! @auth
    transactions: [Transaction]! @auth
  }

  type Mutation {
    register(user: UserInput!): User! @guest
    logout: Boolean!
    login(email: String!, password: String!): User! @guest
    expenseClaim(expense: Expense!): Transaction! @auth
    updateProfile(user: UserUpdateInput!): User! @auth
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

  type BankDetails {
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
    flow: Flow!
    state: State!
    user: User!
    amount: Float!
    date: String!
    expDate: String
    description: String
    file: String
    VAT: Int
    type: TransactionType!
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
    expDate: String
    description: String!
    receipt: Upload!
    VAT: Int
  }

  #enums
  enum Flow {
    IN
    OUT
  }

  enum State {
    UNCLEARED
    CLEARED
    PAID
    REJECTED
  }

  enum TransactionType {
    INVOICE
    EXPENSE
  }
`;
