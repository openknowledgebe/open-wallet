const { createTestClient } = require('apollo-server-testing');
const FormData = require('form-data');
const fetch = require('node-fetch');
const fs = require('fs');
const { auth } = require('./mocks/index');
const { db, models, cloudinary } = require('../');
const { constructTestServer, startTestServer, populate, clean } = require('./utils');

const {
  LOGIN_ME_IN,
  GET_ME,
  REGISTER,
  ALL_USERS,
  EXPENSE_CLAIM_WITHOUT_GQL
} = require('./graphql/queryStrings');

const testUser = { user: { name: 'Test Test', email: 'test@email.com', password: 'testing0189' } };

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

  describe('claims expenses', () => {
    let uri;
    let server;
    let stop;
    beforeAll(() => {
      server = constructTestServer({
        context: () => {
          return { models, user: loggedUser, auth, cloudinary, db };
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
