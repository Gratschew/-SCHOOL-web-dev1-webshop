/**
 * Writes authenication challenge to response
 * 
 * @param {http.ServerResponse} response server's response
 * @returns exiting function
 */
const basicAuthChallenge = response => {
  response.writeHead(401, {'WWW-Authenticate': 'Basic'});
  return response.end();
};

/**
 * Writes application/json as content type and payload to the response
 * 
 * @param {http.ServerResponse} response server's response
 * @param {object} payload data to write
 * @param {string} code default 200
 * @returns exiting function
 */
const sendJson = (response, payload, code = 200) => {
  response.writeHead(code, { 'Content-Type': 'application/json' });
  return response.end(JSON.stringify(payload));
};

/**
 * Creates resource with given data and a 201 code
 * 
 * @param {http.ServerResponse} response server's response 
 * @param {object} payload data to write
 * @returns sendJson 
 */
const createdResource = (response, payload) => {
  return sendJson(response, payload, 201);
};

/**
 * Writes statuscode 204 to response
 * 
 * @param {http.ServerResponse} response server's response 
 * @returns exiting function
 */
const noContent = response => {
  response.statusCode = 204;
  return response.end();
};

/**
 * writes error message and statuscode 400 to response
 * 
 * @param {http.ServerResponse} response server's response 
 * @param {string} errorMsg error message
 * @returns exiting function
 */
const badRequest = (response, errorMsg) => {
  if (errorMsg) return sendJson(response, { error: errorMsg }, 400);
  response.statusCode = 400;
  return response.end();
};

/**
 *  * writes statuscode 403 to response
 * 
 * @param {http.ServerResponse} response server's response 
 * @returns exiting function
 */
const unauthorized = response => {
  response.statusCode = 401;
  return response.end();
};

/**
 * writes statuscode 403 to response
 * 
 * @param {http.ServerResponse} response server's response 
 * @returns exiting function
 */
const forbidden = response => {
  response.statusCode = 403;
  return response.end();
};

/**
 * Writes statuscode 404 to response
 * 
 * @param {http.ServerResponse} response server's response 
 * @returns exiting function
 */
const notFound = response => {
  response.statusCode = 404;
  return response.end();
};

/**
 * writes statuscode 405 to response
 * 
 * @param {http.ServerResponse} response server's response 
 * @returns exiting function
 */
const methodNotAllowed = response => {
  response.statusCode = 405;
  return response.end();
};

/**
 * Writes statuscode 406 to response
 * 
 * @param {http.ServerResponse} response server's response 
 * @returns exiting function
 */
const contentTypeNotAcceptable = response => {
  response.statusCode = 406;
  return response.end();
};

/**
 * Writes statuscode 500 to response
 * 
 * @param {http.ServerResponse} response server's response 
 * @returns exiting function
 */
const internalServerError = response => {
  response.statusCode = 500;
  return response.end();
};

/**
 * Redirects found resource to another url
 * 
 * @param {http.ServerResponse} response server's response 
 * @param {string} page url to new page 
 */
const redirectToPage = (response, page) => {
  response.writeHead(302, { Location: page });
  response.end();
};

module.exports = {
  sendJson,
  createdResource,
  noContent,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  methodNotAllowed,
  contentTypeNotAcceptable,
  internalServerError,
  basicAuthChallenge,
  redirectToPage
};