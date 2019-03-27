const mongoose = require('mongoose');

const { Schema } = mongoose;

const addressSchema = new Schema(
  {
    street: String,
    city: String,
    country: String,
    zipCode: Number
  },
  { _id: false }
);

module.exports = addressSchema;
