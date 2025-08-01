// services/discount.js

import { PRODUCT_IDS, DISCOUNT_RATES, THRESHOLDS } from '../constants/index.js'
import {
  getProduct,
  getCartItems,
  setTotalAmount,
  setTotalQuantity,
  getElements,
} from '../store/state.js'
import { calculatePoints } from './points.js'
import { updateStockStatus } from './product.js'
import {
  updateSummaryDetails,
  updateTotal,
  updateDiscountInfo,
} from './orderSummary.js'
import { formatItemCount } from '../utils/formatters.js'
import { showElement, hideElement } from '../utils/dom.js'

export function calculateItemDiscount(productId, quantity) {
  if (quantity < THRESHOLDS.MIN_QUANTITY_FOR_DISCOUNT) return 0

  const discountMap = {
    [PRODUCT_IDS.KEYBOARD]: DISCOUNT_RATES.KEYBOARD,
    [PRODUCT_IDS.MOUSE]: DISCOUNT_RATES.MOUSE,
    [PRODUCT_IDS.MONITOR_ARM]: DISCOUNT_RATES.MONITOR_ARM,
    [PRODUCT_IDS.LAPTOP_POUCH]: DISCOUNT_RATES.LAPTOP_POUCH,
    [PRODUCT_IDS.SPEAKER]: DISCOUNT_RATES.SPEAKER,
  }

  return discountMap[productId] || 0
}

export function calculateTotalWithDiscounts(cartItems) {
  let subtotal = 0
  let totalWithItemDiscounts = 0
  let itemDiscounts = []
  let totalQuantity = 0

  Object.entries(cartItems).forEach(([productId, quantity]) => {
    const product = getProduct(productId)
    if (!product) return

    totalQuantity += quantity
    const itemTotal = product.price * quantity
    subtotal += itemTotal

    const discountRate = calculateItemDiscount(productId, quantity)
    if (discountRate > 0) {
      itemDiscounts.push({ name: product.name, discount: discountRate * 100 })
      totalWithItemDiscounts += itemTotal * (1 - discountRate)
    } else {
      totalWithItemDiscounts += itemTotal
    }
  })

  return { subtotal, totalWithItemDiscounts, itemDiscounts, totalQuantity }
}

export function applyBulkDiscount(amount, totalQuantity) {
  if (totalQuantity >= THRESHOLDS.MIN_QUANTITY_FOR_BULK) {
    return amount * (1 - DISCOUNT_RATES.BULK)
  }
  return amount
}

export function applyTuesdayDiscount(amount) {
  const isTuesday = new Date().getDay() === 2
  if (isTuesday && amount > 0) {
    return amount * (1 - DISCOUNT_RATES.TUESDAY)
  }
  return amount
}

export function updateCart() {
  const cartItems = getCartItems()
  const elements = getElements()

  let totalAmount = 0
  let totalQuantity = 0
  let subtotal = 0
  let itemDiscounts = []

  // 각 아이템별 계산
  Object.entries(cartItems).forEach(([productId, quantity]) => {
    const product = getProduct(productId)
    if (!product) return

    totalQuantity += quantity
    const itemTotal = product.price * quantity
    subtotal += itemTotal

    // 10개 이상일 때 개별 할인 적용
    let discountRate = 0
    if (quantity >= THRESHOLDS.MIN_QUANTITY_FOR_DISCOUNT) {
      const discountMap = {
        [PRODUCT_IDS.KEYBOARD]: DISCOUNT_RATES.KEYBOARD,
        [PRODUCT_IDS.MOUSE]: DISCOUNT_RATES.MOUSE,
        [PRODUCT_IDS.MONITOR_ARM]: DISCOUNT_RATES.MONITOR_ARM,
        [PRODUCT_IDS.LAPTOP_POUCH]: DISCOUNT_RATES.LAPTOP_POUCH,
        [PRODUCT_IDS.SPEAKER]: DISCOUNT_RATES.SPEAKER,
      }

      discountRate = discountMap[productId] || 0
      if (discountRate > 0) {
        itemDiscounts.push({ name: product.name, discount: discountRate * 100 })
      }
    }

    totalAmount += itemTotal * (1 - discountRate)

    // 10개 이상일 때 가격 강조
    const cartItem = document.getElementById(productId)
    if (cartItem) {
      const priceElement = cartItem.querySelector('.text-lg')
      if (priceElement) {
        priceElement.style.fontWeight = quantity >= 10 ? 'bold' : 'normal'
      }
    }
  })

  // 대량 구매 할인 (30개 이상이면 개별 할인 무시하고 25% 적용)
  const originalTotal = subtotal
  if (totalQuantity >= THRESHOLDS.MIN_QUANTITY_FOR_BULK) {
    totalAmount = subtotal * (1 - DISCOUNT_RATES.BULK)
  }

  // 화요일 할인
  const isTuesday = new Date().getDay() === 2
  if (isTuesday && totalAmount > 0) {
    totalAmount = totalAmount * (1 - DISCOUNT_RATES.TUESDAY)
    showElement(elements.tuesdaySpecial)
  } else {
    hideElement(elements.tuesdaySpecial)
  }

  // 할인율 계산
  const discountRate =
    subtotal > 0 ? (originalTotal - totalAmount) / originalTotal : 0

  // 상태 업데이트
  setTotalAmount(totalAmount)
  setTotalQuantity(totalQuantity)

  // UI 업데이트
  elements.itemCount.textContent = formatItemCount(totalQuantity)
  updateSummaryDetails(subtotal, itemDiscounts, isTuesday, totalQuantity)
  updateTotal(totalAmount)
  updateDiscountInfo(discountRate, originalTotal, totalAmount)

  // 포인트 계산
  calculatePoints()

  // 재고 상태 업데이트
  updateStockStatus()
}
