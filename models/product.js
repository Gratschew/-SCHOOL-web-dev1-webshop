const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema defaults
const SCHEMA_DEFAULTS = {

  // price
  price: {
      minValue: 0
  }
};

// productSchema
const productSchema = new Schema({
  // name
  name: {
    type: String,  
    required: [true, "can't be blank"], 
  },

  // price
  price: {
    type: Number,  
    required: [true, "can't be blank"],
    min: SCHEMA_DEFAULTS.minValue
  },

  // image
  image: {
    type: String
  },

  // description
  description: {
    type: String
  }

});



// Omit the version key when serialized to JSON
productSchema.set('toJSON', { virtuals: false, versionKey: false });

const Product = new mongoose.model('Product', productSchema);
module.exports = Product;