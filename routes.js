const responseUtils = require('./utils/responseUtils');
const { acceptsJson, isJson, parseBodyJson, getCredentials } = require('./utils/requestUtils');
const { renderPublic } = require('./utils/render');
const { emailInUse, getAllUsers, saveNewUser, validateUser, updateUserRole, getUserById, getUser, deleteUserById } = require('./utils/users');
const { getCurrentUser } = require('./auth/auth')
/**
 * Known API routes and their allowed methods
 *
 * Used to check allowed methods and also to send correct header value
 * in response to an OPTIONS request by sendOptions() (Access-Control-Allow-Methods)
 */
const allowedMethods = {
  '/api/register': ['POST'],
  '/api/users': ['GET']
};

/**
 * Send response to client options request.
 *
 * @param {string} filePath pathname of the request URL
 * @param {http.ServerResponse} response
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
 * @param {string} prefix
 * @returns {boolean}
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
 * @returns {boolean}
 */
const matchUserId = url => {
  return matchIdRoute(url, 'users');
};

const handleRequest = async(request, response) => {
  const { url, method, headers } = request;
  const filePath = new URL(url, `http://${headers.host}`).pathname;

  // serve static files from public/ and return immediately
  if (method.toUpperCase() === 'GET' && !filePath.startsWith('/api')) {
    const fileName = filePath === '/' || filePath === '' ? 'index.html' : filePath;
    return renderPublic(fileName, response);
  }

  if (matchUserId(filePath)) {
    // TODO: 8.6 Implement view, update and delete a single user by ID (GET, PUT, DELETE)
    // You can use parseBodyJson(request) from utils/requestUtils.js to parse request body
    //throw new Error('Not Implemented');
    let splittedFilepath = filePath.split('/');
    let wantedId = splittedFilepath[splittedFilepath.length - 1];
    let wantedUser = getUserById(wantedId);
    const creds = getCredentials(request);

    if (wantedUser === undefined) {
      return responseUtils.notFound(response);
    }
    if (getCredentials(request) === null || getUser(creds[0], creds[1]) === undefined) {
      return responseUtils.basicAuthChallenge(response);
    }
    else {
      if (getUser(creds[0], creds[1]).role === 'customer') {
        return responseUtils.forbidden(response);
      }
      else if (getUser(creds[0], creds[1]).role === 'admin') {
        
        if (method.toUpperCase() === 'GET') {
          return responseUtils.sendJson(response, wantedUser);
        }
        
        else if (method.toUpperCase() === 'PUT') {
          const requestBody = await parseBodyJson(request);
          if (requestBody.role === '') {
            return responseUtils.badRequest(response, 'Role is missing');
          }
          else if (requestBody.role === 'customer' || requestBody.role === 'admin') {
            let updatedUser = updateUserRole(wantedId, requestBody.role);
            return responseUtils.sendJson(response, updatedUser);
          }
          else {
            return responseUtils.badRequest(response, 'Role is not valid');
          }
        }
        
        else if (method.toUpperCase() === 'DELETE') {
          const deletedUser = deleteUserById(wantedId);
          return responseUtils.sendJson(response, deletedUser);
        }
      }
    }
  }

  // Default to 404 Not Found if unknown url
  if (!(filePath in allowedMethods)) return responseUtils.notFound(response);

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
    // TODO 8.4 Replace the current code in this function.
    // First call getAllUsers() function to fetch the list of users.
    // Then you can use the sendJson(response, payload, code = 200) from 
    // ./utils/responseUtils.js to send the response in JSON format.
   

    // TODO: 8.5 Add authentication (only allowed to users with role "admin")
    if(getCredentials(request) === null || await getCurrentUser(request) === null 
    || await getCurrentUser(request) === undefined) {

      responseUtils.basicAuthChallenge(response);
    }
    else {

      const userList = getAllUsers();
      const currUser = await getCurrentUser(request);
      if (currUser.role === 'customer') {
        responseUtils.forbidden(response);
      }
      else {
        responseUtils.sendJson(response, userList, 200);
      }

    } 

  }

    


  

  // register new user
  if (filePath === '/api/register' && method.toUpperCase() === 'POST') {
    // Fail if not a JSON request, don't allow non-JSON Content-Type
    if (!isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }

    // TODO: 8.4 Implement registration
    // You can use parseBodyJson(request) method from utils/requestUtils.js to parse request body.
    // 
    //throw new Error('Not Implemented');
    const requestBody = await parseBodyJson(request);
    const errors = validateUser(requestBody);
    
    if (errors.length !== 0) {
      return responseUtils.badRequest(response, errors);
    }

    else if (emailInUse(requestBody.email)){
      return responseUtils.badRequest(response, 'Email already in use');
    }
    
    else {
      let newUser = saveNewUser(requestBody);
      newUser = updateUserRole(newUser._id, 'customer');
      return responseUtils.createdResource(response, newUser);
    }
  
  }
};

module.exports = { handleRequest };