const { gql } = require("apollo-server");

module.exports = gql`
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
    firstName: String!
    lastName: String!
    password: String
    email: String!
    bankDetails: BankDetails
    address: Address
  }
`;
