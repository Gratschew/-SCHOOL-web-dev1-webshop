const { getCurrentUser } = require('../auth/auth');
const responseUtils = require('../utils/responseUtils');
const User = require("../models/user");

/**
 * Send all users as JSON
 *
 * @param {http.ServerResponse} response
 * @aram request
 */
const getAllUsers = async(response, request) => {
  // TODO: 10.2 Implement this
  const currUser = await getCurrentUser(request);
  if(!currUser) {

    responseUtils.basicAuthChallenge(response);
  }
  else {

    const userList = await User.find({});
    if (currUser.role === 'customer') {
      responseUtils.forbidden(response);
    }
    else {
      responseUtils.sendJson(response, userList, 200);
    }

  } 
};

/**
 * Delete user and send deleted user as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} userId
 * @param {Object} currentUser (mongoose document object)
 */
const deleteUser = async(response, userId, currentUser) => {
  // TODO: 10.2 Implement this
  const wantedUser = await User.findById(userId).exec();
  
  if (!wantedUser) {
    responseUtils.notFound(response);
  }
  if (!currentUser) {
    responseUtils.basicAuthChallenge(response);
  }
  else {
    if (currentUser.role === 'customer') {
      return responseUtils.forbidden(response);
    }
    else if (currentUser.role === 'admin') {
      if(currentUser.email === wantedUser.email){
        responseUtils.badRequest(response);
      }
      else{
      const deletedUser = wantedUser;
      await User.deleteOne({ _id: userId });
      responseUtils.sendJson(response, deletedUser);}
}
}};

/**
 * Update user and send updated user as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} userId
 * @param {Object} currentUser (mongoose document object)
 * @param {Object} userData JSON data from request body
 */
const updateUser = async(response, userId, currentUser, userData) => {
  // TODO: 10.2 Implement this
  const wantedUser = await User.findById(userId).exec();
  
      if (userData.role === '') {
        responseUtils.badRequest(response, 'Role is missing');
      }
      else if (userData.role === 'customer' || userData.role === 'admin') {
        if(currentUser.email === wantedUser.email){
          responseUtils.badRequest(response);
        }
        else{
        wantedUser.role = userData.role;
        await wantedUser.save();
        responseUtils.sendJson(response, wantedUser);}
      }
      else {
        responseUtils.badRequest(response, 'Role is not valid');
      }

};

/**
 * Send user data as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} userId
 * @param {Object} currentUser (mongoose document object)
 */
const viewUser = async(response, userId, currentUser) => {
  // TODO: 10.2 Implement this
  const wantedUser = await User.findById(userId).exec();
  
  if (!wantedUser) {
    responseUtils.notFound(response);
  }
  if (!currentUser) {
    responseUtils.basicAuthChallenge(response);
  }
  else {
    if (currentUser.role === 'customer') {
      return responseUtils.forbidden(response);
    }
    else if (currentUser.role === 'admin') {
        

  responseUtils.sendJson(response, wantedUser);
}
  }};

/**
 * Register new user and send created user back as JSON
 *
 * @param {http.ServerResponse} response
 * @param {Object} userData JSON data from request body
 */
const registerUser = async(response, userData) => {
  // TODO: 10.2 Implement this
    const allowedRoles = ['customer', 'admin'];
    const errors = [];
    if (!userData.name) errors.push('Missing name');
    if (!userData.email) errors.push('Missing email');
    if (!userData.password) errors.push('Missing password');
    else if (userData.password.length < 10) errors.push("Password must be at least 10 characters");
    if (userData.role && !allowedRoles.includes(userData.role)) errors.push('Unknown role');
    
    if (errors.length !== 0) {
      return responseUtils.badRequest(response, errors);
    }

    else if (await User.findOne({ email: userData.email }).exec() !== null){
      return responseUtils.badRequest(response, 'Email already in use');
    }
    else {
      const newUser = new User(userData);
      newUser.role = 'customer';
      newUser.save();
      return responseUtils.createdResource(response, newUser);
    }
};

const fetchUser = async(wantedId) => {
  return await User.findById(wantedId).exec();
}



module.exports = { getAllUsers, registerUser, deleteUser, viewUser, updateUser, fetchUser };