import { getCartItems, getProduct, getElements } from '../store/state.js'
import { formatPrice, formatDiscountRate } from '../utils/formatters.js'
import { THRESHOLDS } from '../constants/index.js'

export function updateSummaryDetails(
  subtotal,
  itemDiscounts,
  isTuesday,
  totalQuantity,
) {
  const elements = getElements()
  const summaryDetails = elements.summaryDetails
  const cartItems = getCartItems()

  summaryDetails.innerHTML = ''

  if (subtotal === 0) return

  // 각 아이템 표시
  Object.entries(cartItems).forEach(([productId, quantity]) => {
    const product = getProduct(productId)
    if (!product) return

    const itemTotal = product.price * quantity

    summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${product.name} x ${quantity}</span>
          <span>${formatPrice(itemTotal)}</span>
        </div>
      `
  })

  // 소계
  summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>${formatPrice(subtotal)}</span>
      </div>
    `

  // 할인 표시 - 대량구매 할인이 있으면 개별 할인 표시하지 않음
  if (totalQuantity >= THRESHOLDS.MIN_QUANTITY_FOR_BULK) {
    summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `
  } else if (itemDiscounts.length > 0) {
    itemDiscounts.forEach((item) => {
      summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `
    })
  }

  if (isTuesday && totalQuantity > 0) {
    summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-10%</span>
        </div>
      `
  }

  // 배송비
  summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `
}

export function updateTotal(amount) {
  const elements = getElements()
  const totalDiv = elements.cartTotal.querySelector('.text-2xl')
  if (totalDiv) {
    totalDiv.textContent = formatPrice(amount)
  }
}

export function updateDiscountInfo(discountRate, originalTotal, totalAmount) {
  const elements = getElements()
  const discountInfo = elements.discountInfo

  discountInfo.innerHTML = ''

  if (discountRate > 0 && totalAmount > 0) {
    const savedAmount = originalTotal - totalAmount
    discountInfo.innerHTML = `
        <div class="bg-green-500/20 rounded-lg p-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
            <span class="text-sm font-medium text-green-400">${formatDiscountRate(discountRate)}</span>
          </div>
          <div class="text-2xs text-gray-300">${formatPrice(savedAmount)} 할인되었습니다</div>
        </div>
      `
  }
}
