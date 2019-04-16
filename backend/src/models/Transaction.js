const mongoose = require('mongoose');

const { Schema } = mongoose;

const transactionSchema = new Schema({
  flow: {
    type: String,
    enum: ['IN', 'OUT']
  },
  balanceId: {
    type: String // should be ObjectId
  },
  companyId: {
    type: String // should be ObjectId
  },
  categoryId: {
    type: String // should be ObjectId
  },
  userId: {
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
