const store = (file, tags, folder, cloudinary) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { tags, public_id: 'hello-word.pdf', folder },
      (err, image) => {
        if (image) {
          return resolve(image);
        }
        return reject(err);
      }
    );
    file.createReadStream().pipe(uploadStream);
  });

module.exports = {
  register: async (_, { user }, { models: { User } }) => User(user).save(),
  logout: (_, args, { res, auth }) => {
    return auth.attemptLogout(res);
  },
  login: async (_, { email, password }, { res, models: { User }, auth }) => {
    return auth.attemptLogin(email, password, res, User);
  },
  expenseClaim: async (
    unused,
    { expense },
    { user, models: { Transaction, User }, cloudinary }
  ) => {
    expense.user = user.id;
    expense.flow = 'IN';
    expense.type = 'EXPENSE';
    expense.date = expense.date || Date.now();
    const receipt = await expense.receipt;
    const file = await store(receipt, 'expense receipt', '/expenses/pending/', cloudinary);
    expense.file = file.secure_url;
    const tr = await Transaction(expense).save();
    const myExpenses = user.expenses || [];
    myExpenses.push(tr.id);

    const upUser = await User.findOneAndUpdate(
      { _id: user.id },
      { expenses: myExpenses },
      { new: true }
    );

    tr.user = upUser;
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
