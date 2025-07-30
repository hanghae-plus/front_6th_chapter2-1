// store/state.js

import { initializeProducts } from '../data/products.js'

// 전역 상태
let state = {
  products: [],
  cartItems: {},
  lastSelectedProductId: null,
  totalAmount: 0,
  totalQuantity: 0,
  bonusPoints: 0,
  elements: {},
}

// 상태 초기화
export function initializeState() {
  state.products = initializeProducts()
  state.cartItems = {}
  state.lastSelectedProductId = null
  state.totalAmount = 0
  state.totalQuantity = 0
  state.bonusPoints = 0
}

// Getters
export function getProducts() {
  return state.products
}

export function getProduct(productId) {
  return state.products.find((p) => p.id === productId)
}

export function getCartItems() {
  return state.cartItems
}

export function getCartQuantity(productId) {
  return state.cartItems[productId] || 0
}

export function getLastSelectedProductId() {
  return state.lastSelectedProductId
}

export function getTotalAmount() {
  return state.totalAmount
}

export function getTotalQuantity() {
  return state.totalQuantity
}

export function getBonusPoints() {
  return state.bonusPoints
}

export function getElements() {
  return state.elements
}

// Setters
export function setProducts(products) {
  state.products = products
}

export function updateProduct(productId, updates) {
  const product = state.products.find((p) => p.id === productId)
  if (product) {
    Object.assign(product, updates)
  }
}

export function setCartQuantity(productId, quantity) {
  if (quantity > 0) {
    state.cartItems[productId] = quantity
  } else {
    delete state.cartItems[productId]
  }
}

export function setLastSelectedProductId(productId) {
  state.lastSelectedProductId = productId
}

export function setTotalAmount(amount) {
  state.totalAmount = amount
}

export function setTotalQuantity(quantity) {
  state.totalQuantity = quantity
}

export function setBonusPoints(points) {
  state.bonusPoints = points
}

export function setElements(elements) {
  state.elements = elements
}
