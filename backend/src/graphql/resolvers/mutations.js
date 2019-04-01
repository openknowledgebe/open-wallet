module.exports = {
  register: async (_, { user }, { models: { User } }) => User(user).save()
};
