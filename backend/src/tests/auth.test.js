const jwt = require('jsonwebtoken');
const { User, Response } = require('./mocks');
const auth = require('../auth');

const { MUST_LOGIN, MUST_LOGOUT, WRONG_EMAIL_PASSWORD } = require('../messages');

const res = new Response();

const token = jwt.sign({ userId: '1' }, process.env.APP_SECRET || 'mysecret');

describe('Auth', () => {
  describe('ensureLoggedIn', () => {
    it('throw when user not found', async () => {
      try {
        await auth.ensureLoggedIn({});
      } catch (e) {
        expect(e.message).toBe(MUST_LOGIN);
      }
    });
    it("doesn't throw when user found", async () => {
      try {
        await auth.ensureLoggedIn({ user: { id: 'A' } });
      } catch (e) {
        expect(e).toBe(null);
      }
    });
  });
  describe('ensureLoggedOut', () => {
    it('throw when user found', async () => {
      try {
        await auth.ensureLoggedOut({ user: { id: 'A' } });
      } catch (e) {
        expect(e.message).toBe(MUST_LOGOUT);
      }
    });
    it("doesn't throw when user not found", async () => {
      try {
        await auth.ensureLoggedOut({});
      } catch (e) {
        expect(e).toBe(null);
      }
    });
  });
  describe('attemptLogin', () => {
    it('returns right user', async () => {
      const user = await auth.attemptLogin('john.doe@john.com', 'johnnyyyyy', res, User);
      expect(user.email).toBe('john.doe@john.com');
    });
    it('fails on wrong password', async () => {
      try {
        await auth.attemptLogin('john.doe@john.com', 'johnnyyyy', res, User);
      } catch (e) {
        expect(e.message).toBe(WRONG_EMAIL_PASSWORD);
      }
    });
    it('fails on email or password', async () => {
      try {
        await auth.attemptLogin('john.de@john.com', 'johnnyyyy', res, User);
      } catch (e) {
        expect(e.message).toBe(WRONG_EMAIL_PASSWORD);
      }
    });

    it('succeeds for other user', async () => {
      const user = await auth.attemptLogin('mitchell@gmail.com', 'mitchelll', res, User);
      expect(user.email).toBe('mitchell@gmail.com');
    });
  });

  describe('attemptLogout', () => {
    it('is called', async () => {
      const result = await auth.attemptLogout(res);
      expect(result).toBeTruthy();
    });
  });

  describe('loggedUser', () => {
    it('retrives logged user', async () => {
      const user = await auth.loggedUser({ token }, { User });
      expect(user.id).toBe('1');
    });

    it('returns null when the token is invalid', async () => {
      const user = await auth.loggedUser({ token: 'sdsfsdffffffffsdfsdfsdfs' }, { User });
      expect(user).toBe(null);
    });
    it('returns null when the token is null or undefined', async () => {
      const user = await auth.loggedUser({}, { User });
      expect(user).toBe(null);
    });
  });
});
