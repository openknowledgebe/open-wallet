/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Address = require('./address');
const BankDetails = require('./bankDetails');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  address: Address,
  bankDetails: BankDetails,
  expenses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Transaction'
    }
  ]
});

userSchema.pre('save', async function() {
  const { email } = this;
  // accessing the constructor to make request against the db
  const found = await this.constructor.where({ email: email.toLowerCase() }).countDocuments();
  if (found !== 0) {
    throw new Error('Email already exists!');
  }
  if (this.isModified('password')) {
    // TODO Retrieve hash factor from env
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.pre('findOneAndUpdate', async function() {
  const input = this.getUpdate();
  const { password } = input;
  if (password) {
    // TODO Retrieve hash factor from env
    this.getUpdate().password = await bcrypt.hash(password, 10);
  }
});

userSchema.methods.rightPassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.findByEmail = async function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

module.exports = mongoose.model('User', userSchema);
