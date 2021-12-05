const responseUtils = require('../utils/responseUtils');
const User = require("../models/user");

/**
 * Send all users as JSON
 *
 * @param {http.ServerResponse} response server's response
 * 
 */
const getAllUsers = async(response) => {
  const userList = await User.find({});
  responseUtils.sendJson(response, userList, 200);
};

/**
 * Delete user and send deleted user as JSON
 *
 * @param {http.ServerResponse} response  server's response
 * @param {string} userId user's ID
 * @param {object} currentUser (mongoose document object)
 */
const deleteUser = async(response, userId, currentUser) => {
  const wantedUser = await User.findById(userId).exec();
  
  if (!wantedUser) {
    responseUtils.notFound(response);
  }
  else if (!currentUser) {
    responseUtils.basicAuthChallenge(response);
  }
  else {
    if (currentUser.role === 'customer') {
      return responseUtils.forbidden(response);
    }
    else if (currentUser.role === 'admin') {
      if(await currentUser._id.toString() === userId){
        responseUtils.sendJson(response, {wantedUser, error: 'Deleting own data is not allowed'}, 400);
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
 * @param {http.ServerResponse} response server's response
 * @param {string} userId user's ID
 * @param {object} currentUser (mongoose document object)
 * @param {object} userData JSON data from request body
 */
const updateUser = async(response, userId, currentUser, userData) => {
  const wantedUser = await User.findById(userId).exec();
  if(await User.exists({ _id: userId })){
  if (userData.role === '') {
        responseUtils.badRequest(response, 'Role is missing');
      }
  else if (userData.role === 'customer' || userData.role === 'admin') {
            if (currentUser.role === 'customer') {
            return responseUtils.forbidden(response);
            }
            else if(await currentUser._id.toString() === userId){
              responseUtils.sendJson(response, {wantedUser, error: 'Updating own data is not allowed'}, 400);
            }
            else{
            wantedUser.role = userData.role;
            await wantedUser.save();
            responseUtils.sendJson(response, wantedUser);}             
      }
  else {
        responseUtils.badRequest(response, 'Role is not valid');
  }
}
else responseUtils.notFound(response);

};

/**
 * Send user data as JSON
 *
 * @param {http.ServerResponse} response server's response
 * @param {string} userId User's ID
 * @param {object} currentUser (mongoose document object)
 */
const viewUser = async(response, userId, currentUser) => {
  const wantedUser = await User.findById(userId).exec();
  
  if (!wantedUser) {
    responseUtils.notFound(response);
  }
  else if (!currentUser) {
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
 * @param {http.ServerResponse} response server's response
 * @param {object} userData JSON data from request body
 */
const registerUser = async(response, userData) => {
    const allowedRoles = ['customer', 'admin'];
    const errors = [];

    if (!userData.name) errors.push('Missing name');
    if (!userData.email) errors.push('Missing email');
    else if (!validateEmail(await userData.email.toString())) errors.push('Invalid email');
    if (!userData.password) errors.push('Missing password');
    else if (userData.password.length < 10) errors.push("Password must be at least 10 characters");
    if (userData.role && !allowedRoles.includes(userData.role)) errors.push('Unknown role');
    
    if (errors.length !== 0) {
      responseUtils.badRequest(response, errors);
    }

    
    else if (await User.findOne({ email: userData.email.toLowerCase() }).exec() !== null){
      responseUtils.badRequest(response, 'Email already in use');
    }
    else {
      userData.email = userData.email.toLowerCase();
      const newUser = new User(userData);
      newUser.role = 'customer';
      await newUser.save();
      responseUtils.createdResource(response, newUser);
    }
};

/**
 * Checks if user ID is found from database and returns the user object promise
 * 
 * @param {string} wantedId user's id to
 * @returns {Promise} User object
 */
const fetchUser = async(wantedId) => {
  return await User.findById(wantedId).exec();
};

/**
 * Validates email adress by comparing it to characters and terms when it comes to email adresses
 * 
 * @param {string} email email
 * @returns {boolean} true if email could be a real email adress, false otherwise
 */
function validateEmail(email) 
    {
      const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

      // this was the original regex string which didn't pass ESlint's no-useless-escape
      //const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
      return re.test(email);
    }


module.exports = { getAllUsers, registerUser, deleteUser, viewUser, updateUser, fetchUser, validateEmail};