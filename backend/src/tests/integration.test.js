const { createTestClient } = require('apollo-server-testing');
const { auth } = require('./mocks/index');
const { db, models } = require('../');
const { constructTestServer, populate } = require('./utils');

const { LOGIN_ME_IN, GET_ME, REGISTER, ALL_USERS } = require('./graphql/queryStrings');

const testUser = { user: { name: 'Test Test', email: 'test@email.com', password: 'testing0189' } };

describe('Authenticated user', () => {
  let loggedUser;
  beforeAll(async () => {
    await db.connect();
    await populate();
    loggedUser = await models.User.findByEmail('john.doe@john.com');
  });

  afterAll(async () => {
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
      expect(res.data.me).toEqual({ name: loggedUser.name, id: loggedUser.id });
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
});
