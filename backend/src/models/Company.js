const mongoose = require('mongoose');
const bankDetails = require('./bankDetails');
const address = require('./address');

const { Schema } = mongoose;

const companySchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  VAT: {
    type: String,
    trim: true
  },
  bankDetails,
  address
});

module.exports = mongoose.model('Company', companySchema);
