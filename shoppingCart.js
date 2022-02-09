import items from './items.json'
import formatCurrency from './util/formatCurrency.js'
import addGlobalEventListener from './util/addGlobalEventListener'

const cartButton = document.querySelector('[data-cart-button]')
const cartItemsWrapper = document.querySelector('[data-cart-items-wrapper]')
const cartItemContainer = document.querySelector('[data-cart-items]')
const cartQuantity = document.querySelector('[data-cart-quantity]')
const cartTotal = document.querySelector('[data-cart-total]')
const cart = document.querySelector('[data-cart]')
const SESSION_STORAGE_KEY = 'SHOPPING_CART-cart'

let shoppingCart = []

const IMAGE_URL = 'https://dummyimage.com/210x130'

const cartItemTemplate = document.querySelector('#cart-item-template')

export function setupShoppingCart() {
  addGlobalEventListener('click', '[data-remove-from-cart-button]', (e) => {
    const id = parseInt(e.target.closest('[data-item]').dataset.itemId)
    removeFromCart(id)
  })

  shoppingCart = loadCart()

  renderCart()

  // Show/ Hide the cart when clicked
  cartButton.addEventListener('click', () => cartItemsWrapper.classList.toggle('invisible'))
}

// Persist across multiple pages
function saveCart() {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(shoppingCart))
}

function loadCart() {
  const cart = sessionStorage.getItem(SESSION_STORAGE_KEY)
  return JSON.parse(cart) || []
}

// Add items to the cart
// Handle the click event for adding
export function addToCart(id) {
  // to check if there is item added to cart already
  const existingItem = shoppingCart.find((entry) => entry.id === id)

  if (existingItem) {
    existingItem.quantity++
  } else {
    shoppingCart.push({ id: parseInt(id), quantity: 1 })
  }

  renderCart()
  saveCart()
}

// Remove items from the cart
function removeFromCart(id) {
  const existingItem = shoppingCart.find((entry) => entry.id === id)

  if (existingItem == null) return

  shoppingCart = shoppingCart.filter((entry) => entry.id !== id)

  renderCart()
  saveCart()
}

// show or hide cart depending on if there are items inside cart or not
function renderCart() {
  if (shoppingCart.length === 0) {
    hideCart()
  } else {
    showCart()
    renderCartItems()
  }
}

function hideCart() {
  cart.classList.add('invisible')
  cartItemsWrapper.classList.add('invisible')
}

function showCart() {
  cart.classList.remove('invisible')
}

function renderCartItems() {
  cartQuantity.innerText = shoppingCart.length

  // Calculate an accurate total
  const totalCents = shoppingCart.reduce((sum, entry) => {
    const item = items.find((i) => entry.id === i.id)

    return sum + item.priceCents * entry.quantity
  }, 0)

  cartTotal.innerText = formatCurrency(totalCents / 100)

  // this is to prevent appearing cart items added previously again
  cartItemContainer.innerHTML = ''

  shoppingCart.forEach((entry) => {
    const item = items.find((i) => entry.id === i.id)

    // Clone the store items template
    const cartItem = cartItemTemplate.content.cloneNode(true)

    // Container ~ here we put the id of our item
    const container = cartItem.querySelector('[data-item]')

    // We wanna link between the items.json and store.html, need to map the id with the html
    container.dataset.itemId = item.id

    const name = cartItem.querySelector('[data-name]')
    name.innerText = item.name

    const image = cartItem.querySelector('[data-image]')
    image.src = `${IMAGE_URL}/${item.imageColor}/${item.imageColor}`

    if (entry.quantity > 1) {
      const quantity = cartItem.querySelector('[data-name]')
      quantity.innerText = `x${entry.quantity}`
    }

    const price = cartItem.querySelector('[data-price]')
    price.innerText = formatCurrency((item.priceCents * entry.quantity) / 100)

    cartItemContainer.appendChild(cartItem)
  })
}
