const responseUtils = require('../utils/responseUtils');
//const { getCurrentUser } = require('../auth/auth');
const fileProducts = require('../products.json').map(product => ({...product }));
/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response
 * 
 */
const getAllProducts = async(response) => {
  // TODO: 10.2 Implement this

  responseUtils.sendJson(response, fileProducts);
   
};

module.exports = { getAllProducts };