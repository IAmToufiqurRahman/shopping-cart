import items from './items.json'

const storeItemTemplate = document.querySelector('#store-item-template')
const storeItemContainer = document.querySelector('[data-store-container]')

export function setupStore() {
  items.forEach(renderStoreItem)
}

function renderStoreItem(item) {
  // Clone the store items template
  const storeItem = storeItemTemplate.content.cloneNode(true)

  // Container ~ here we put the id of our item
  const container = storeItem.querySelector('[data-store-item]')

  // We wanna link between the items.json and store.html, need to map the id with the html
  container.dataset.itemId = item.id

  const name = storeItem.querySelector('[data-name]')

  name.innerText = item.name

  storeItemContainer.appendChild(storeItem)
}
