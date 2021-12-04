const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// salt rounds for bcrypt.hashSync()
const SALT_ROUNDS = 10;

const SCHEMA_DEFAULTS = {
  // name
  name: {
    minLength: 1,
    maxLength: 50
  },

  // email
  email: {
    // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },

  // password
  password: {
    minLength: 10
  },

  // role
  role: {
    values: ['admin', 'customer'],
    defaultValue: 'customer'
  }
};

// userSchema
const userSchema = new Schema({

  // name
  name: {
    type: String,  
    trim: true, 
    required: [true, "can't be blank"], 
    minLength: SCHEMA_DEFAULTS.name.minLength, 
    maxLength: SCHEMA_DEFAULTS.name.maxLength
  },

  // email  
  email: {
    type: String,  
    trim: true, 
    required: [true, "can't be blank"], 
    unique: true,
    match: SCHEMA_DEFAULTS.email.match
  },

  // password
  password: {
    type: String,  
    required: [true, "can't be blank"], 
    minLength: SCHEMA_DEFAULTS.password.minLength,
    set: password => {
      if (password === '' || password.length < SCHEMA_DEFAULTS.password.minLength) {
        return password;
      }
      else{
      return bcrypt.hashSync(password, SALT_ROUNDS);}
    }
  },

  // role
  role: {
    type: String,  
    trim: true, 
    required: [true, "can't be blank"], 
    lowercase: true,
    enum: SCHEMA_DEFAULTS.role.values,
    default: SCHEMA_DEFAULTS.role.defaultValue
  }
});


   


/**
 * Compare supplied password with user's own (hashed) password
 *
 * @param {string} password User object's password
 * @returns {Promise<boolean>} promise that resolves to the comparison result
 */
userSchema.methods.checkPassword = async function(password) {

  return bcrypt.compare(password, this.password);
};

// Omit the version key when serialized to JSON
userSchema.set('toJSON', { virtuals: false, versionKey: false });

const User = new mongoose.model('User', userSchema);
module.exports = User;