// import our production apollo-server instance
const { server, db } = require('../');

const { startTestServer, toPromise, populate, clean } = require('./utils');
const { GET_ME, LOGIN_ME_IN, REGISTER, ALL_USERS } = require('./graphql/queryStrings');

const testUser = { user: { name: 'Test Test', email: 'tesT@email.com', password: 'testing0189' } };
const bankDetails = { iban: 'MY IBAN', bic: 'MY BIC' };
const address = { street: 'My street', city: 'My city', zipCode: 1000, country: 'My country' };

describe('Server - e2e', () => {
  let stop;
  let graphql;

  beforeAll(async () => {
    await db.connect();
    await populate();
  });

  afterAll(async () => {
    await clean();
    await db.disconnect();
  });

  beforeEach(async () => {
    const testServer = await startTestServer(server);
    // eslint-disable-next-line prefer-destructuring
    stop = testServer.stop;
    // eslint-disable-next-line prefer-destructuring
    graphql = testServer.graphql;
  });

  afterEach(async () => {
    stop();
  });

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

  describe('Register', () => {
    it('fails if email already exists', async () => {
      const copyTestUser = { user: { ...testUser.user, email: 'john.doe@john.com' } };

      const res = await toPromise(
        graphql({
          query: REGISTER,
          variables: copyTestUser
        })
      );
      expect(res).toMatchSnapshot();
    });

    it('ignores email case for validation', async () => {
      const copyTestUser = { user: { ...testUser.user, email: 'johN.dOe@john.com' } };

      const res = await toPromise(
        graphql({
          query: REGISTER,
          variables: copyTestUser
        })
      );
      expect(res).toMatchSnapshot();
    });

    it('succeeds & returns lower case email', async () => {
      const res = await toPromise(
        graphql({
          query: REGISTER,
          variables: testUser
        })
      );
      expect(res).toMatchSnapshot();
      expect(res.data.register.email).toBe('test@email.com');
    });

    it('succeeds & saves address and bankDetails', async () => {
      const res = await toPromise(
        graphql({
          query: REGISTER,
          variables: {
            user: {
              ...testUser.user,
              bankDetails,
              address,
              email: 'test1@gmail.com'
            }
          }
        })
      );
      expect(res).toMatchSnapshot();
      expect(res.data.register.bankDetails).toBeTruthy();
      expect(res.data.register.address).toBeTruthy();
    });
  });
});
