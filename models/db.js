const mongoose = require('mongoose');
require('dotenv').config();

//for some reason the commented dburl failed tests in plussa but worked locally
//so dburl is now hard coded into the program
//const dburl = process.env.DBURL;
//const dburl_const = 'mongodb://localhost:27017/WebShopDb'
const dburl_const = "mongodb+srv://max:cat22@cluster1.xpgmo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

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
    return dburl_const;
  };
};

/**
 * Connects database
 */
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

/**
 * Will catch error if database connection fails from connectDB
 * 
 * @param {any} err error for connection error
 */
const handleCriticalError = (err) => {
  console.error(err);
  throw err;
};

/**
 * Disconnects database
 */
const disconnectDB = () => {
  mongoose.disconnect();
};

module.exports = { connectDB, disconnectDB, getDbUrl };