const {
  validate,
  registerValidation,
  updateProfileValidation,
  expenseValidation
} = require('../../lib/validation');

const store = (file, tags, folder, cloudinary) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ tags, folder }, (err, image) => {
      if (image) {
        return resolve(image);
      }
      return reject(err);
    });
    file.createReadStream().pipe(uploadStream);
  });

module.exports = {
  register: async (_, { user }, { models: { User } }) => {
    const { formatData, rules, messages } = registerValidation;
    await validate(formatData({ ...user }), rules, messages);

    return User(user).save();
  },
  logout: (_, args, { res, auth }) => {
    return auth.attemptLogout(res);
  },
  login: async (_, { email, password }, { res, models: { User }, auth }) => {
    return auth.attemptLogin(email, password, res, User);
  },
  expenseClaim: async (
    unused,
    { expense },
    { user, models: { Transaction, User }, cloudinary, db }
  ) => {
    expense.date = expense.date || Date.now();

    const { formatData, rules, messages } = expenseValidation;
    await validate(formatData({ ...expense }), rules, messages);

    expense.user = user.id;
    expense.flow = 'IN';
    expense.type = 'EXPENSE';
    const receipt = await expense.receipt;

    const session = await db.startSession();
    let tr;
    try {
      // upload the file to cloudinary
      const file = await store(receipt, 'expense receipt', '/expenses/pending/', cloudinary);
      expense.file = file.secure_url;

      const opts = { session };
      session.startTransaction();

      // save the expense
      tr = await new Transaction(expense).save(opts);

      // save the transaction id in the user's expenses
      const myExpenses = user.expenses || [];
      myExpenses.push(tr.id);
      const upUser = await User.findOneAndUpdate(
        { _id: user.id },
        { expenses: myExpenses },
        { new: true, ...opts }
      );

      tr.user = upUser;
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
    return tr;
  },
  updateProfile: async (_, args, { user, models: { User } }) => {
    const { formatData, rules, messages } = updateProfileValidation;
    await validate(formatData({ ...args.user }), rules, messages);
    const { email } = args.user;
    if (email && user.email !== email) {
      const emailAlreadyUsed = await User.findByEmail(email);
      if (emailAlreadyUsed) {
        throw new Error('Email already exists!');
      }
    }
    return User.findOneAndUpdate({ _id: user.id }, args.user, { new: true });
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
