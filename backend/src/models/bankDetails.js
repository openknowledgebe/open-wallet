const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankDetailsSchema = new Schema(
  {
    iban: String,
    bic: String
  },
  { _id: false }
);

module.exports = bankDetailsSchema;
