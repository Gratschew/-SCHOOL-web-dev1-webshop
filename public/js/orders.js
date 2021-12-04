const infoContainer = document.querySelector('#info-container');
const infoTemplate = document.querySelector('#order-info-template');

/**
 * Show's more information of a specific order
 * 
 * @param {string} _id order ID
 * @param {string} customerId customer's ID
 * @param {list} items list of items in the order
 */
const showMore = (_id, customerId, items) => {

    // reset the infocontainer's data
    infoContainer.innerHTML = "";

    const info = infoTemplate.content.cloneNode(true);
    info.querySelector('#order-id').textContent = `Order ID: ${_id}`;
    info.querySelector('#customer-id').textContent = `Customer ID: ${customerId}`;
    infoContainer.append(info);
    infoContainer.appendChild( document.createTextNode( '\u00A0' ) );
    items.forEach(item => {
        const info = infoTemplate.content.cloneNode(true);
        info.querySelector('#product-name').textContent = `Product name: ${item.product.name}`;
        info.querySelector('#product-price').textContent = `Price: ${item.product.price}`;
        info.querySelector('#product-description').textContent = `Description: ${item.product.description}`;
        info.querySelector('#product-id').textContent = `Product ID: ${item.product._id}`;
        info.querySelector('#product-quantity').textContent = `Quantity: ${item.quantity}`;

        // create a divider to separate products
        info.querySelector('#divider');

        infoContainer.append(info);

        // create an empty space in to the container to separate products even more
        infoContainer.appendChild( document.createTextNode( '\u00A0' ) );

    });
    
};
(async() => {

  const ordersContainer = document.querySelector('#orders-container');
  const ordersTemplate = document.querySelector('#order-template');

  const allOrders = await getJSON('/api/orders');

  allOrders.forEach(order => {
    const { _id, customerId, items} = order;
    const templateClone = ordersTemplate.content.cloneNode(true);

    templateClone.querySelector("a").id = `name-${_id}`;
    templateClone.querySelector("a").innerText = `${_id}`;
    templateClone.querySelector("a").addEventListener('click', () => showMore(_id, customerId, items));

    ordersContainer.append(templateClone);
  });
})();



