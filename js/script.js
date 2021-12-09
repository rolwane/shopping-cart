const items = document.querySelector('.items');
const btnSearch = document.querySelector('.btn-search');
const basket = document.querySelector('.basket');
const menuBasket = document.querySelector('.menu-basket');
const btnBasket = document.querySelector('.btn-basket');

function createImageElement(className, src) {
  const e = document.createElement('img');
  e.className = className;
  e.setAttribute('src', src);
  return e;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createBasketItem({ title, price, thumbnail }) {
  const li = createCustomElement('li', 'basket-item', '');
  li.appendChild(createImageElement('', thumbnail));
  li.appendChild(createCustomElement('span', 'btn-remove-item', 'X'));
  const formatedPrice = price.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
  const section = createCustomElement('section', 'basket-item-content', '');
  section.appendChild(createCustomElement('span', 'basket-item-title', title));
  section.appendChild(createCustomElement('span', 'basket-item-price', formatedPrice));
  li.appendChild(section);
  li.setAttribute('data-price', price);
  return li;
}

function checkBasket() {
  const items = basket.querySelectorAll('.basket-item');
  if (items.length > 0) {
    btnBasket.classList.add('notification');
  } else {
    btnBasket.classList.remove('notification');
  }
}

function getID(e) {
  const path = e.path.length;
  if (path === 10) {
    return e.target.parentNode.parentNode.getAttribute('data-id');
  }
  if (path === 11) {
    return e.target.parentNode.parentNode.parentNode.getAttribute('data-id');
  }
  return e.target.parentNode.getAttribute('data-id');
}

function itemAdded() {
  btnBasket.classList.add('added');
  setTimeout(() => btnBasket.classList.remove('added'), 2000)
}

function addToBasket(e) {
  const itemID = getID(e);
  fetchItem(itemID).then((response) => {
    basket.append(createBasketItem(response));
    checkBasket();
    saveItems(basket.innerHTML);
    getTotalPrice();
    itemAdded();
  });
}

function createItemElement({ id, title, price, thumbnail }) {
  const section = createCustomElement('section', 'item', '');
  const content = createCustomElement('div', 'item-content', '');
  const button = createCustomElement('button', 'btn-AddBasket', '');
  const formatedPrice = price.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
  section.appendChild(createImageElement('item-image', thumbnail));
  content.appendChild(createCustomElement('span', 'item-id', id));
  content.appendChild(createCustomElement('span', 'item-price', formatedPrice));
  content.appendChild(createCustomElement('span', 'item-title', title));
  button.appendChild(createCustomElement('i', 'fas fa-shopping-basket', ''));
  button.addEventListener('click', addToBasket);
  section.appendChild(content);
  section.appendChild(button);
  section.setAttribute('data-id', id);
  return section;
}

function addLoading() {
  const image = createImageElement('loading', './images/loading.gif');
  document.querySelector('main').appendChild(image)
}

function clearLoading() {
  document.querySelector('.loading').remove();
}

function showProducts(search) {
  fetchProducts(search).then((response) => {
    response.results.forEach((item) => {
      const image = `${item.thumbnail.slice(0, item.thumbnail.length - 5)}W.jpg`;
      const { id, title, price, thumbnail } = item;
      items.appendChild(createItemElement({ id, title, price, thumbnail: image }))
    });
    clearLoading();
  });
}

function goSearch() {
  const searchValue = document.querySelector('#search').value;
  items.innerHTML = '';
  addLoading();
  showProducts(searchValue);
}

function removeItem(event) {
  if (event.target.className === 'btn-remove-item') {
    event.target.parentNode.remove()
  }
  checkBasket();
  saveItems(basket.innerHTML);
  getTotalPrice();
}

function getTotalPrice() {
  const span = document.querySelector('.total-price');
  const basketItems = Array.from(basket.querySelectorAll('.basket-item'));
  const price = basketItems.reduce((acc, item) => acc + Number(item.getAttribute('data-price')), 0);
  span.innerText = price.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
}

function loadBasket() {
  basket.innerHTML = getItems();
}

basket.addEventListener('click', removeItem);
btnSearch.addEventListener('click', goSearch);
document.addEventListener('keydown', (e) => e.key === 'Enter' ? goSearch() : '' );

btnBasket.addEventListener('click', () => {
  if (menuBasket.style.marginRight === '0px') { menuBasket.style.marginRight = '-400px' }
  else { menuBasket.style.marginRight = 0 }
});

window.onload = () => {
  addLoading();
  showProducts('computador');
  loadBasket();
  checkBasket();
  getTotalPrice();
}
