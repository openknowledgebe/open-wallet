// import our production apollo-server instance
const { server, db } = require('../');

const { startTestServer, toPromise, populate } = require('./utils');
const { GET_ME, LOGIN_ME_IN, /* REGISTER, */ ALL_USERS } = require('./graphql/queryStrings');

// const testUser = { user: { name: 'Test Test', email: 'test@email.com', password: 'testing0189' } };

describe('Server - e2e', () => {
  let stop;
  let graphql;

  beforeAll(async () => {
    await db.connect();
    await populate();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  beforeEach(async () => {
    const testServer = await startTestServer(server);
    // eslint-disable-next-line prefer-destructuring
    stop = testServer.stop;
    // eslint-disable-next-line prefer-destructuring
    graphql = testServer.graphql;
  });

  afterEach(async () => stop());

  describe('Me query', () => {
    it('fails when user not logged in', async () => {
      const res = await toPromise(
        graphql({
          query: GET_ME
        })
      );
      expect(res).toMatchSnapshot();
    });
  });

  describe('Login', () => {
    it('fails on incorrect email', async () => {
      const res = await toPromise(
        graphql({
          query: LOGIN_ME_IN,
          variables: { email: 'email@gmail.com', password: 'johnnnyyy' }
        })
      );
      expect(res).toMatchSnapshot();
    });
    it('fails on incorrect password', async () => {
      const res = await toPromise(
        graphql({
          query: LOGIN_ME_IN,
          variables: { email: 'Sylvie@hotmail.com', password: 'johnnnyyy' }
        })
      );
      expect(res).toMatchSnapshot();
    });

    it('succeeds', async () => {
      const res = await toPromise(
        graphql({
          query: LOGIN_ME_IN,
          variables: { email: 'Sylvie@hotmail.com', password: 'sylvie2324' }
        })
      );
      expect(res).toMatchSnapshot();
    });
  });

  describe('All users', () => {
    it('requires to be logged in', async () => {
      const res = await toPromise(
        graphql({
          query: ALL_USERS
        })
      );
      expect(res).toMatchSnapshot();
    });
  });
  // TODO test registration
});
