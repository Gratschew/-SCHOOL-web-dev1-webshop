const responseUtils = require('../utils/responseUtils');
const fileProducts = require('../products.json').map(product => ({...product }));
const Product = require("../models/product");

/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response server's response
 * 
 */
const getAllProducts = async(response) => {
  const productList = await Product.find({});
  responseUtils.sendJson(response, productList, 200);  
};

/**
 * 
 * @param {http.ServerResponse} response server's response
 * @param {string} productId product's ID
 * @param {object} currentUser mongoose document object
 */
const viewProduct = async(response, productId, currentUser) => {
  const wantedProduct = await Product.findById(productId).exec();
  if (!wantedProduct) {
    responseUtils.notFound(response);
  }
  else if (!currentUser) {
    responseUtils.basicAuthChallenge(response);
  }
  else
    responseUtils.sendJson(response, wantedProduct);
};


/**
 * 
 * @param {http.ServerResponse} response server's response
 * @param {string} productId product's ID
 * @param {object} currentUser mongoose document object
 * @param {object} productData JSON data from request body
 */
const updateProduct = async(response, productId, currentUser, productData) => {
  const wantedProduct = await Product.findById(productId).exec();
  if(await Product.exists({ _id: productId })){
      if (productData.name === '') {
        responseUtils.badRequest(response, 'Name is missing');
      }
      else if (isNaN(productData.price)) {
        responseUtils.badRequest(response, 'Not a number');
      }

      else if (productData.price <= 0){
        responseUtils.badRequest(response, 'Price is zero or negative');
      }
          
      else if (currentUser.role === 'customer') {
      responseUtils.forbidden(response);
      }
      else{
        if(productData.hasOwnProperty('name')){
          wantedProduct.name = productData.name;
        }
        if(productData.hasOwnProperty('price')){
          wantedProduct.price = productData.price;
        }
        if(productData.hasOwnProperty('description')){
          wantedProduct.description = productData.description;
        }
        if(productData.hasOwnProperty('image')){
          wantedProduct.image = productData.image;
        }
        
        await wantedProduct.save();
        responseUtils.sendJson(response, wantedProduct);
    }     
  } 

  else responseUtils.notFound(response);
};

/**
 * 
 * @param {http.ServerResponse} response server's response
 * @param {string} productId product's ID
 * @param {object} currentUser mongoose document object
 */
const deleteProduct = async(response, productId, currentUser) => {
  const wantedProduct = await Product.findById(productId).exec();
  if (!wantedProduct) {
    responseUtils.notFound(response);
  }
  else if (!currentUser) {
    responseUtils.basicAuthChallenge(response);
  }
  else {
    if (currentUser.role === 'customer') {
      responseUtils.forbidden(response);
    }
    else if(currentUser.role === 'admin') {
      const deletedProduct = wantedProduct;
      await Product.deleteOne({ _id: productId });
      responseUtils.sendJson(response, deletedProduct);
    }
  }
};

/**
 * 
 * @param {http.ServerResponse} response server's response
 * @param {object} productData JSON data from request body
 */
const registerProduct = async(response, productData) => {
    const allowedRoles = ['customer', 'admin'];
    const errors = [];

    if (!productData.name) errors.push('Missing name');
    if (!productData.price) errors.push('Missing email');  

    if (errors.length !== 0) {
      responseUtils.badRequest(response, errors);
    }
    else {
      const newProduct = new Product(productData);
      await newProduct.save();
      responseUtils.createdResource(response, newProduct);
    }
};

/**
 * Checks ifproduct ID is found from database and returns the product object promise
 * 
 * @param {string} wantedId user's id to
 * @returns {Promise} product object
 */
const fetchProduct = async(wantedId) => {
  return await Product.findById(wantedId).exec();
}

module.exports = { getAllProducts, fetchProduct, viewProduct, deleteProduct, updateProduct, registerProduct };