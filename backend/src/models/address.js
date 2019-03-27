const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    street: String,
    city: String,
    country: String,
    zipCode: Number
  },
  { _id: false }
);

module.exports = addressSchema;
