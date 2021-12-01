const responseUtils = require('../utils/responseUtils');
//const { getCurrentUser } = require('../auth/auth');
//const fileProducts = require('../products.json').map(product => ({...product }));
const Order = require("../models/order");
/**
 * Send all orders as JSON
 *
 * @param {http.ServerResponse} response
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

const fetchOrder = async(wantedId) => {
  return await Order.findById(wantedId).exec();
}

module.exports = { getAllOrders, viewOrder, addOrder, fetchOrder };