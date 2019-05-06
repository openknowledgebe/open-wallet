const saveOrRetrieveCompany = async (company, Company) => {
  if (!company) return null;
  const { name, id } = company;
  if (!name && !id) return null;
  if (company.id) {
    return Company.findById(id);
  }
  if (company) {
    const cmpny = await Company.findOne({ name });
    if (cmpny) return cmpny;
    return new Company(company).save();
  }
  return null;
};

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
  register: async (
    _,
    { user },
    { models: { User }, validation: { registerValidation, validate } }
  ) => {
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
    {
      user,
      models: { Transaction, User },
      cloudinary,
      db,
      constants: { TR_TYPE, TR_FLOW },
      validation: { expenseValidation, validate }
    }
  ) => {
    expense.date = expense.date || Date.now();

    const { formatData, rules, messages } = expenseValidation;
    await validate(formatData({ ...expense }), rules, messages);

    expense.user = user.id;
    expense.flow = TR_FLOW.IN;
    expense.type = TR_TYPE.EXPENSE;
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
  updateProfile: async (
    _,
    args,
    { user, models: { User }, validation: { updateProfileValidation, validate } }
  ) => {
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
  },
  uploadInvoice: async (
    root,
    { invoice },
    {
      models: { Transaction, Company, Category },
      cloudinary,
      constants: { TR_TYPE, TR_FLOW },
      validation: { uploadInvoiceValidation, validate }
    }
  ) => {
    const { formatData, rules, messages } = uploadInvoiceValidation;
    await validate(formatData({ ...invoice }), rules, messages);
    const company = await saveOrRetrieveCompany(invoice.company, Company);
    invoice.company = company;
    if (invoice.category && (invoice.category.name || invoice.category.id)) {
      const category = Category.findOne({
        $or: [{ _id: company.category.id }, { name: company.category.id }]
      });
      if (!category) {
        throw new Error('Category not found.');
      }
      invoice.category = category;
    }
    invoice.flow = TR_FLOW.IN;
    invoice.type = TR_TYPE.INVOICE;
    invoice.date = invoice.date || Date.now();
    invoice.invoice = await invoice.invoice;

    const file = await store(invoice.invoice, 'invoice', '/invoices/pending', cloudinary);
    invoice.file = file.secure_url;

    return new Transaction(invoice).save();
  }
};
