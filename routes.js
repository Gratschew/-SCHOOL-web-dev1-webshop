const responseUtils = require('./utils/responseUtils');
const { acceptsJson, isJson, parseBodyJson } = require('./utils/requestUtils');
const { renderPublic } = require('./utils/render');
const { getCurrentUser } = require('./auth/auth');
const { getAllProducts, fetchProduct, viewProduct, deleteProduct, updateProduct, registerProduct } = require('./controllers/products');
const { getAllUsers, viewUser, deleteUser, updateUser, registerUser, fetchUser} = require('./controllers/users');
const { getAllOrders, viewOrder, addOrder, fetchOrder} = require('./controllers/orders');

//const User = require("./models/user");
/**
 * Known API routes and their allowed methods
 *
 * Used to check allowed methods and also to send correct header value
 * in response to an OPTIONS request by sendOptions() (Access-Control-Allow-Methods)
 */
const allowedMethods = {
  '/api/register': ['POST'],
  '/api/users': ['GET'],
  '/api/products': ['GET', 'POST'],
  '/api/orders': ['GET', 'POST'],
  '/api/role' : ['GET']
};

/**
 * Send response to client options request.
 *
 * @param {string} filePath pathname of the request URL
 * @param {http.ServerResponse} response server's response
 */
const sendOptions = (filePath, response) => {
  if (filePath in allowedMethods) {
    response.writeHead(204, {
      'Access-Control-Allow-Methods': allowedMethods[filePath].join(','),
      'Access-Control-Allow-Headers': 'Content-Type,Accept',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Expose-Headers': 'Content-Type,Accept'
    });
    return response.end();
  }

  return responseUtils.notFound(response);
};

/**
 * Does the url have an ID component as its last part? (e.g. /api/users/dsf7844e)
 *
 * @param {string} url filePath
 * @param {string} prefix prefix
 * @returns {boolean} true if ID component as last part, false otherwise
 */
const matchIdRoute = (url, prefix) => {
  const idPattern = '[0-9a-z]{8,24}';
  const regex = new RegExp(`^(/api)?/${prefix}/${idPattern}$`);
  return regex.test(url);
};

/**
 * Does the URL match /api/users/{id}
 *
 * @param {string} url filePath
 * @returns {boolean} true if matches, false otherwise
 */
const matchUserId = url => {
  return matchIdRoute(url, 'users');
};

/**
 * Does the URL match /api/products/{id}
 * 
 * @param {string} url filePath
 * @returns {boolean} true if matches, false otherwise
 */
const matchProductId = url => {
  return matchIdRoute(url, 'products');
};

/**
 * Does the URL match /api/orders/{id}
 * 
 * @param {string} url filePath
 * @returns {boolean} true if matches, false otherwise
 */
const matchOrderId = url => {
  return matchIdRoute(url, 'orders');
};

/**
 * Handles the requests and responds to them 
 * 
 * @param {http.ServerRequest} request client's request
 * @param {http.ServerResponse} response server's response
 * @returns exit function after response has ended
 */
const handleRequest = async(request, response) => {
  const { url, method, headers } = request;
  const filePath = new URL(url, `http://${headers.host}`).pathname;
  // serve static files from public/ and return immediately
  if (method.toUpperCase() === 'GET' && !filePath.startsWith('/api')) {
    const fileName = filePath === '/' || filePath === '' ? 'index.html' : filePath;
    return renderPublic(fileName, response);
  }



  if (matchUserId(filePath)) {
    // You can use parseBodyJson(request) from utils/requestUtils.js to parse request body
    const splittedFilepath = filePath.split('/');
    const wantedId = splittedFilepath[splittedFilepath.length - 1];

    const wantedUser = await fetchUser(wantedId);
    const currUser = await getCurrentUser(request);

    if (!wantedUser) {
      responseUtils.notFound(response);
    }
    else if (!currUser) {
      responseUtils.basicAuthChallenge(response);
    }
    else if (!acceptsJson(request)) {
      responseUtils.contentTypeNotAcceptable(response);
    }
    else{
        if (method.toUpperCase() === 'GET') {
          await viewUser(response, wantedId, currUser);
        }
        
        else if (method.toUpperCase() === 'PUT') {
        const requestBody = await parseBodyJson(request);
         await updateUser(response, wantedId, currUser, requestBody);}
        
        
        else if (method.toUpperCase() === 'DELETE') { 
          await deleteUser(response, wantedId, currUser);
        }
    }
  }

  if (matchProductId(filePath)) {
    const splittedFilepath = filePath.split('/');
    const wantedId = splittedFilepath[splittedFilepath.length - 1];
    const wantedProduct = await fetchProduct(wantedId);
    const currUser = await getCurrentUser(request);

    if (!currUser) {
      responseUtils.basicAuthChallenge(response);
    }

    else if (!wantedProduct) {
      responseUtils.notFound(response);
    }
  
    else if (!acceptsJson(request)) {
      responseUtils.contentTypeNotAcceptable(response);
    }
    else{
        if (method.toUpperCase() === 'GET') {

          await viewProduct(response, wantedId, currUser);
        }
        else if (method.toUpperCase() === 'PUT') {

          const requestBody = await parseBodyJson(request);
           await updateProduct(response, wantedId, currUser, requestBody);
          }
          
        else if (method.toUpperCase() === 'DELETE') { 
            await deleteProduct(response, wantedId, currUser);
          }  
        }   
  }

  if (matchOrderId(filePath)) {
    const splittedFilepath = filePath.split('/');
    const wantedId = splittedFilepath[splittedFilepath.length - 1];
    const wantedOrder = await fetchOrder(wantedId);
    const currUser = await getCurrentUser(request);

    if (!currUser) {
      responseUtils.basicAuthChallenge(response);
    }

    else if (!wantedOrder) {
      responseUtils.notFound(response);
    }
  
    else if (!acceptsJson(request)) {
      responseUtils.contentTypeNotAcceptable(response);
    }
    else{
        if (currUser.role === 'customer' && wantedOrder.customerId.toString() !== currUser._id.toString()) {
          responseUtils.notFound(response);
        }
        else {
          await viewOrder(response, wantedId, currUser);
        }  
    }   
  }



  // Default to 404 Not Found if unknown url
  if (!(filePath in allowedMethods)) {
    return responseUtils.notFound(response);
  }
 


  // See: http://restcookbook.com/HTTP%20Methods/options/
  if (method.toUpperCase() === 'OPTIONS') return sendOptions(filePath, response);

  // Check for allowable methods
  if (!allowedMethods[filePath].includes(method.toUpperCase())) {
    return responseUtils.methodNotAllowed(response);
  }

  // Require a correct accept header (require 'application/json' or '*/*')
  if (!acceptsJson(request)) {
    return responseUtils.contentTypeNotAcceptable(response);
  }

  
  // GET all users
  if (filePath === '/api/users' && method.toUpperCase() === 'GET') {
    const currUser = await getCurrentUser(request);
    if(!currUser) {
      responseUtils.basicAuthChallenge(response);
    }
    else {
  
      if (currUser.role === 'customer') {
        responseUtils.forbidden(response);
      }
      else {
        await getAllUsers(response, request);
      }
    } 
  }

  // register new user
  if (filePath === '/api/register' && method.toUpperCase() === 'POST') {
    // Fail if not a JSON request, don't allow non-JSON Content-Type
    if (!isJson(request)) {
      responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }
    else{
    // You can use parseBodyJson(request) method from utils/requestUtils.js to parse request body.
    const requestBody = await parseBodyJson(request);
    await registerUser(response, requestBody); 
    }
  }

  if (filePath === '/api/products' && method.toUpperCase() === 'GET') {
    const currUser = await getCurrentUser(request);
    if(!currUser ) {
      responseUtils.basicAuthChallenge(response);
    }
    else {
      if (currUser.role === 'customer' || currUser.role === 'admin') {
        await getAllProducts(response);
      }
    }
  }

  if (filePath === '/api/products' && method.toUpperCase() === 'POST') {
    // Fail if not a JSON request, don't allow non-JSON Content-Type
    if (!isJson(request)) {
      responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }
    else{
      const currUser = await getCurrentUser(request);
      if(!currUser ) {
        responseUtils.basicAuthChallenge(response);
      }
      else {
        if (currUser.role === 'admin') {
        const requestBody = await parseBodyJson(request);
        await registerProduct(response, requestBody);
        }
        else responseUtils.forbidden(response);
      }
    } 
  }

  if (filePath === '/api/orders' && method.toUpperCase() === 'GET') {
    const currUser = await getCurrentUser(request);
    if(!currUser ) {
      responseUtils.basicAuthChallenge(response);
    }
    else {
      if (currUser.role === 'customer' || currUser.role === 'admin') {
        await getAllOrders(response, currUser);
      }
    }
  }

  if (filePath === '/api/orders' && method.toUpperCase() === 'POST') {
    // Fail if not a JSON request, don't allow non-JSON Content-Type
    if (!isJson(request)) {
      responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }
    const currUser = await getCurrentUser(request);
    if(!currUser ) {
      responseUtils.basicAuthChallenge(response);
    }
    else {
      if (currUser.role === 'customer') {
        const requestBody = await parseBodyJson(request);
        await addOrder(response, requestBody, currUser);
      }
      else {
        responseUtils.forbidden(response);
      }
    }
  }

  if (filePath === '/api/role' && method.toUpperCase() === 'GET'){
    const currUser = await getCurrentUser(request);
    if(!currUser) {
      responseUtils.basicAuthChallenge(response);
    }
    else {
      responseUtils.sendJson(response, currUser.role, 200);
    }
  }


};

module.exports = { handleRequest };