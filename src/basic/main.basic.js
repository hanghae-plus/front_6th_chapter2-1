import {
  PRODUCT_IDS,
  DISCOUNT_RATES,
  THRESHOLDS,
  POINTS,
  TIMERS,
} from './constants/index.js'
import {
  initializeState,
  getProducts,
  getProduct,
  getCartItems,
  getCartQuantity,
  getLastSelectedProductId,
  getTotalAmount,
  getTotalQuantity,
  updateProduct,
  setCartQuantity,
  setLastSelectedProductId,
  setTotalAmount,
  setTotalQuantity,
  setBonusPoints,
} from './store/state.js'
import { createElement, showElement, hideElement } from './utils/dom.js'
import {
  formatPrice,
  formatDiscountRate,
  formatItemCount,
  formatProductPrice,
  formatProductName,
} from './utils/formatters.js'

var stockInfo
var sel
var addBtn
var cartDisp

function main() {
  // 전역 상태 초기화
  initializeState()

  var root = document.getElementById('app')

  // DOM 생성을 유틸리티 함수로 변경
  var header = createElement('div', 'mb-8')
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `

  var gridContainer = createElement(
    'div',
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden',
  )
  var leftColumn = createElement(
    'div',
    'bg-white border border-gray-200 p-8 overflow-y-auto',
  )
  var selectorContainer = createElement(
    'div',
    'mb-6 pb-6 border-b border-gray-200',
  )

  sel = createElement(
    'select',
    'w-full p-3 border border-gray-300 rounded-lg text-base mb-3',
  )
  sel.id = 'product-select'

  addBtn = createElement(
    'button',
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all',
  )
  addBtn.id = 'add-to-cart'
  addBtn.textContent = 'Add to Cart'

  stockInfo = createElement(
    'div',
    'text-xs text-red-500 mt-3 whitespace-pre-line',
  )
  stockInfo.id = 'stock-status'

  selectorContainer.appendChild(sel)
  selectorContainer.appendChild(addBtn)
  selectorContainer.appendChild(stockInfo)
  leftColumn.appendChild(selectorContainer)

  cartDisp = createElement('div')
  cartDisp.id = 'cart-items'
  leftColumn.appendChild(cartDisp)

  var rightColumn = createElement(
    'div',
    'bg-black text-white p-8 flex flex-col',
  )
  rightColumn.innerHTML = `
    <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
    <div class="flex-1 flex flex-col">
      <div id="summary-details" class="space-y-3"></div>
      <div class="mt-auto">
        <div id="discount-info" class="mb-4"></div>
        <div id="cart-total" class="pt-5 border-t border-white/10">
          <div class="flex justify-between items-baseline">
            <span class="text-sm uppercase tracking-wider">Total</span>
            <div class="text-2xl tracking-tight">₩0</div>
          </div>
          <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">적립 포인트: 0p</div>
        </div>
        <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
          <div class="flex items-center gap-2">
            <span class="text-2xs">🎉</span>
            <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
          </div>
        </div>
      </div>
    </div>
    <button class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
      Proceed to Checkout
    </button>
    <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
      Free shipping on all orders.<br>
      <span id="points-notice">Earn loyalty points with purchase.</span>
    </p>
  `

  // 도움말 모달도 유틸리티로 생성
  var manualToggle = createElement(
    'button',
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50',
  )
  manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `

  var manualOverlay = createElement(
    'div',
    'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300',
  )
  var manualColumn = createElement(
    'div',
    'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300',
  )

  manualColumn.innerHTML = `
    <button class="absolute top-4 right-4 text-gray-500 hover:text-black" onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
    <h2 class="text-xl font-bold mb-4">📖 이용 안내</h2>
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">💰 할인 정책</h3>
      <div class="space-y-3">
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">개별 상품</p>
          <p class="text-gray-700 text-xs pl-2">
            • 키보드 10개↑: 10%<br>
            • 마우스 10개↑: 15%<br>
            • 모니터암 10개↑: 20%<br>
            • 스피커 10개↑: 25%
          </p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">전체 수량</p>
          <p class="text-gray-700 text-xs pl-2">• 30개 이상: 25%</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">특별 할인</p>
          <p class="text-gray-700 text-xs pl-2">
            • 화요일: +10%<br>
            • ⚡번개세일: 20%<br>
            • 💝추천할인: 5%
          </p>
        </div>
      </div>
    </div>
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">🎁 포인트 적립</h3>
      <div class="space-y-3">
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">기본</p>
          <p class="text-gray-700 text-xs pl-2">• 구매액의 0.1%</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">추가</p>
          <p class="text-gray-700 text-xs pl-2">
            • 화요일: 2배<br>
            • 키보드+마우스: +50p<br>
            • 풀세트: +100p<br>
            • 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
          </p>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-200 pt-4 mt-4">
      <p class="text-xs font-bold mb-1">💡 TIP</p>
      <p class="text-2xs text-gray-600 leading-relaxed">
        • 화요일 대량구매 = MAX 혜택<br>
        • ⚡+💝 중복 가능<br>
        • 상품4 = 품절
      </p>
    </div>
  `

  // 이벤트 핸들러 (유틸리티 함수 사용)
  manualToggle.onclick = function () {
    manualOverlay.classList.toggle('hidden')
    manualColumn.classList.toggle('translate-x-full')
  }

  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      hideElement(manualOverlay) // 유틸리티 함수 사용
      manualColumn.classList.add('translate-x-full')
    }
  }

  // DOM 조립
  gridContainer.appendChild(leftColumn)
  gridContainer.appendChild(rightColumn)
  manualOverlay.appendChild(manualColumn)

  root.appendChild(header)
  root.appendChild(gridContainer)
  root.appendChild(manualToggle)
  root.appendChild(manualOverlay)

  onUpdateSelectOptions()
  handleCalculateCartStuff()
  setupTimers()
}

function onUpdateSelectOptions() {
  const products = getProducts()

  sel.innerHTML = ''
  var totalStock = products.reduce((sum, product) => sum + product.stock, 0)

  if (totalStock < THRESHOLDS.TOTAL_STOCK_WARNING) {
    sel.style.borderColor = 'orange'
  } else {
    sel.style.borderColor = ''
  }

  products.forEach((product) => {
    var opt = createElement('option') // 유틸리티 함수 사용
    opt.value = product.id

    if (product.stock === 0) {
      opt.textContent = `${product.name} - ${formatPrice(product.price)} (품절)` // 포맷팅 함수 사용
      opt.disabled = true
      opt.className = 'text-gray-400'
    } else {
      // 포맷팅 함수 사용
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

  handleStockInfoUpdate()
}

function handleCalculateCartStuff() {
  const cartItems = getCartItems()

  var subTot = 0
  var itemDiscounts = []
  var totalQuantity = 0
  var totalAmount = 0

  Object.entries(cartItems).forEach(([productId, quantity]) => {
    const product = getProduct(productId)
    if (!product) return

    totalQuantity += quantity
    const itemTotal = product.price * quantity
    subTot += itemTotal

    var disc = 0
    if (quantity >= THRESHOLDS.MIN_QUANTITY_FOR_DISCOUNT) {
      if (product.id === PRODUCT_IDS.KEYBOARD) {
        disc = DISCOUNT_RATES.KEYBOARD
      } else if (product.id === PRODUCT_IDS.MOUSE) {
        disc = DISCOUNT_RATES.MOUSE
      } else if (product.id === PRODUCT_IDS.MONITOR_ARM) {
        disc = DISCOUNT_RATES.MONITOR_ARM
      } else if (product.id === PRODUCT_IDS.LAPTOP_POUCH) {
        disc = DISCOUNT_RATES.LAPTOP_POUCH
      } else if (product.id === PRODUCT_IDS.SPEAKER) {
        disc = DISCOUNT_RATES.SPEAKER
      }

      if (disc > 0) {
        itemDiscounts.push({ name: product.name, discount: disc * 100 })
      }
    }

    totalAmount += itemTotal * (1 - disc)

    // DOM 스타일링에서도 유틸리티 사용
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
  if (totalQuantity >= THRESHOLDS.MIN_QUANTITY_FOR_BULK) {
    totalAmount = subTot * (1 - DISCOUNT_RATES.BULK)
  }

  const isTuesday = new Date().getDay() === 2
  const tuesdaySpecial = document.getElementById('tuesday-special')

  if (isTuesday && totalAmount > 0) {
    totalAmount = totalAmount * (1 - DISCOUNT_RATES.TUESDAY)
    showElement(tuesdaySpecial) // 유틸리티 함수 사용
  } else {
    hideElement(tuesdaySpecial) // 유틸리티 함수 사용
  }

  const discountRate =
    originalTotal > 0 ? (originalTotal - totalAmount) / originalTotal : 0

  setTotalAmount(totalAmount)
  setTotalQuantity(totalQuantity)

  // 포맷팅 함수 사용
  document.getElementById('item-count').textContent =
    formatItemCount(totalQuantity)

  updateSummaryDetails(subTot, itemDiscounts, isTuesday, totalQuantity)
  updateTotal(totalAmount)
  updateDiscountInfo(discountRate, originalTotal, totalAmount)

  doRenderBonusPoints()
  handleStockInfoUpdate()
}

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

  // 각 아이템 표시 (포맷팅 함수 사용)
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

  // 소계 (포맷팅 함수 사용)
  summaryDetails.innerHTML += `
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>${formatPrice(subtotal)}</span>
    </div>
  `

  // 할인 표시
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
    totalDiv.textContent = formatPrice(amount) // 포맷팅 함수 사용
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

function doUpdatePricesInCart() {
  const cartElements = cartDisp.children

  for (let i = 0; i < cartElements.length; i++) {
    const itemElement = cartElements[i]
    const productId = itemElement.id
    const product = getProduct(productId)

    if (product) {
      const priceDiv = itemElement.querySelector('.text-lg')
      const nameDiv = itemElement.querySelector('h3')

      // 포맷팅 함수 사용
      priceDiv.innerHTML = formatProductPrice(product)
      nameDiv.textContent = formatProductName(product)
    }
  }

  handleCalculateCartStuff()
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

function handleStockInfoUpdate() {
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
      onUpdateSelectOptions()
      doUpdatePricesInCart()
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

      onUpdateSelectOptions()
      doUpdatePricesInCart()
    }, TIMERS.RECOMMEND_SALE_INTERVAL)
  }, Math.random() * TIMERS.RECOMMEND_SALE_MAX_DELAY)
}

main()

// 이벤트 핸들러들 (포맷팅 함수 사용으로 업데이트)
addBtn.addEventListener('click', function () {
  var selItem = sel.value
  const product = getProduct(selItem)

  if (!product || product.stock === 0) return

  var existingItem = document.getElementById(product.id)

  if (existingItem) {
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
    // 새 아이템 생성 (포맷팅 함수 사용)
    var newItem = createElement(
      'div',
      'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0',
    )
    newItem.id = product.id

    newItem.innerHTML = `
      <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">${formatProductName(product)}</h3>
        <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p class="text-xs text-black mb-3">${formatProductPrice(product)}</p>
        <div class="flex items-center gap-4">
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1">−</button>
          <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1">+</button>
        </div>
      </div>
      <div class="text-right">
        <div class="text-lg mb-2 tracking-tight tabular-nums">${formatProductPrice(product)}</div>
        <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${product.id}">Remove</a>
      </div>
    `

    cartDisp.appendChild(newItem)
    setCartQuantity(selItem, 1)
    updateProduct(selItem, { stock: product.stock - 1 })
  }

  setLastSelectedProductId(selItem)
  handleCalculateCartStuff()
  onUpdateSelectOptions()
})

cartDisp.addEventListener('click', function (event) {
  var tgt = event.target

  if (
    tgt.classList.contains('quantity-change') ||
    tgt.classList.contains('remove-item')
  ) {
    var prodId = tgt.dataset.productId
    var itemElem = document.getElementById(prodId)
    var product = getProduct(prodId)

    if (tgt.classList.contains('quantity-change')) {
      var qtyChange = parseInt(tgt.dataset.change)
      const qtyElem = itemElem.querySelector('.quantity-number')
      var currentQty = parseInt(qtyElem.textContent)
      var newQty = currentQty + qtyChange

      if (newQty > 0 && newQty <= product.stock + currentQty) {
        qtyElem.textContent = newQty
        setCartQuantity(prodId, newQty)
        updateProduct(prodId, { stock: product.stock - qtyChange })
      } else if (newQty <= 0) {
        setCartQuantity(prodId, 0)
        updateProduct(prodId, { stock: product.stock + currentQty })
        itemElem.remove()
      } else {
        alert('재고가 부족합니다.')
      }
    } else if (tgt.classList.contains('remove-item')) {
      const qtyElem = itemElem.querySelector('.quantity-number')
      var remQty = parseInt(qtyElem.textContent)
      setCartQuantity(prodId, 0)
      updateProduct(prodId, { stock: product.stock + remQty })
      itemElem.remove()
    }

    handleCalculateCartStuff()
    onUpdateSelectOptions()
  }
})
