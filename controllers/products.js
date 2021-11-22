const responseUtils = require('../utils/responseUtils');
const { getCurrentUser } = require('../auth/auth');
const fileProducts = require('../products.json').map(product => ({...product }));
/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response
 * @param request 
 */
const getAllProducts = async(response, request) => {
  // TODO: 10.2 Implement this
  const currUser = await getCurrentUser(request);
  if(!currUser ) {
    responseUtils.basicAuthChallenge(response);
  }
  else {
    if (currUser.role === 'customer' || currUser.role === 'admin') {
      responseUtils.sendJson(response, fileProducts);
    }
  }
};

module.exports = { getAllProducts };