const responseUtils = require('../utils/responseUtils');
//const { getCurrentUser } = require('../auth/auth');
//const fileProducts = require('../products.json').map(product => ({...product }));
const Order = require("../models/order");
/**
 * Send all orders as JSON
 *
 * @param {http.ServerResponse} response server's response
 * @param {object} currentuser (mongoose document object)
 * 
 */
const getAllOrders = async(response, currentuser) => {
  if (currentuser.role === 'admin') {
    const orderList = await Order.find({});
    responseUtils.sendJson(response, orderList, 200);
  }
  else if (currentuser.role === 'customer') {
    const customerOrders = await Order.find({customerId : `${currentuser._id}`});
    responseUtils.sendJson(response, customerOrders, 200);
  }
};

/**
 * Send wanted order as JSON
 * 
 * @param {http.ServerResponse} response server's response
 * @param {string} orderId id for order
 * @param {object} currentUser (mongoose document object)
 */
const viewOrder = async(response, orderId, currentUser) => {

  const wantedOrder = await Order.findById(orderId).exec();
  if (!wantedOrder) {
    responseUtils.notFound(response);
  }
  else if (!currentUser) {
    responseUtils.basicAuthChallenge(response);
  }
  else {
    responseUtils.sendJson(response, wantedOrder);
  }
};

/**
 * Add an order and send added order as JSON
 * 
 * @param {http.ServerResponse} response server's response
 * @param {object} orderData orderData JSON data from request body
 * @param {object} currUser (mongoose document object)
 */
const addOrder = async(response, orderData, currUser) => {
    const errors = [];
    //orderData.customerId = currUser._id;
    if (orderData.items.length === 0) {
        errors.push('Missing items');
    } 
    else {
        orderData.items.forEach(item => {
          if (!item.product || !item.hasOwnProperty('product')) {
              errors.push('Missing product');
          }
          else{
            if (!item.product._id) errors.push('Missing product _id');
            if (!item.product.name) errors.push('Missing product name');
            if (!item.product.price) errors.push('Missing product price');
          }
            if (!item.quantity) errors.push('Missing quantity');
        });
    }

    if (errors.length !== 0) {
      responseUtils.badRequest(response, errors);
    }
    else {
      const newOrder = new Order(orderData);
      newOrder.customerId = currUser._id;
      await newOrder.save();
      responseUtils.createdResource(response, newOrder);
    }
};

/**
 * Checks if order ID is found from database and returns the user object promise
 * 
 * @param {string} wantedId Order's id to search from database
 * @returns {Promise} Order object
 */
const fetchOrder = async(wantedId) => {
  return await Order.findById(wantedId).exec();
}

module.exports = { getAllOrders, viewOrder, addOrder, fetchOrder };