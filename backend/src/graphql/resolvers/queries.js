module.exports = {
  users: async (root, args, { models: { User } }) => User.find(),
  me: (_, args, { user }) => user
};
