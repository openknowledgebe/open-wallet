const mongoose = require('mongoose');

/**
 * Open connection to the database and creates collections.
 */
module.exports.connect = async () => {
  return mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
      useNewUrlParser: true,
      useFindAndModify: false
    })
    .then(async () => {
      console.log('DB connected successfully!');
      await mongoose.connection.createCollection('users');
      await mongoose.connection.createCollection('transactions');
      await mongoose.connection.createCollection('categories');
      await mongoose.connection.createCollection('companies');
      await mongoose.connection.createCollection('counters');
      console.log('Collections created successfully!');
    })
    .catch(err => {
      console.log(`DB connection failed: ${err}`);
    });
};

/**
 * Close the database connection. Used in tests.
 */
module.exports.disconnect = async () => {
  return mongoose
    .disconnect()
    .then(() => console.log('DB disconnected'))
    .catch(err => {
      console.log(`DB disconnection failed: ${err}`);
    });
};

/**
 * Expose mongoose startSession function.
 */
module.exports.startSession = async () => mongoose.startSession();
