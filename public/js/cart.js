/**
 * Adds product to card
 * 
 * @param {string} productId product's ID
 */
const addToCart = productId => {
  addProductToCart(productId);
  updateProductAmount(productId);
  
};

/**
 * Decreases amount of a specific product in cart. Removes the product if product amount is zero.
 * 
 * @param {string} productId product's ID
 */
const decreaseCount = productId => {
  if (decreaseProductCount(productId) === 0) {
    console.log(getProductCountFromCart(productId));
    removeElement("cart-container", `item-${productId}`);
  }
  else {
    updateProductAmount(productId);
  }
};

/**
 * Update's product amount
 * 
 * @param {string} productId product's ID
 */
const updateProductAmount = productId => {
  // TODO 9.2
  // - read the amount of products in the cart, /public/js/utils.js provides getProductCountFromCart(productId)
  // - change the amount of products shown in the right element's innerText
  document.querySelector(`#amount-${productId}`).innerText = `${getProductCountFromCart(productId)}x`;
};

/**
 * Places order and sends order data to database
 * 
 * @returns notification if placing the order was successful or not
 */
const placeOrder = async() => {
  // TODO 9.2
  // Get all products from the cart, /public/js/utils.js provides getAllProductsFromCart()
  // show the user a notification: /public/js/utils.js provides createNotification = (message, containerId, isSuccess = true)
  // for each of the products in the cart remove them, /public/js/utils.js provides removeElement(containerId, elementId)
  const cartProducts = getAllProductsFromCart();
  const availableProducts = await getJSON('/api/products');

  var orderJson = {};
  orderJson['items'] = [];
  cartProducts.forEach(cartItem => {
    availableProducts.forEach(product => {
      if (product._id === cartItem.name) {
        cartItem = product;
      }
    });  
    var product = {};
    var temp = {};
    product['_id'] = cartItem._id;
    product['name'] = cartItem.name;
    product['price'] = cartItem.price;
    product['description'] = cartItem.description;
    temp['product'] = product;
    temp['quantity'] = getProductCountFromCart(cartItem._id);
    orderJson.items.push(temp);

  });

  console.log(JSON.stringify(orderJson));
  try {
  const result = await postOrPutJSON('/api/orders', 'POST', orderJson);
  cartProducts.forEach(cartProduct => {
    removeElement("cart-container", `item-${cartProduct.name}`);
  });
  clearCart();
  return createNotification('Successfully created an order!', 'notifications-container');
} catch(error){
  return createNotification('Order failed! (Admin users may not create orders)', 'notifications-container', false);
}
};

(async() => {
  // TODO 9.2
  // - get the 'cart-container' element
  // - use getJSON(url) to get the available products
  // - get all products from cart
  // - get the 'cart-item-template' template
  // - for each item in the cart
  //    * copy the item information to the template
  //    * hint: add the product's ID to the created element's as its ID to 
  //        enable editing ith 
  //    * remember to add event listeners for cart-minus-plus-button
  //        cart-minus-plus-button elements. querySelectorAll() can be used 
  //        to select all elements with each of those classes, then its 
  //        just up to finding the right index.  querySelectorAll() can be 
  //        used on the clone of "product in the cart" template to get its two
  //        elements with the "cart-minus-plus-button" class. Of the resulting
  //        element array, one item could be given the ID of 
  //        `plus-${product_id`, and other `minus-${product_id}`. At the same
  //        time we can attach the event listeners to these elements. Something 
  //        like the following will likely work:
  //          clone.querySelector('button').id = `add-to-cart-${prodouctId}`;
  //          clone.querySelector('button').addEventListener('click', () => addToCart(productId, productName));
  //
  // - in the end remember to append the modified cart item to the cart 

  const cartContainer = document.querySelector('#cart-container');
  const cartItemTemplate = document.querySelector('#cart-item-template');

  const availableProducts = await getJSON('/api/products');
  const cartItems = getAllProductsFromCart();

  
  cartItems.forEach(cartItem => {
    availableProducts.forEach(product => {
      if (product._id === cartItem.name) {
        cartItem = product;
      }
    });
    
    const { name, description, price, _id } = cartItem;
    const templateClone = cartItemTemplate.content.cloneNode(true);
    
    templateClone.querySelector(".item-row").id= `item-${_id}`
    templateClone.querySelector("h3").id = `name-${_id}`;
    templateClone.querySelector("h3").innerText = `${name}`;
    templateClone.querySelector("p.product-price").id = `price-${_id}`;
    templateClone.querySelector("p.product-price").innerText = `${price}`;
    templateClone.querySelector("p.product-desc").id = `description-${_id}`;
    templateClone.querySelector("p.product-desc").innerText = `${description}`;
    templateClone.querySelector("p.product-amount").id = `amount-${_id}`;
    templateClone.querySelector("p.product-amount").innerText = `${getProductCountFromCart(_id)}x`;
    
    let buttons = templateClone.querySelectorAll(".cart-minus-plus-button");
    buttons[0].id = `plus-${_id}`;
    buttons[0].addEventListener('click', () => addToCart(_id));
    buttons[1].id = `minus-${_id}`;
    buttons[1].addEventListener('click', () => decreaseCount(_id));


    cartContainer.append(templateClone);
  });

  document.querySelector(".btn").addEventListener('click', () => placeOrder());

})();