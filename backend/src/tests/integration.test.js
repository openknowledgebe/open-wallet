const { createTestClient } = require('apollo-server-testing');
const FormData = require('form-data');
const fetch = require('node-fetch');
const fs = require('fs');
const { auth } = require('./mocks/index');
const { db, models, cloudinary, validation } = require('../');
const { constructTestServer, startTestServer, populate, clean } = require('./utils');

const {
  LOGIN_ME_IN,
  GET_ME,
  REGISTER,
  ALL_USERS,
  EXPENSE_CLAIM_WITHOUT_GQL,
  UPDATE_PROFILE
} = require('./graphql/queryStrings');

const testUser = { user: { name: 'Test Test', email: 'test@email.com', password: 'testing0189' } };
const bankDetails = { iban: 'MY IBAN', bic: 'MY BIC' };
const address = { street: 'My street', city: 'My city', zipCode: 1000, country: 'My country' };

describe('Authenticated user', () => {
  let loggedUser;
  beforeAll(async () => {
    await db.connect();
    await populate();
    loggedUser = await models.User.findByEmail('john.doe@john.com');
  });

  afterAll(async () => {
    await clean();
    await db.disconnect();
  });

  describe('requires being logout', () => {
    let server;
    beforeAll(() => {
      server = constructTestServer({
        context: () => {
          return { models, user: loggedUser, auth };
        }
      });
    });
    it('to login', async () => {
      const { mutate } = createTestClient(server);
      const res = await mutate({
        mutation: LOGIN_ME_IN,
        variables: { email: 'john.doe@john.com', password: "doesn't matter" }
      });
      expect(res).toMatchSnapshot();
    });
    it('to register', async () => {
      const { mutate } = createTestClient(server);
      const res = await mutate({
        mutation: REGISTER,
        variables: testUser
      });
      expect(res).toMatchSnapshot();
    });
  });

  describe('GET_ME', () => {
    let server;
    beforeAll(() => {
      server = constructTestServer({
        context: () => {
          return { models, user: loggedUser, auth };
        }
      });
    });

    it('matches logged user', async () => {
      const { query } = createTestClient(server);
      const res = await query({
        query: GET_ME
      });
      expect(res.data.me).toEqual({ name: loggedUser.name, email: loggedUser.email });
    });
  });

  it('gets all users', async () => {
    const server = constructTestServer({
      context: () => {
        return { models, user: loggedUser, auth };
      }
    });

    const { query } = createTestClient(server);
    const res = await query({
      query: ALL_USERS
    });

    expect(res.data.users.length).toBeGreaterThanOrEqual(3);
  });

  describe('update profile', () => {
    let server;
    let user;
    beforeAll(async () => {
      // authenticate another user to avoid crash in other tests
      user = await models.User.findByEmail('mitchell@gmail.com');
      server = constructTestServer({
        context: () => {
          return { models, user, auth, db, validation };
        }
      });
    });

    it('updates address without overwriting others fields', async () => {
      const { mutate } = createTestClient(server);
      const res = await mutate({
        mutation: UPDATE_PROFILE,
        variables: { user: { address } }
      });
      expect(res.data.updateProfile.address).toEqual(address);
      expect(res.data.updateProfile.email).toBeTruthy();
    });

    it('updates bank details without overwriting others fields', async () => {
      const { mutate } = createTestClient(server);
      const res = await mutate({
        mutation: UPDATE_PROFILE,
        variables: { user: { bankDetails } }
      });
      expect(res.data.updateProfile.bankDetails).toEqual(bankDetails);
      expect(res.data.updateProfile.address).toEqual(address);
    });

    it('updates email without overwritting others fields', async () => {
      const { mutate } = createTestClient(server);
      const res = await mutate({
        mutation: UPDATE_PROFILE,
        variables: { user: { email: 'johnny@john.com' } }
      });
      expect(res.data.updateProfile.email).toEqual('johnny@john.com');
      expect(res.data.updateProfile.address).toEqual(address);
    });

    it('fails if email already exists', async () => {
      const { mutate } = createTestClient(server);
      const res = await mutate({
        mutation: UPDATE_PROFILE,
        variables: { user: { email: 'johnny@john.com' } }
      });
      expect(res.errors).toBeTruthy();
    });

    it('updates name without overwritting others fields', async () => {
      const { mutate } = createTestClient(server);
      const res = await mutate({
        mutation: UPDATE_PROFILE,
        variables: { user: { name: 'Johnny John' } }
      });
      expect(res.data.updateProfile.name).toEqual('Johnny John');
      expect(res.data.updateProfile.address).toEqual(address);
    });

    it('can update all the fields at once', async () => {
      const addr = {
        street: 'Next street',
        city: 'Next city',
        zipCode: 1001,
        country: 'Next Country'
      };
      const bd = { iban: 'BE098483992', bic: 'BPTOZE223' };
      const { mutate } = createTestClient(server);
      const res = await mutate({
        mutation: UPDATE_PROFILE,
        variables: {
          user: {
            email: user.email,
            name: user.name,
            password: 'testing343',
            address: addr,
            bankDetails: bd
          }
        }
      });
      expect(res.data.updateProfile.name).toEqual(user.name);
      expect(res.data.updateProfile.email).toEqual(user.email);
      expect(res.data.updateProfile.address).toEqual(addr);
      expect(res.data.updateProfile.bankDetails).toEqual(bd);
    });
  });

  describe('claims expenses', () => {
    let uri;
    let server;
    let stop;
    beforeAll(() => {
      server = constructTestServer({
        context: () => {
          return { models, user: loggedUser, auth, cloudinary, db, validation };
        }
      });
    });

    beforeEach(async () => {
      const testServer = await startTestServer(server);
      // eslint-disable-next-line prefer-destructuring
      stop = testServer.stop;
      // eslint-disable-next-line prefer-destructuring
      uri = testServer.uri;
    });

    afterEach(async () => {
      stop();
    });

    it('succeeds', async () => {
      // https://github.com/jaydenseric/graphql-upload/issues/125

      const body = new FormData();

      body.append(
        'operations',
        JSON.stringify({
          query: EXPENSE_CLAIM_WITHOUT_GQL,
          variables: {
            amount: 10,
            description: 'Hello World!',
            receipt: null
          }
        })
      );
      body.append('map', JSON.stringify({ '0': ['variables.receipt'] }));

      // use after mocking cloudinary
      // body.append('0', 'a', { filename: 'a.pdf' });

      const file = fs.createReadStream(`${__dirname}/a.pdf`);
      body.append('0', file);

      let res = await fetch(uri, { method: 'POST', body });
      res = await res.json();
      expect(res.data.expenseClaim.user.expenses.includes(res.data.expenseClaim.id)).toBeTruthy();
      delete res.data.expenseClaim.id;
      delete res.data.expenseClaim.user.expenses;
      expect(res).toMatchSnapshot();
    });
  });
});
