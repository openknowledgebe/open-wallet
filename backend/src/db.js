const mongoose = require('mongoose');

module.exports.connect = async () => {
  return mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
      useNewUrlParser: true
    })
    .then(() => console.log('DB connected successfully!'))
    .catch(err => {
      console.log(`DB connection failed: ${err}`);
    });
};

module.exports.disconnect = async () => {
  return mongoose
    .disconnect()
    .then(() => console.log('DB disconnected'))
    .catch(err => {
      console.log(`DB disconnection failed: ${err}`);
    });
};
