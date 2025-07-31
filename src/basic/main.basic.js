import {
  PRODUCT_IDS,
  DISCOUNT_RATES,
  THRESHOLDS,
  TIMERS,
  POINTS,
} from './constants/index.js'
import {
  initializeState,
  getProducts,
  getProduct,
  getCartItems,
  getLastSelectedProductId,
  updateProduct,
  setLastSelectedProductId,
  getTotalAmount,
  getTotalQuantity,
  setBonusPoints,
  getCartQuantity,
  setCartQuantity,
} from './store/state.js'
import { createElement } from './utils/dom.js'
import {
  formatItemCount,
  formatPrice,
  formatDiscountRate,
  formatProductPrice,
  formatProductName,
} from './utils/formatters.js'
import { Header } from './components/Header.js'
import { CartItem } from './components/CartItem.js'
import { ProductContainer } from './components/ProductContainer.js'
import { OrderSummary } from './components/OrderSummary.js'
import { HelpModal } from './components/HelpModal.js'

var sel
var addBtn
var stockInfo
var cartDisp

function main() {
  initializeState()

  var root = document.getElementById('app')

  // 컴포넌트 사용
  const header = Header()
  const gridContainer = createElement(
    'div',
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden',
  )

  const leftColumn = createElement(
    'div',
    'bg-white border border-gray-200 p-8 overflow-y-auto',
  )
  const productContainer = ProductContainer()
  leftColumn.appendChild(productContainer)

  cartDisp = createElement('div')
  cartDisp.id = 'cart-items'
  leftColumn.appendChild(cartDisp)

  const rightColumn = OrderSummary()
  const { toggleButton, overlay } = HelpModal()

  // DOM 조립
  gridContainer.appendChild(leftColumn)
  gridContainer.appendChild(rightColumn)

  root.appendChild(header)
  root.appendChild(gridContainer)
  root.appendChild(toggleButton)
  root.appendChild(overlay)

  // DOM 요소 참조
  sel = document.getElementById('product-select')
  addBtn = document.getElementById('add-to-cart')
  stockInfo = document.getElementById('stock-status')

  // 초기화
  updateProductOptions()
  updateCart()
  setupEventHandlers()
  setupTimers()
}

// 장바구니 업데이트 함수 (할인 계산 로직 포함)
function updateCart() {
  const cartItems = getCartItems()

  var subTot = 0
  var itemDiscounts = []
  var totalQuantity = 0
  var totalAmount = 0

  // 각 아이템 계산
  Object.entries(cartItems).forEach(([productId, quantity]) => {
    const product = getProduct(productId)
    if (!product) return

    totalQuantity += quantity
    const itemTotal = product.price * quantity
    subTot += itemTotal

    var disc = 0
    if (quantity >= THRESHOLDS.MIN_QUANTITY_FOR_DISCOUNT) {
      const discountMap = {
        [PRODUCT_IDS.KEYBOARD]: DISCOUNT_RATES.KEYBOARD,
        [PRODUCT_IDS.MOUSE]: DISCOUNT_RATES.MOUSE,
        [PRODUCT_IDS.MONITOR_ARM]: DISCOUNT_RATES.MONITOR_ARM,
        [PRODUCT_IDS.LAPTOP_POUCH]: DISCOUNT_RATES.LAPTOP_POUCH,
        [PRODUCT_IDS.SPEAKER]: DISCOUNT_RATES.SPEAKER,
      }

      disc = discountMap[productId] || 0
      if (disc > 0) {
        itemDiscounts.push({ name: product.name, discount: disc * 100 })
      }
    }

    totalAmount += itemTotal * (1 - disc)

    // DOM 스타일링
    const cartItem = document.getElementById(productId)
    if (cartItem) {
      const priceElement = cartItem.querySelector('.text-lg')
      if (priceElement) {
        priceElement.style.fontWeight =
          quantity >= THRESHOLDS.MIN_QUANTITY_FOR_DISCOUNT ? 'bold' : 'normal'
      }
    }
  })

  const originalTotal = subTot

  // 대량 구매 할인
  if (totalQuantity >= THRESHOLDS.MIN_QUANTITY_FOR_BULK) {
    totalAmount = subTot * (1 - DISCOUNT_RATES.BULK)
  }

  // 화요일 할인
  const isTuesday = new Date().getDay() === 2
  const tuesdaySpecial = document.getElementById('tuesday-special')

  if (isTuesday && totalAmount > 0) {
    totalAmount = totalAmount * (1 - DISCOUNT_RATES.TUESDAY)
    tuesdaySpecial.classList.remove('hidden')
  } else {
    tuesdaySpecial.classList.add('hidden')
  }

  const discountRate =
    originalTotal > 0 ? (originalTotal - totalAmount) / originalTotal : 0

  // UI 업데이트
  document.getElementById('item-count').textContent =
    formatItemCount(totalQuantity)
  updateSummaryDetails(subTot, itemDiscounts, isTuesday, totalQuantity)
  updateTotal(totalAmount)
  updateDiscountInfo(discountRate, originalTotal, totalAmount)

  doRenderBonusPoints() // 기존 함수 사용 (서비스 대신)
  updateStockStatus()
}

function setupEventHandlers() {
  // 장바구니 추가 버튼
  addBtn.addEventListener('click', function () {
    const selItem = sel.value
    const product = getProduct(selItem)

    if (!product || product.stock === 0) return

    var existingItem = document.getElementById(product.id)

    if (existingItem) {
      // 기존 아이템 수량 증가
      var qtyElem = existingItem.querySelector('.quantity-number')
      var newQty = parseInt(qtyElem.textContent) + 1

      if (product.stock > 0) {
        qtyElem.textContent = newQty
        const currentQuantity = getCartQuantity(selItem)
        setCartQuantity(selItem, currentQuantity + 1)
        updateProduct(selItem, { stock: product.stock - 1 })
      } else {
        alert('재고가 부족합니다.')
        return
      }
    } else {
      // CartItem 컴포넌트 사용해서 새 아이템 생성
      const cartItemElement = CartItem(product)
      cartDisp.appendChild(cartItemElement)
      setCartQuantity(selItem, 1)
      updateProduct(selItem, { stock: product.stock - 1 })
    }

    setLastSelectedProductId(selItem)
    updateCart()
    updateProductOptions()
  })

  // 장바구니 아이템 이벤트
  cartDisp.addEventListener('click', function (event) {
    const tgt = event.target

    if (tgt.classList.contains('quantity-change')) {
      const prodId = tgt.dataset.productId
      const qtyChange = parseInt(tgt.dataset.change)

      // 직접 수량 변경 처리 (서비스 대신)
      const product = getProduct(prodId)
      const itemElem = document.getElementById(prodId)
      const qtyElem = itemElem.querySelector('.quantity-number')
      const currentQty = parseInt(qtyElem.textContent)
      const newQty = currentQty + qtyChange

      if (newQty > 0 && newQty <= product.stock + currentQty) {
        qtyElem.textContent = newQty
        setCartQuantity(prodId, newQty)
        updateProduct(prodId, { stock: product.stock - qtyChange })
      } else if (newQty <= 0) {
        // 수량이 0이 되면 제거
        setCartQuantity(prodId, 0)
        updateProduct(prodId, { stock: product.stock + currentQty })
        itemElem.remove()
      } else {
        alert('재고가 부족합니다.')
      }

      updateCart()
      updateProductOptions()
    } else if (tgt.classList.contains('remove-item')) {
      const prodId = tgt.dataset.productId

      // 직접 제거 처리 (서비스 대신)
      const product = getProduct(prodId)
      const itemElem = document.getElementById(prodId)
      const quantity = getCartQuantity(prodId)

      updateProduct(prodId, { stock: product.stock + quantity })
      setCartQuantity(prodId, 0)
      itemElem.remove()

      updateCart()
      updateProductOptions()
    }
  })
}

function setupTimers() {
  // 번개세일 타이머
  const lightningDelay = Math.random() * TIMERS.LIGHTNING_SALE_MAX_DELAY
  setTimeout(() => {
    setInterval(function () {
      const products = getProducts()
      const availableProducts = products.filter((p) => p.stock > 0 && !p.onSale)

      if (availableProducts.length === 0) return

      const luckyIdx = Math.floor(Math.random() * availableProducts.length)
      const luckyItem = availableProducts[luckyIdx]

      updateProduct(luckyItem.id, {
        price: Math.round(
          luckyItem.originalPrice * (1 - DISCOUNT_RATES.LIGHTNING),
        ),
        onSale: true,
      })

      alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!')
      updateProductOptions()
      updateCartPrices()
    }, TIMERS.LIGHTNING_SALE_INTERVAL)
  }, lightningDelay)

  // 추천세일 타이머
  setTimeout(function () {
    setInterval(function () {
      const cartItems = getCartItems()
      const lastSelectedId = getLastSelectedProductId()

      if (Object.keys(cartItems).length === 0 || !lastSelectedId) return

      const products = getProducts()
      const recommendableProducts = products.filter(
        (p) => p.id !== lastSelectedId && p.stock > 0 && !p.recommendSale,
      )

      if (recommendableProducts.length === 0) return

      const suggest = recommendableProducts[0]
      alert(
        '💝 ' + suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
      )

      updateProduct(suggest.id, {
        price: Math.round(suggest.price * (1 - DISCOUNT_RATES.RECOMMEND)),
        recommendSale: true,
      })

      updateProductOptions()
      updateCartPrices()
    }, TIMERS.RECOMMEND_SALE_INTERVAL)
  }, Math.random() * TIMERS.RECOMMEND_SALE_MAX_DELAY)
}

// 기존 함수들 (아직 서비스로 이동하지 않음)
function updateProductOptions() {
  const products = getProducts()

  // 현재 선택된 값 저장
  const currentValue = sel.value

  sel.innerHTML = ''
  var totalStock = products.reduce((sum, product) => sum + product.stock, 0)

  if (totalStock < THRESHOLDS.TOTAL_STOCK_WARNING) {
    sel.style.borderColor = 'orange'
  } else {
    sel.style.borderColor = ''
  }

  products.forEach((product) => {
    var opt = createElement('option')
    opt.value = product.id

    if (product.stock === 0) {
      opt.textContent = `${product.name} - ${formatPrice(product.price)} (품절)`
      opt.disabled = true
      opt.className = 'text-gray-400'
    } else {
      if (product.onSale && product.recommendSale) {
        opt.textContent = `⚡💝${product.name} - ${formatPrice(product.originalPrice)} → ${formatPrice(product.price)} (25% SUPER SALE!)`
        opt.className = 'text-purple-600 font-bold'
      } else if (product.onSale) {
        opt.textContent = `⚡${product.name} - ${formatPrice(product.originalPrice)} → ${formatPrice(product.price)} (20% SALE!)`
        opt.className = 'text-red-500 font-bold'
      } else if (product.recommendSale) {
        opt.textContent = `💝${product.name} - ${formatPrice(product.originalPrice)} → ${formatPrice(product.price)} (5% 추천할인!)`
        opt.className = 'text-blue-500 font-bold'
      } else {
        opt.textContent = `${product.name} - ${formatPrice(product.price)}`
      }
    }

    sel.appendChild(opt)
  })

  // 이전에 선택된 값 복원
  if (currentValue) {
    sel.value = currentValue
  }

  updateStockStatus()
}

function updateStockStatus() {
  const products = getProducts()
  var stockMsg = ''

  products.forEach(function (item) {
    if (item.stock < THRESHOLDS.LOW_STOCK) {
      if (item.stock > 0) {
        stockMsg += `${item.name}: 재고 부족 (${item.stock}개 남음)\n`
      } else {
        stockMsg += `${item.name}: 품절\n`
      }
    }
  })

  stockInfo.textContent = stockMsg
}

// UI 업데이트 함수들
function updateSummaryDetails(
  subtotal,
  itemDiscounts,
  isTuesday,
  totalQuantity,
) {
  const summaryDetails = document.getElementById('summary-details')
  const cartItems = getCartItems()

  summaryDetails.innerHTML = ''

  if (subtotal === 0) return

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

  summaryDetails.innerHTML += `
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>${formatPrice(subtotal)}</span>
    </div>
  `

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

  summaryDetails.innerHTML += `
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `
}

function updateTotal(amount) {
  const totalDiv = document.querySelector('#cart-total .text-2xl')
  if (totalDiv) {
    totalDiv.textContent = formatPrice(amount)
  }
}

function updateDiscountInfo(discountRate, originalTotal, totalAmount) {
  const discountInfo = document.getElementById('discount-info')
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

function updateCartPrices() {
  const cartElements = cartDisp.children

  for (let i = 0; i < cartElements.length; i++) {
    const itemElement = cartElements[i]
    const productId = itemElement.id
    const product = getProduct(productId)

    if (product) {
      const priceDiv = itemElement.querySelector('.text-lg')
      const nameDiv = itemElement.querySelector('h3')

      priceDiv.innerHTML = formatProductPrice(product)
      nameDiv.textContent = formatProductName(product)
    }
  }

  updateCart()
}

function doRenderBonusPoints() {
  const cartItems = getCartItems()

  if (Object.keys(cartItems).length === 0) {
    document.getElementById('loyalty-points').style.display = 'none'
    return
  }

  const totalAmount = getTotalAmount()
  const totalQuantity = getTotalQuantity()

  let basePoints = Math.floor(totalAmount / 1000)
  let finalPoints = basePoints
  let pointsDetail = []

  if (basePoints > 0) {
    pointsDetail.push(`기본: ${basePoints}p`)
  }

  const isTuesday = new Date().getDay() === 2
  if (isTuesday && basePoints > 0) {
    finalPoints = basePoints * 2
    pointsDetail.push('화요일 2배')
  }

  const hasKeyboard = cartItems[PRODUCT_IDS.KEYBOARD]
  const hasMouse = cartItems[PRODUCT_IDS.MOUSE]
  const hasMonitorArm = cartItems[PRODUCT_IDS.MONITOR_ARM]

  if (hasKeyboard && hasMouse) {
    finalPoints += POINTS.BONUS.SET
    pointsDetail.push('키보드+마우스 세트 +50p')
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += POINTS.BONUS.FULL_SET
    pointsDetail.push('풀세트 구매 +100p')
  }

  if (totalQuantity >= 30) {
    finalPoints += POINTS.BONUS.BULK_30
    pointsDetail.push('대량구매(30개+) +100p')
  } else if (totalQuantity >= 20) {
    finalPoints += POINTS.BONUS.BULK_20
    pointsDetail.push('대량구매(20개+) +50p')
  } else if (totalQuantity >= 10) {
    finalPoints += POINTS.BONUS.BULK_10
    pointsDetail.push('대량구매(10개+) +20p')
  }

  setBonusPoints(finalPoints)

  const loyaltyPointsDiv = document.getElementById('loyalty-points')
  if (finalPoints > 0) {
    loyaltyPointsDiv.innerHTML =
      `<div>적립 포인트: <span class="font-bold">${finalPoints}p</span></div>` +
      `<div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>`
    loyaltyPointsDiv.style.display = 'block'
  } else {
    loyaltyPointsDiv.textContent = '적립 포인트: 0p'
    loyaltyPointsDiv.style.display = 'block'
  }
}

main()
