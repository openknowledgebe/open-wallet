const mongoose = require('mongoose');

const { Schema } = mongoose;

const bankDetailsSchema = new Schema(
  {
    iban: {
      type: String,
      trim: true
    },
    bic: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

module.exports = bankDetailsSchema;
