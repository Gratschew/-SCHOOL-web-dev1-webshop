const infoContainer = document.querySelector('#info-container');
const infoTemplate = document.querySelector('#order-info-template');

const showMore = (_id, customerId, items) => {

    infoContainer.innerHTML = "";
    //const info = infoTemplate.content.cloneNode(true);
    //info.querySelector('#product-name').textContent = `${_id}`;
    //info.querySelector('#product-id').textContent = `${_id}`;
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
        info.querySelector('#product-quantity').textContent = `Product ID: ${item._id}`;
        info.querySelector('#product-quantity').textContent = `Quantity: ${item.quantity}`;
        info.querySelector('#divider');
        infoContainer.append(info);
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



