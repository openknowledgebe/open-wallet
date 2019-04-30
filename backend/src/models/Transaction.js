const mongoose = require('mongoose');

const { Schema } = mongoose;

const transactionSchema = new Schema({
  flow: {
    type: String,
    enum: ['IN', 'OUT']
  },
  balance: {
    type: String // should be ObjectId
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company'
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  description: {
    type: String,
    trim: true
  },
  amount: {
    type: Number
  },
  date: {
    type: Date
  },
  expDate: {
    type: Date
  },
  state: {
    type: String,
    enum: ['UNCLEARED', 'CLEARED', 'PAID', 'REJECTED']
  },
  file: {
    type: 'String'
  },
  VAT: {
    type: Number
  },
  type: {
    type: String,
    enum: ['EXPENSE', 'INVOICE']
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
