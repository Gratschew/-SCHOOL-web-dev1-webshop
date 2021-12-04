const { getCredentials } = require('../utils/requestUtils');
/**
 * Get current user based on the request headers
 *
 * @param {http.IncomingMessage} request to fetch current credentials
 * @returns {object|null} current authenticated user or null if not yet authenticated
 */
const getCurrentUser = async request => {
  // TODO: 8.5 Implement getting current user based on the "Authorization" request header

  // NOTE: You can use getCredentials(request) function from utils/requestUtils.js
  // and getUser(email, password) function from utils/users.js to get the currently
  // logged in user

  // 9.6
  const currentCreds = getCredentials(request);
  if(currentCreds !== null){
 
  const User = require("../models/user");

   // find one user with the email from credentials
  const emailUser = await User.findOne({ email: currentCreds[0] }).exec();
  if(emailUser !== null){
    if (await emailUser.checkPassword(currentCreds[1])) {
      // password is correct
      return emailUser;
    } else {
      // password incorrect
      return null;
    }
  }
  
  return null; 
  }
  else{
    return null;
  }
};

module.exports = { getCurrentUser };