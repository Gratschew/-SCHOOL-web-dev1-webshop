const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SCHEMA_DEFAULTS = {
  items: {
      minLength: 1
  }
};

// productSchema for orderedItemSchema (same as in product.js but image is removed.)
const productSchema = new Schema({
  id_: {
    type: String, 
    required: [true, "can't be blank"], 
  },

  // for 'name'
  name: {
    type: String,  
    required: [true, "can't be blank"], 
  },

  // for 'price'
  price: {
    type: Number,  
    required: [true, "can't be blank"],
    min: 1
  },

  description: {
    type: String
  }
});

const orderedItemSchema = new Schema({ 
  product: {
    type: productSchema,
    required: [true, "can't be blank"]
  },

  quantity: {
  type: Number,
  required: [true, "can't be blank"]
  }
});

const orderSchema = new Schema({

  customerId: {
    type: String,  
    required: [true, "can't be blank"], 
  },

   
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