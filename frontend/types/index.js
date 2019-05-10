import { string, number, shape } from 'prop-types';

export const bankDetailsType = shape({
  bic: string,
  iban: string
});

export const addressType = shape({
  city: string,
  country: string,
  zipCode: number,
  street: string
});

export const userType = shape({
  name: string,
  email: string,
  bankDetails: bankDetailsType,
  address: addressType
});

export const companyType = shape({
  name: string,
  bankDetails: bankDetailsType,
  address: addressType,
  VAT: string
});
