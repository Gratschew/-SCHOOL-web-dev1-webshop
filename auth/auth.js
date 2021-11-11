const { getUser } = require ("../utils/users");
const { getCredentials } = require('../utils/requestUtils')
/**
 * Get current user based on the request headers
 *
 * @param {http.IncomingMessage} request
 * @returns {Object|null} current authenticated user or null if not yet authenticated
 */
const getCurrentUser = async request => {
  // TODO: 8.5 Implement getting current user based on the "Authorization" request header

  // NOTE: You can use getCredentials(request) function from utils/requestUtils.js
  // and getUser(email, password) function from utils/users.js to get the currently
  // logged in user

  const currentCreds = getCredentials(request);
  if(currentCreds != null){
    return getUser(currentCreds[0], currentCreds[1]);
  }

  else{
    return null;
  }
};

module.exports = { getCurrentUser };