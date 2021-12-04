const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema defaults
const SCHEMA_DEFAULTS = {
  // items
  items: {
      minLength: 1
  }
};

/**
 * productSchema for orderedItemSchema (same as in product.js but image is removed.)
 * will be used by orderedItemSchema
 *  */ 

const productSchema = new Schema({
  
  // product's ID
  _id: {
    type: String, 
    required: [true, "can't be blank"], 
  },

  // name
  name: {
    type: String,  
    required: [true, "can't be blank"], 
  },

  // price
  price: {
    type: Number,  
    required: [true, "can't be blank"],
    min: 1
  },

  // descrption
  description: {
    type: String
  }
});

/**
 * Schema for ordered items, part of orderSchema
 */
const orderedItemSchema = new Schema({ 
  product: {
    type: productSchema,
    required: [true, "can't be blank"]
  },

  // quantity
  quantity: {
  type: Number,
  required: [true, "can't be blank"]
  }
});

/**
 * Order schema
 */
const orderSchema = new Schema({

  // customer ID
  customerId: {
    type: String,  
    required: [true, "can't be blank"], 
  },

  // items
  items: {
    type: Array,  
    required: [true, "can't be blank"], 
    minLength: SCHEMA_DEFAULTS.items.minLength,
    items: [orderedItemSchema]
  }
 
});



// Omit the version key when serialized to JSON
orderSchema.set('toJSON', { virtuals: false, versionKey: false });

const Order = new mongoose.model('Order', orderSchema);
module.exports = Order;