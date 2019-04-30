const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('Category', categorySchema);
