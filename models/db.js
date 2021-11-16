const mongoose = require('mongoose');
require('dotenv').config();
const dburl = process.env.DBURL;

/**
 * Get database connect URL.
 *
 * Reads URL from DBURL environment variable or
 * returns default URL if variable is not defined
 *
 * @returns {string} connection URL
 */
const getDbUrl = () => {
  // TODO: 9.4 Implement this
  if(process.env.DBURL !== undefined){
    return process.env.DBURL;
  }
  else{
    return dburl;
  };
};

const connectDB = () => {
  // Do nothing if already connected
  if (!mongoose.connection || mongoose.connection.readyState === 0) {
    mongoose
      .connect(getDbUrl(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        autoIndex: true
      })
      .then(() => {
        mongoose.connection.on('error', err => {
          console.error(err);
        });

        mongoose.connection.on('reconnectFailed', handleCriticalError);
      })
      .catch(handleCriticalError);
  }
};

const handleCriticalError = (err) => {
  console.error(err);
  throw err;
};

const disconnectDB = () => {
  mongoose.disconnect();
};

module.exports = { connectDB, disconnectDB, getDbUrl };