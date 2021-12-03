const infoContainer = document.querySelector('#product-info-container');
const infoTemplate = document.querySelector('#product-info-template');

const addToCart = (productId, productName) => {
  // TODO 9.2
  // use addProductToCart(), available already from /public/js/utils.js
  // /public/js/utils.js also includes createNotification() function
  addProductToCart(productId);
  createNotification(`Added ${productName} to cart!`, 'notifications-container');
};

const showLess = (_id) => {
  document.querySelector(`#details-${_id}`).hidden = false;
  removeElement("product-info-container",`d-item-${_id}`);
};


const showMore = (_id) => {
  if (infoContainer.className !== "") {
    showLess(infoContainer.className);
  }
  
  infoContainer.className = _id;
  document.querySelector(`#details-${_id}`).hidden = true;

  const templateClone = infoTemplate.content.cloneNode(true);

  templateClone.querySelector("#product-info").id= `d-item-${_id}`
  templateClone.querySelector("h3").id = `d-name-${_id}`;
  templateClone.querySelector("h3").innerText =  `Name of the product: ${document.querySelector(`#name-${_id}`).innerText}`;
  templateClone.querySelector("p.product-description").id = `d-description-${_id}`;
  templateClone.querySelector("p.product-description").innerText = `Description: ${document.querySelector(`#desc-${_id}`).innerText}`;
  templateClone.querySelector("p.product-price").id = `d-price-${_id}`;
  templateClone.querySelector("p.product-price").innerText = `Price: ${document.querySelector(`#price-${_id}`).innerText}`;
  templateClone.querySelector(".close-button").addEventListener('click', () => showLess(_id));

  infoContainer.append(templateClone);
};

const updateProduct = async event => {
  event.preventDefault();

  const form = event.target;
  const id = form.querySelector('#id-input').value;
  const name = form.querySelector('#name-input').value;
  const price = form.querySelector('#price-input').value;
  const description = form.querySelector('#desc-input').value;


  try {
    const product = await postOrPutJSON(`/api/products/${id}`, 'PUT', { name, price, description });
    document.querySelector(`#name-${id}`).textContent = product.name;
    document.querySelector(`#price-${id}`).textContent = product.price;
    document.querySelector(`#desc-${id}`).textContent = product.description;
    removeElement('modify-product', 'edit-product-form');
    document.querySelector(".modify-button").hidden = false;
    return createNotification(`Updated product ${product.name}`, 'notifications-container');
  } catch (error) {
    console.error(error);
    return createNotification('Update failed!', 'notifications-container', false);
  }
};

const deleteProduct = async (productId) => {
  removeElement('modify-product', 'edit-product-form');

  try {
    const product = await deleteResource(`/api/products/${productId}`);
    removeElement('products-container', `item-${productId}`);
    removeElement('product-info-container', `d-item-${productId}`);
    return createNotification(`Deleted product ${product.name}`, 'notifications-container');
  } catch (error) {
    console.error(error);
    document.querySelector(`#modify-${productId}`).hidden = false;
    return createNotification('Delete failed!', 'notifications-container', false);
  }
};

const showAddForm = () => {
  removeElement('add-product', 'add-form');

  const formTemplate = document.querySelector('#add-form-template');
  const addContainer = document.querySelector('#add-product');
  const form = formTemplate.content.cloneNode(true);
  //form.querySelector('h2').textContent = `Modify product ${name}`;
  //form.querySelector('#id-input').value = id;
  //form.querySelector('#name-input').value = name;
  //form.querySelector('#price-input').value = price;
  //form.querySelector('#desc-input').value = desc;

  addContainer.append(form);
  addContainer.querySelector('form.add-form').addEventListener('submit', addProduct);
};

const showEditForm = (id, name, price, desc) => {
  removeElement('add-product', 'add-form');
  document.querySelector(".modify-button").hidden = true;
  
  const formTemplate = document.querySelector('#form-template');
  const modifyContainer = document.querySelector('#modify-product');
  const form = formTemplate.content.cloneNode(true);
  form.querySelector('h2').textContent = `Modify product ${name}`;
  form.querySelector('#id-input').value = id;
  form.querySelector('#name-input').value = name;
  form.querySelector('#price-input').value = price;
  form.querySelector('#desc-input').value = desc;

  modifyContainer.append(form);
  modifyContainer.querySelector('form').addEventListener('submit', updateProduct);
};

const addProduct = async event => {
  event.preventDefault();

  const form = event.target;
  //const id = form.querySelector('#id-input').value;
  const name = form.querySelector('#name').value;
  const price = form.querySelector('#price').value;
  const description = form.querySelector('#desc').value;

  try {
    const product = await postOrPutJSON(`/api/products`, 'POST', { name, price, description });
    
    const productsContainer = document.querySelector('#products-container');
    const productTemplate = document.querySelector('#product-template');

    const { _id } = product;
    const templateClone = productTemplate.content.cloneNode(true);

    templateClone.querySelector(".item-row-products").id = `item-${_id}`;
    templateClone.querySelector("h3").id = `name-${_id}`;
    templateClone.querySelector("h3").innerText = `${name}`;
    templateClone.querySelector("p.product-price").id = `price-${_id}`;
    templateClone.querySelector("p.product-price").innerText = `${price}`;
    templateClone.querySelector("p.product-description").id = `desc-${_id}`;
    templateClone.querySelector("p.product-description").innerText = `${description}`;
    templateClone.querySelector(".cart-button").id = `add-to-cart-${_id}`;
    templateClone.querySelector(".cart-button").addEventListener('click', () => addToCart(_id, name));
    templateClone.querySelector(".details-button").id = `details-${_id}`;
    templateClone.querySelector(".details-button").addEventListener('click', () => showMore(_id));
    templateClone.querySelector(".modify-button").id = `modify-${_id}`;
    templateClone.querySelector(".modify-button").addEventListener('click', () => showEditForm(_id, name, price, description));
    templateClone.querySelector(".modify-button").hidden = false;
    templateClone.querySelector(".delete-button").id = `delete-${_id}`;
    templateClone.querySelector(".delete-button").addEventListener('click', () => deleteProduct(_id));
    templateClone.querySelector(".delete-button").hidden = false;
    document.querySelector("#add-product-button").innerText = "Add Product";

    productsContainer.append(templateClone);
    removeElement('add-product', 'add-form');
    return createNotification(`Product ${product.name} added!`, 'notifications-container');
  } catch (error) {
    console.error(error);
    return createNotification('Product adding failed!', 'notifications-container', false);
  }
}

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
  
  let availableProducts = await getJSON('/api/products');

  let currRole = await getJSON('/api/role');
  availableProducts.forEach(product => {
    const { name, description, price, image, _id } = product;
    const templateClone = productTemplate.content.cloneNode(true);

    templateClone.querySelector(".item-row-products").id = `item-${_id}`;
    templateClone.querySelector("h3").id = `name-${_id}`;
    templateClone.querySelector("h3").innerText = `${name}`;
    templateClone.querySelector("img").id = `image-${_id}`;
    templateClone.querySelector("img").src = `${image}€`;
    templateClone.querySelector("p.product-price").id = `price-${_id}`;
    templateClone.querySelector("p.product-price").innerText = `${price}€`;
    templateClone.querySelector("p.product-description").id = `desc-${_id}`;
    templateClone.querySelector("p.product-description").innerText = `${description}`;
    templateClone.querySelector(".cart-button").id = `add-to-cart-${_id}`;
    templateClone.querySelector(".cart-button").addEventListener('click', () => addToCart(_id, name));
    templateClone.querySelector(".details-button").id = `details-${_id}`;
    templateClone.querySelector(".details-button").addEventListener('click', () => showMore(_id));
    templateClone.querySelector(".modify-button").id = `modify-${_id}`;
    templateClone.querySelector(".modify-button").addEventListener('click', () => showEditForm(_id, name, price, description));
    templateClone.querySelector(".delete-button").id = `delete-${_id}`;
    templateClone.querySelector(".delete-button").addEventListener('click', () => deleteProduct(_id));

    productsContainer.append(templateClone);
  });
  if(currRole === 'admin'){
  const editButton = document.querySelector("#edit-button");
  editButton.style.display = 'block';
  document.querySelector("#add-product-button").addEventListener('click', () => {
    if (document.querySelector("#add-product-button").innerText === "Add Product") {
      showAddForm();
      document.querySelector("#add-product-button").innerText = "Cancel adding";
    }
    else {
      removeElement('add-product', 'add-form');
      document.querySelector("#add-product-button").innerText = "Add Product";
    }
  });
  
  
  document.querySelector("#edit-button").addEventListener("click", async () => {
    availableProducts = await getJSON('/api/products');
    if (document.querySelector("#edit-button").innerText === "Edit Products") {
      availableProducts.forEach(product => {
        const { _id } = product;
        document.querySelector(`#delete-${_id}`).hidden = false;
        document.querySelector(`#modify-${_id}`).hidden = false;
      });
      document.querySelector("#edit-button").innerText = "Stop editing";
      document.querySelector("#add-product-button").hidden = false;
    }
    else {
      removeElement('modify-product', 'edit-product-form');
      removeElement('add-product', 'add-form');
      document.querySelector("#add-product-button").innerText = "Add Product";
      availableProducts.forEach(product => {
        const { _id } = product;
        document.querySelector(`#delete-${_id}`).hidden = true;
        document.querySelector(`#modify-${_id}`).hidden = true;
      });
      document.querySelector("#edit-button").innerText = "Edit Products";
      document.querySelector("#add-product-button").hidden = true;
    }
    
  });}

})();