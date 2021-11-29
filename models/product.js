const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 
const SCHEMA_DEFAULTS = {
  price: {
      minValue: 0
  }
};

// productSchema
const productSchema = new Schema({
  // for 'name'
  name: {
    type: String,  
    required: [true, "can't be blank"], 
  },

  // for 'price'
  price: {
    type: Number,  
    required: [true, "can't be blank"],
    min: SCHEMA_DEFAULTS.minValue
  },

  image: {
    type: String
  },

  description: {
    type: String
  }

});



// Omit the version key when serialized to JSON
productSchema.set('toJSON', { virtuals: false, versionKey: false });

const Product = new mongoose.model('Product', productSchema);
module.exports = Product;