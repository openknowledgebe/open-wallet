/* eslint-disable func-names */
const mongoose = require('mongoose');
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
  bankDetails: BankDetails
});

userSchema.pre('save', async function(email) {
  if (this.where({ email }).countDocuments() !== 0) {
    throw new Error('Email already exists!');
  }
});

module.exports = mongoose.model('User', userSchema);
