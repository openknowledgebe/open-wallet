const { UserInputError } = require('apollo-server-express');
const {
  validation: { registerValidation, validate }
} = require('../');

const FIFTYONECHARSSTR = 'QYE5TOXWrDbi0bSQDbM1KmKOljjR5SihgUJO7aDwkkjUJVJOzk6';

describe('EXPENSE CLAIM VALIDATION', () => {});
describe('REGISTER VALIDATION', () => {
  const { rules, messages } = registerValidation;
  const user = {
    email: 'test@mail.com',
    name: 'Test Test',
    password: 'azerty1234',
    address: {
      street: 'My Street 31',
      city: 'My City',
      country: 'My Country',
      zipCode: 1000
    },
    bankDetails: {
      iban: 'MY IBAN',
      bic: 'MY BIC'
    }
  };
  it("doesn't throw (minimal config)", async () => {
    const data = {
      email: user.email,
      name: user.name,
      password: user.password
    };

    await validate(data, rules, messages);
  });

  it("doesn't throw (with address)", async () => {
    const data = {
      ...user,
      bankDetails: {}
    };
    await validate(data, rules, messages);
  });

  it("doesn't throw (with bankDetails)", async () => {
    const data = {
      ...user,
      address: {}
    };
    await validate(data, rules, messages);
  });

  it("doesn't throw (full config)", async () => {
    const data = user;
    await validate(data, rules, messages);
  });

  it('throws on missing required field', async () => {
    const data = {};
    try {
      await validate(data, rules, messages);
      expect(false).toBe(true);
    } catch (error) {
      if (error instanceof UserInputError) {
        const err = JSON.parse(error.message);
        expect(err[0].email).toBeTruthy();
        expect(err[1].email).toBeTruthy();
        expect(err[2].name).toBeTruthy();
        expect(err[3].password).toBeTruthy();
      } else throw error;
    }
  });

  describe('throws if password is not matching requirements', () => {
    it('throws if password less than minimal characters', async () => {
      try {
        await validate({ ...user, password: '1234567' }, rules, messages);
        expect(false).toBe(true);
      } catch (error) {
        if (error instanceof UserInputError) expect(true).toBe(true);
        else throw error;
      }
    });
  });

  it('throws if one of bankDetails field is missing while the other is present', async () => {
    const data = {
      ...user,
      bankDetails: {
        iban: 'MY IBAN'
      }
    };
    try {
      await validate(data, rules, messages);
    } catch (error) {
      if (error instanceof UserInputError) {
        const err = JSON.parse(error.message);
        expect(err[0]['bankDetails.bic']).toBeTruthy();
      } else throw error;
    }
    try {
      await validate({ ...data, bankDetails: { bic: 'MY BIC' } }, rules, messages);
      expect(false).toBe(true);
    } catch (error) {
      if (error instanceof UserInputError) {
        const err = JSON.parse(error.message);
        expect(err[0]['bankDetails.iban']).toBeTruthy();
      } else throw error;
    }
  });

  it('throws if any of address fields are missing while one of them is present', async () => {
    // street is present
    try {
      await validate({ ...user, address: { street: 'My street' } }, rules, messages);
      expect(false).toBe(true);
    } catch (error) {
      if (error instanceof UserInputError) {
        const err = JSON.parse(error.message);
        expect(err).toHaveLength(2);
      } else throw error;
    }
    // city is present
    try {
      await validate({ ...user, address: { city: 'My city' } }, rules, messages);
      expect(false).toBe(true);
    } catch (error) {
      if (error instanceof UserInputError) {
        const err = JSON.parse(error.message);
        expect(err).toHaveLength(2);
      } else throw error;
    }
    // zipCode is present
    try {
      await validate({ ...user, address: { zipCode: 1000 } }, rules, messages);
      expect(false).toBe(true);
    } catch (error) {
      if (error instanceof UserInputError) {
        const err = JSON.parse(error.message);
        expect(err).toHaveLength(3);
      } else throw error;
    }
    // country is present
    try {
      await validate({ ...user, address: { country: 'My country' } }, rules, messages);
      expect(false).toBe(true);
    } catch (error) {
      if (error instanceof UserInputError) {
        const err = JSON.parse(error.message);
        expect(err).toHaveLength(2);
      } else throw error;
    }
  });

  it('throws when length over max', async () => {
    const data = {
      ...user,
      name: FIFTYONECHARSSTR,
      address: {
        city: FIFTYONECHARSSTR,
        country: FIFTYONECHARSSTR,
        street: FIFTYONECHARSSTR
      },
      bankDetails: {
        bic: FIFTYONECHARSSTR,
        iban: FIFTYONECHARSSTR
      }
    };
    try {
      await validate(data, rules, messages);
      expect(false).toBe(true);
    } catch (error) {
      if (error instanceof UserInputError) {
        const err = JSON.parse(error.message);
        expect(err).toHaveLength(6);
      } else throw error;
    }
  });
});
describe('UPDATE PROFILE VALIDATION', () => {});
describe('UPLOAD INVOICE VALIDATION', () => {});
