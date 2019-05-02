const { UserInputError } = require('apollo-server-express');
const {
  validation: { registerValidation, updateProfileValidation, expenseValidation, validate }
} = require('../');

const FIFTYONECHARSSTR = 'QYE5TOXWrDbi0bSQDbM1KmKOljjR5SihgUJO7aDwkkjUJVJOzk6';

/**
 * Test of input validation module
 *
 * Notes:
 * 1. GraphQL will detect undefined values and reject them
 * 2. GraphQL won't allow null for Numbers (Int/Float)
 * 3. GraphQL allows null value for strings
 * 4. GraphQL will make sure required fields have values (but allows empty string)
 */

describe('EXPENSE CLAIM VALIDATION', () => {
  const { messages, rules } = expenseValidation;
  const expense = {
    VAT: 21,
    amount: 10,
    date: Date.now(),
    description: 'Hello World!'
  };

  it('will pass validation (minimum required fields)', async () => {
    await validate({ description: expense.description, amount: expense.amount }, rules, messages);
  });

  it('will pass validation (all required fields)', async () => {
    await validate(expense, rules, messages);
  });

  it('fails if description not set', async () => {
    try {
      // {} is equivalent to description = null
      await validate({}, rules, messages);
      expect(false).toBe(true);
    } catch (error) {
      if (error instanceof UserInputError) {
        const err = JSON.parse(error.message);
        expect(err[0].description).toBeTruthy();
      } else throw error;
    }
    try {
      await validate({ description: undefined }, rules, messages);
      expect(false).toBe(true);
    } catch (error) {
      if (error instanceof UserInputError) {
        const err = JSON.parse(error.message);
        expect(err[0].description).toBeTruthy();
      } else throw error;
    }
    try {
      await validate({ description: '' }, rules, messages);
      expect(false).toBe(true);
    } catch (error) {
      if (error instanceof UserInputError) {
        const err = JSON.parse(error.message);
        expect(err[0].description).toBeTruthy();
      } else throw error;
    }
  });

  it('fails on max length exceeded', async () => {
    try {
      await validate({ description: FIFTYONECHARSSTR }, rules, messages);
      expect(false).toBe(true);
    } catch (error) {
      if (error instanceof UserInputError) {
        const err = JSON.parse(error.message);
        expect(err[0].description).toBeTruthy();
      } else throw error;
    }
  });

  it('fails on max length exceeded', async () => {
    try {
      await validate({ description: FIFTYONECHARSSTR }, rules, messages);
      expect(false).toBe(true);
    } catch (error) {
      if (error instanceof UserInputError) {
        const err = JSON.parse(error.message);
        expect(err[0].description).toBeTruthy();
      } else throw error;
    }
  });

  it('fails on invalid date', async () => {
    try {
      await validate({ description: expense.description, date: 'fefle' }, rules, messages);
      expect(false).toBe(true);
    } catch (error) {
      if (error instanceof UserInputError) {
        const err = JSON.parse(error.message);
        expect(err[0].date).toBeTruthy();
      } else throw error;
    }
  });
});
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
describe('UPDATE PROFILE VALIDATION', () => {
  // most cases have been tested in REGISTER VALIDATION
  const { formatData, messages, rules } = updateProfileValidation;
  it('does not require any field', async () => {
    await validate(formatData({}), rules, messages);
  });

  it('throws on empty string', async () => {
    try {
      await validate(formatData({ email: '', name: '', password: '' }), rules, messages);
      expect(false).toBe(true);
    } catch (error) {
      if (error instanceof UserInputError) {
        const err = JSON.parse(error.message);
        expect(err).toHaveLength(3);
      } else throw error;
    }
  });

  it('throws on null value', async () => {
    try {
      await validate(formatData({ email: null, name: null, password: null }), rules, messages);
      expect(false).toBe(true);
    } catch (error) {
      if (error instanceof UserInputError) {
        const err = JSON.parse(error.message);
        expect(err).toHaveLength(3);
      } else throw error;
    }
  });
});
describe('UPLOAD INVOICE VALIDATION', () => {});
