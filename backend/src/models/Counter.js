const mongoose = require('mongoose');

const { Schema } = mongoose;

const CounterSchema = new Schema({
  _id: String,
  sequence: Number
});

module.exports = mongoose.model('Counter', CounterSchema);
