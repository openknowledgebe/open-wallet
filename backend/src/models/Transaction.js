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
    type: String // should be ObjectId
  },
  category: {
    type: String // should be ObjectId
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  description: {
    type: String
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
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
