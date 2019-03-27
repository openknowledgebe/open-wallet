const mongoose = require('mongoose');

const { Schema } = mongoose;

const bankDetailsSchema = new Schema(
  {
    iban: String,
    bic: String
  },
  { _id: false }
);

module.exports = bankDetailsSchema;
