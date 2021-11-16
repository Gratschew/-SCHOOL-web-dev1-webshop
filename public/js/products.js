const addToCart = (productId, productName) => {
  // TODO 9.2
  // use addProductToCart(), available already from /public/js/utils.js
  // /public/js/utils.js also includes createNotification() function
  addProductToCart(productId);
  createNotification(`Added ${productName} to cart!`, 'notifications-container');
};

(async() => {
  //TODO 9.2 
  // - get the 'products-container' element
  // - get the 'product-template' element
  // - use getJSON(url) to get the available products
  // - for each of the products:
  //    * clone the template
  //    * add product information to the template clone
  //    * remember to add an event listener for the button's 'click' event, and call addToCart() in the event listener's callback
  // - remember to add the products to the the page


  const productsContainer = document.querySelector('#products-container');
  const productTemplate = document.querySelector('#product-template');

  const availableProducts = await getJSON('/api/products');

  availableProducts.forEach(product => {
    const { name, description, price, _id } = product;
    const templateClone = productTemplate.content.cloneNode(true);

    templateClone.querySelector("h3").id = `name-${_id}`;
    templateClone.querySelector("h3").innerText = `${name}`;
    templateClone.querySelector("p.product-description").id = `description-${_id}`;
    templateClone.querySelector("p.product-description").innerText = `${description}`;
    templateClone.querySelector("p.product-price").id = `price-${_id}`;
    templateClone.querySelector("p.product-price").innerText = `${price}`;
    templateClone.querySelector("button").id = `add-to-cart-${_id}`;
    templateClone.querySelector("button").addEventListener('click', () => addToCart(_id, name));

    productsContainer.append(templateClone);
  });



})();