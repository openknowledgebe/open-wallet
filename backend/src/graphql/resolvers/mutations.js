module.exports = {
  register: async (_, { user }, { models: { User } }) => User(user).save(),
  logout: (_, args, { res, auth }) => {
    return auth.attemptLogout(res);
  },
  login: async (_, { email, password }, { res, models: { User }, auth }) => {
    return auth.attemptLogin(email, password, res, User);
  },
  expenseClaim: async (unused, { expense }, { user, models: { Transaction } }) => {
    expense.user = user.id;
    expense.flow = 'IN';
    expense.date = expense.date || Date.now();
    const tr = await Transaction(expense).save();
    tr.user = user;
    return tr;
  }
};

// TODO REMOVE EXAMPLE
// {
//   "query": "mutation ($amount: Float!, $description: String!, $receipt: Upload!) {expenseClaim(expense: {amount: $amount, description: $description, receipt: $receipt}) {id}}",
//   "variables": {
//     "amount": 10,
//     "description": "Hello World!",
//     "receipt": null
//   }
// }
