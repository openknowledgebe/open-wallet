const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  password: String,
  email: {
    type: String,
    unique: true
  },
  address: Address,
  bank_details: BankDetails
});

module.exports = mongoose.model("User", userSchema);
