module.exports = {
  users: async (root, args, { models: { User } }) => User.find(),
  me: (_, args, { user }) => user,
  myExpenses: async (root, args, { user, models: { User } }) => {
    const userBis = await User.findOne({ _id: user.id }).populate('expenses');
    const expenses = userBis.expenses.map(expense => {
      expense.id = expense._id;
      return expense;
    });
    return expenses;
  },
  transactions: (root, args, { models: { Transaction } }) => Transaction.find()
};
