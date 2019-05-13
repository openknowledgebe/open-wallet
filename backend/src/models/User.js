/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const address = require('./address');
const bankDetails = require('./bankDetails');

const HASH_ROUNDS = parseInt(process.env.HASH_ROUNDS, 10) || 10;

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  address,
  bankDetails,
  expenses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Transaction'
    }
  ]
});

/**
 * Mongoose middleware.
 * Hash the password and check for email existance.
 * @throws {Error} if email found
 */
userSchema.pre('save', async function() {
  const { email } = this;
  // accessing the constructor to make request against the db
  const found = await this.constructor.where({ email: email.toLowerCase() }).countDocuments();
  if (found !== 0) {
    throw new Error('Email already exists!');
  }
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, HASH_ROUNDS);
  }
});

/**
 * Mongoose middleware.
 * Hash the password if provided.
 */
userSchema.pre('findOneAndUpdate', async function() {
  const input = this.getUpdate();
  const { password } = input;
  if (password) {
    this.getUpdate().password = await bcrypt.hash(password, HASH_ROUNDS);
  }
});

/**
 * Expose bcrypt compare function.
 */
userSchema.methods.rightPassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.findByEmail = async function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

module.exports = mongoose.model('User', userSchema);
