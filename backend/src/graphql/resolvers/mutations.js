const saveOrRetrieveCompany = async (company, Company, upsert) => {
  if (!company) return null;
  const { name, id } = company;
  if (!name && !id) return null;
  if (company.id) {
    return Company.findById(id);
  }
  if (company) {
    return Company.findOneAndUpdate({ name }, company, { new: true, upsert });
  }
  return null;
};

const getInvoiceRef = async (id, Counter) => {
  const counter = await Counter.findByIdAndUpdate(
    id,
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );
  const INVOICE_REF_SIZE = process.env.INVOICE_REF_SIZE || 4;
  const z = '0';
  return `${id}/${`${z.repeat(INVOICE_REF_SIZE)}${counter.sequence}`.slice(-INVOICE_REF_SIZE)}`;
};

const store = (file, tags, folder, cloudinary, generated) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ tags, folder }, (err, image) => {
      if (image) {
        return resolve(image);
      }
      return reject(err);
    });
    if (!generated) file.createReadStream().pipe(uploadStream);
    else file.pipe(uploadStream);
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
      constants: { TR_TYPE, TR_FLOW, STORAGE_PATH },
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
      const file = await store(
        receipt,
        'expense receipt',
        STORAGE_PATH.EXPENSE_PENDING,
        cloudinary
      );
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
      constants: { TR_TYPE, TR_FLOW, STORAGE_PATH },
      validation: { uploadInvoiceValidation, validate }
    }
  ) => {
    const { formatData, rules, messages } = uploadInvoiceValidation;
    await validate(formatData({ ...invoice }), rules, messages);

    // look for a company (by id or name), if name is provided: update it or save it if doesn't exist
    const company = await saveOrRetrieveCompany(invoice.company, Company, true);
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

    const file = await store(invoice.invoice, 'invoice', STORAGE_PATH.INVOICE_PENDING, cloudinary);
    invoice.file = file.secure_url;

    return new Transaction(invoice).save();
  },
  generateInvoice: async (
    root,
    { invoice },
    {
      models: { Transaction, Company, Counter },
      cloudinary,
      constants: { TR_TYPE, TR_FLOW, STORAGE_PATH },
      validation: { generateInvoiceValidation, validate },
      invoiceGen
    }
  ) => {
    const { formatData, rules, messages } = generateInvoiceValidation;

    // look for a company (by id or name), if name is provided: update it or save it if doesn't exist
    const company = await saveOrRetrieveCompany(invoice.company, Company, true);
    invoice.company = company;

    //  validate the inputs with the retrieved company, will throw if any required element is missing
    await validate(formatData(invoice), rules, messages);
    invoice.type = TR_TYPE.INVOICE;
    invoice.flow = TR_FLOW.OUT;
    invoice.date = Date.now();

    const noInvoice = await getInvoiceRef(new Date(invoice.date).getFullYear(), Counter);
    invoice.ref = noInvoice;

    let file = await invoiceGen(
      invoice.details,
      {
        date: invoice.date,
        VAT: invoice.VAT,
        noInvoice
      },
      invoice.company
    );

    file = await store(file, 'invoice', STORAGE_PATH.INVOICE_PENDING, cloudinary, true);
    invoice.file = file.secure_url;

    return new Transaction(invoice).save();
  }
};
