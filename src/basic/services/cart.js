// services/cart.js

import {
  getProduct,
  getCartQuantity,
  setCartQuantity,
  setLastSelectedProductId,
  updateProduct,
  getElements,
} from '../store/state.js'
import { formatProductPrice, formatProductName } from '../utils/formatters.js'
import { CartItem } from '../components/CartItem.js'
import { updateCart } from './discount.js'
import { updateProductOptions } from '../services/product.js'

export function updateCartItemPrice(itemElement, product) {
  const priceDiv = itemElement.querySelector('.text-lg')
  const nameDiv = itemElement.querySelector('h3')

  priceDiv.innerHTML = formatProductPrice(product)
  nameDiv.textContent = formatProductName(product)
}

export function addToCart(productId) {
  const product = getProduct(productId)
  if (!product || product.stock === 0) return

  const elements = getElements()
  const existingItem = document.getElementById(productId)

  if (existingItem) {
    // 이미 장바구니에 있는 경우
    const qtyElement = existingItem.querySelector('.quantity-number')
    const currentDisplayQty = parseInt(qtyElement.textContent)

    if (product.stock > 0) {
      qtyElement.textContent = currentDisplayQty + 1
      setCartQuantity(productId, currentDisplayQty + 1)
      updateProduct(productId, { stock: product.stock - 1 })
    } else {
      alert('재고가 부족합니다.')
      return // 추가하지 않고 종료
    }
  } else {
    // 새로 추가하는 경우
    const cartItemElement = CartItem(product)
    elements.cartItems.appendChild(cartItemElement)
    setCartQuantity(productId, 1)
    updateProduct(productId, { stock: product.stock - 1 })
  }

  setLastSelectedProductId(productId)
  updateCart()
  updateProductOptions()
}

export function changeQuantity(productId, change) {
  const product = getProduct(productId)
  const itemElement = document.getElementById(productId)
  const qtyElement = itemElement.querySelector('.quantity-number')
  const currentQty = parseInt(qtyElement.textContent)
  const newQty = currentQty + change

  if (newQty > 0) {
    if (change > 0 && product.stock === 0) {
      alert('재고가 부족합니다.')
      return
    }

    qtyElement.textContent = newQty
    setCartQuantity(productId, newQty)
    updateProduct(productId, { stock: product.stock - change })
  } else {
    // 수량이 0이 되면 제거
    removeFromCart(productId)
    return
  }

  updateCart()
  updateProductOptions()
}

export function removeFromCart(productId) {
  const product = getProduct(productId)
  const itemElement = document.getElementById(productId)
  const quantity = getCartQuantity(productId)

  updateProduct(productId, { stock: product.stock + quantity })
  setCartQuantity(productId, 0)
  itemElement.remove()

  updateCart()
  updateProductOptions()
}
