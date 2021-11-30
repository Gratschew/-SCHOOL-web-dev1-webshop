const responseUtils = require('../utils/responseUtils');
//const { getCurrentUser } = require('../auth/auth');
const fileProducts = require('../products.json').map(product => ({...product }));
const Product = require("../models/product");
/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response
 * 
 */
const getAllProducts = async(response) => {
  // TODO: 10.2 Implement this
  const productList = await Product.find({});
  responseUtils.sendJson(response, productList, 200);
  //responseUtils.sendJson(response, fileProducts);
   
};
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

const deleteProduct = async(response, productId, currentUser) => {
  // TODO: 10.2 Implement this
  const wantedProduct = await Product.findById(productId).exec();
  
  if (!wantedProduct) {
    responseUtils.notFound(response);
  }
  else if (!currentUser) {
    responseUtils.basicAuthChallenge(response);
  }
  else {
    if (currentUser.role === 'customer') {
      return responseUtils.forbidden(response);
    }
    else if(currentUser.role === 'admin') {
      
      const deletedProduct = wantedProduct;
      await Product.deleteOne({ _id: productId });
      responseUtils.sendJson(response, deletedProduct);
    }
  }
};


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

const fetchProduct = async(wantedId) => {
  return await Product.findById(wantedId).exec();
}

module.exports = { getAllProducts, fetchProduct, viewProduct, deleteProduct, updateProduct, registerProduct };