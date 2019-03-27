const mongoose = require('mongoose');
const Address = require('./address');
const BankDetails = require('./bankDetails');

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  password: String,
  email: String,
  address: Address,
  bankDetails: BankDetails
});

module.exports = mongoose.model('User', userSchema);
