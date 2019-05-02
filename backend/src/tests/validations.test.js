const { registerValidation, validate } = require('../lib/validation');

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
      const err = JSON.parse(error.message);
      expect(err[0].email).toBeTruthy();
      expect(err[1].email).toBeTruthy();
      expect(err[2].name).toBeTruthy();
      expect(err[3].password).toBeTruthy();
    }
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
      const err = JSON.parse(error.message);
      expect(err[0]['bankDetails.bic']).toBeTruthy();
    }
    try {
      await validate({ ...data, bankDetails: { bic: 'MY BIC' } }, rules, messages);
      expect(false).toBe(true);
    } catch (error) {
      const err = JSON.parse(error.message);
      expect(err[0]['bankDetails.iban']).toBeTruthy();
    }
  });

  it('throws if any of address fields are missing while one of them is present', async () => {
    // street is present
    try {
      await validate({ ...user, address: { street: 'My street' } }, rules, messages);
      expect(false).toBe(true);
    } catch (error) {
      const err = JSON.parse(error.message);
      expect(err).toHaveLength(2);
    }
    // city is present
    try {
      await validate({ ...user, address: { city: 'My city' } }, rules, messages);
      expect(false).toBe(true);
    } catch (error) {
      const err = JSON.parse(error.message);
      expect(err).toHaveLength(2);
    }
    // zipCode is present
    try {
      await validate({ ...user, address: { zipCode: 1000 } }, rules, messages);
      expect(false).toBe(true);
    } catch (error) {
      const err = JSON.parse(error.message);
      expect(err).toHaveLength(3);
    }
    // country is present
    try {
      await validate({ ...user, address: { country: 'My country' } }, rules, messages);
      expect(false).toBe(true);
    } catch (error) {
      const err = JSON.parse(error.message);
      expect(err).toHaveLength(2);
    }
  });
});
describe('UPDATE PROFILE VALIDATION', () => {});
describe('UPLOAD INVOICE VALIDATION', () => {});
