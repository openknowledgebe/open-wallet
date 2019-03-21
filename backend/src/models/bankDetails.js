const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankDetailsSchema = new Schema(
  {
    iban: {
      type: String,
      sparse: true
    },
    bic: String
  },
  { _id: false }
);

module.exports = bankDetailsSchema;
