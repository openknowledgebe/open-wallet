const mongoose = require('mongoose');

const { Schema } = mongoose;

const addressSchema = new Schema(
  {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    zipCode: Number
  },
  { _id: false }
);

module.exports = addressSchema;
