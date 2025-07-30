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

var stockInfo
var sel
var addBtn
var cartDisp
var sum

function main() {
  // 전역 상태 초기화
  initializeState()

  var header
  var gridContainer
  var leftColumn
  var selectorContainer
  var rightColumn
  var manualToggle
  var manualOverlay
  var manualColumn
  var lightningDelay

  var root = document.getElementById('app')
  header = document.createElement('div')
  header.className = 'mb-8'
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `
  sel = document.createElement('select')
  sel.id = 'product-select'
  gridContainer = document.createElement('div')
  leftColumn = document.createElement('div')
  leftColumn['className'] =
    'bg-white border border-gray-200 p-8 overflow-y-auto'
  selectorContainer = document.createElement('div')
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200'
  sel.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3'
  gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden'
  addBtn = document.createElement('button')
  stockInfo = document.createElement('div')
  addBtn.id = 'add-to-cart'
  stockInfo.id = 'stock-status'
  stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line'
  addBtn.innerHTML = 'Add to Cart'
  addBtn.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all'
  selectorContainer.appendChild(sel)
  selectorContainer.appendChild(addBtn)
  selectorContainer.appendChild(stockInfo)
  leftColumn.appendChild(selectorContainer)
  cartDisp = document.createElement('div')
  leftColumn.appendChild(cartDisp)
  cartDisp.id = 'cart-items'
  rightColumn = document.createElement('div')
  rightColumn.className = 'bg-black text-white p-8 flex flex-col'
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
  sum = rightColumn.querySelector('#cart-total')
  manualToggle = document.createElement('button')
  manualToggle.onclick = function () {
    manualOverlay.classList.toggle('hidden')
    manualColumn.classList.toggle('translate-x-full')
  }
  manualToggle.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50'
  manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `
  manualOverlay = document.createElement('div')
  manualOverlay.className =
    'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300'
  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden')
      manualColumn.classList.add('translate-x-full')
    }
  }
  manualColumn = document.createElement('div')
  manualColumn.className =
    'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300'
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
  gridContainer.appendChild(leftColumn)
  gridContainer.appendChild(rightColumn)
  manualOverlay.appendChild(manualColumn)
  root.appendChild(header)
  root.appendChild(gridContainer)
  root.appendChild(manualToggle)
  root.appendChild(manualOverlay)

  onUpdateSelectOptions()
  handleCalculateCartStuff()

  // 번개세일 타이머 (state 사용)
  lightningDelay = Math.random() * TIMERS.LIGHTNING_SALE_MAX_DELAY
  setTimeout(() => {
    setInterval(function () {
      const products = getProducts()
      const availableProducts = products.filter((p) => p.stock > 0 && !p.onSale)

      if (availableProducts.length === 0) return

      const luckyIdx = Math.floor(Math.random() * availableProducts.length)
      const luckyItem = availableProducts[luckyIdx]

      // state 업데이트 방식으로 변경
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

  // 추천세일 타이머 (state 사용)
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

function onUpdateSelectOptions() {
  const products = getProducts() // state에서 가져옴
  var totalStock
  var opt
  var discountText

  sel.innerHTML = ''
  totalStock = 0

  for (var idx = 0; idx < products.length; idx++) {
    var _p = products[idx]
    totalStock = totalStock + _p.stock // 속성명 변경: q -> stock
  }

  for (var i = 0; i < products.length; i++) {
    ;(function () {
      var item = products[i]
      opt = document.createElement('option')
      opt.value = item.id
      discountText = ''
      if (item.onSale) discountText += ' ⚡SALE'
      if (item.recommendSale) discountText += ' 💝추천' // suggestSale -> recommendSale
      if (item.stock === 0) {
        // q -> stock
        opt.textContent =
          item.name + ' - ' + item.price + '원 (품절)' + discountText // val -> price
        opt.disabled = true
        opt.className = 'text-gray-400'
      } else {
        if (item.onSale && item.recommendSale) {
          opt.textContent =
            '⚡💝' +
            item.name +
            ' - ' +
            item.originalPrice +
            '원 → ' +
            item.price +
            '원 (25% SUPER SALE!)' // originalVal -> originalPrice, val -> price
          opt.className = 'text-purple-600 font-bold'
        } else if (item.onSale) {
          opt.textContent =
            '⚡' +
            item.name +
            ' - ' +
            item.originalPrice +
            '원 → ' +
            item.price +
            '원 (20% SALE!)'
          opt.className = 'text-red-500 font-bold'
        } else if (item.recommendSale) {
          opt.textContent =
            '💝' +
            item.name +
            ' - ' +
            item.originalPrice +
            '원 → ' +
            item.price +
            '원 (5% 추천할인!)'
          opt.className = 'text-blue-500 font-bold'
        } else {
          opt.textContent = item.name + ' - ' + item.price + '원' + discountText
        }
      }
      sel.appendChild(opt)
    })()
  }

  if (totalStock < THRESHOLDS.TOTAL_STOCK_WARNING) {
    // 상수 사용
    sel.style.borderColor = 'orange'
  } else {
    sel.style.borderColor = ''
  }
}

function handleCalculateCartStuff() {
  const cartItems = getCartItems() // state에서 가져옴
  const products = getProducts()
  var subTot
  var itemDiscounts
  var lowStockItems
  var idx
  var originalTotal
  var savedAmount
  var summaryDetails
  var totalDiv
  var loyaltyPointsDiv
  var points
  var discountInfoDiv
  var itemCountElement
  var previousCount
  var stockMsg

  var totalAmount = 0 // state에서 관리하는 값 로컬 변수로
  var totalQuantity = 0 // state에서 관리하는 값 로컬 변수로

  originalTotal = totalAmount
  subTot = 0
  itemDiscounts = []
  lowStockItems = []

  for (idx = 0; idx < products.length; idx++) {
    if (products[idx].stock < THRESHOLDS.LOW_STOCK && products[idx].stock > 0) {
      // q -> stock, 상수 사용
      lowStockItems.push(products[idx].name)
    }
  }

  // cartItems는 이제 객체이므로 처리 방식 변경
  Object.entries(cartItems).forEach(([productId, quantity]) => {
    const product = getProduct(productId) // state에서 제품 정보 가져오기
    if (!product) return

    var itemTot
    var disc
    itemTot = product.price * quantity // val -> price
    disc = 0
    totalQuantity += quantity // itemCnt -> totalQuantity
    subTot += itemTot

    // DOM 요소 강조 (10개 이상일 때)
    const cartItem = document.getElementById(productId)
    if (cartItem) {
      var priceElems = cartItem.querySelectorAll('.text-lg, .text-xs')
      priceElems.forEach(function (elem) {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight =
            quantity >= THRESHOLDS.MIN_QUANTITY_FOR_DISCOUNT ? 'bold' : 'normal' // 상수 사용
        }
      })
    }

    if (quantity >= THRESHOLDS.MIN_QUANTITY_FOR_DISCOUNT) {
      // 상수 사용
      if (product.id === PRODUCT_IDS.KEYBOARD) {
        // 상수 사용
        disc = DISCOUNT_RATES.KEYBOARD // 상수 사용
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
    totalAmount += itemTot * (1 - disc)
  })

  let discRate = 0
  originalTotal = subTot
  if (totalQuantity >= THRESHOLDS.MIN_QUANTITY_FOR_BULK) {
    // 상수 사용
    totalAmount = subTot * (1 - DISCOUNT_RATES.BULK) // 상수 사용
    discRate = DISCOUNT_RATES.BULK
  } else {
    discRate = (subTot - totalAmount) / subTot
  }

  const today = new Date()
  var isTuesday = today.getDay() === 2
  var tuesdaySpecial = document.getElementById('tuesday-special')
  if (isTuesday) {
    if (totalAmount > 0) {
      totalAmount = totalAmount * (1 - DISCOUNT_RATES.TUESDAY) // 상수 사용
      discRate = 1 - totalAmount / originalTotal
      tuesdaySpecial.classList.remove('hidden')
    } else {
      tuesdaySpecial.classList.add('hidden')
    }
  } else {
    tuesdaySpecial.classList.add('hidden')
  }

  // state 업데이트
  setTotalAmount(totalAmount)
  setTotalQuantity(totalQuantity)

  document.getElementById('item-count').textContent =
    '🛍️ ' + totalQuantity + ' items in cart'
  summaryDetails = document.getElementById('summary-details')
  summaryDetails.innerHTML = ''

  if (subTot > 0) {
    Object.entries(cartItems).forEach(([productId, quantity]) => {
      const product = getProduct(productId)
      if (!product) return

      var itemTotal = product.price * quantity
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${product.name} x ${quantity}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `
    })

    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
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
      itemDiscounts.forEach(function (item) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `
      })
    }

    if (isTuesday) {
      if (totalAmount > 0) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `
      }
    }

    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `
  }

  totalDiv = sum.querySelector('.text-2xl')
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(totalAmount).toLocaleString()
  }

  loyaltyPointsDiv = document.getElementById('loyalty-points')
  if (loyaltyPointsDiv) {
    points = Math.floor(totalAmount / 1000)
    if (points > 0) {
      loyaltyPointsDiv.textContent = '적립 포인트: ' + points + 'p'
      loyaltyPointsDiv.style.display = 'block'
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p'
      loyaltyPointsDiv.style.display = 'block'
    }
  }

  discountInfoDiv = document.getElementById('discount-info')
  discountInfoDiv.innerHTML = ''
  if (discRate > 0 && totalAmount > 0) {
    savedAmount = originalTotal - totalAmount
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `
  }

  itemCountElement = document.getElementById('item-count')
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0)
    itemCountElement.textContent = '🛍️ ' + totalQuantity + ' items in cart'
    if (previousCount !== totalQuantity) {
      itemCountElement.setAttribute('data-changed', 'true')
    }
  }

  stockMsg = ''
  for (var stockIdx = 0; stockIdx < products.length; stockIdx++) {
    var item = products[stockIdx]
    if (item.stock < THRESHOLDS.LOW_STOCK) {
      // q -> stock, 상수 사용
      if (item.stock > 0) {
        stockMsg =
          stockMsg + item.name + ': 재고 부족 (' + item.stock + '개 남음)\n'
      } else {
        stockMsg = stockMsg + item.name + ': 품절\n'
      }
    }
  }
  stockInfo.textContent = stockMsg
  handleStockInfoUpdate()
  doRenderBonusPoints()
}

var doRenderBonusPoints = function () {
  const cartItems = getCartItems() // state에서 가져옴
  var basePoints
  var finalPoints
  var pointsDetail
  var hasKeyboard
  var hasMouse
  var hasMonitorArm

  if (Object.keys(cartItems).length === 0) {
    // cartDisp.children -> cartItems 객체 확인
    document.getElementById('loyalty-points').style.display = 'none'
    return
  }

  const totalAmount = getTotalAmount() // state에서 가져옴
  const totalQuantity = getTotalQuantity() // state에서 가져옴

  basePoints = Math.floor(totalAmount / 1000)
  finalPoints = 0
  pointsDetail = []

  if (basePoints > 0) {
    finalPoints = basePoints
    pointsDetail.push('기본: ' + basePoints + 'p')
  }

  if (new Date().getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2
      pointsDetail.push('화요일 2배')
    }
  }

  hasKeyboard = false
  hasMouse = false
  hasMonitorArm = false

  // cartItems 객체에서 제품 확인
  if (cartItems[PRODUCT_IDS.KEYBOARD]) {
    // 상수 사용
    hasKeyboard = true
  }
  if (cartItems[PRODUCT_IDS.MOUSE]) {
    hasMouse = true
  }
  if (cartItems[PRODUCT_IDS.MONITOR_ARM]) {
    hasMonitorArm = true
  }

  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + POINTS.BONUS.SET // 상수 사용
    pointsDetail.push('키보드+마우스 세트 +50p')
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + POINTS.BONUS.FULL_SET // 상수 사용
    pointsDetail.push('풀세트 구매 +100p')
  }

  if (totalQuantity >= 30) {
    finalPoints = finalPoints + POINTS.BONUS.BULK_30 // 상수 사용
    pointsDetail.push('대량구매(30개+) +100p')
  } else {
    if (totalQuantity >= 20) {
      finalPoints = finalPoints + POINTS.BONUS.BULK_20 // 상수 사용
      pointsDetail.push('대량구매(20개+) +50p')
    } else {
      if (totalQuantity >= 10) {
        finalPoints = finalPoints + POINTS.BONUS.BULK_10 // 상수 사용
        pointsDetail.push('대량구매(10개+) +20p')
      }
    }
  }

  setBonusPoints(finalPoints) // state 업데이트

  var ptsTag = document.getElementById('loyalty-points')
  if (ptsTag) {
    if (finalPoints > 0) {
      ptsTag.innerHTML =
        '<div>적립 포인트: <span class="font-bold">' +
        finalPoints +
        'p</span></div>' +
        '<div class="text-2xs opacity-70 mt-1">' +
        pointsDetail.join(', ') +
        '</div>'
      ptsTag.style.display = 'block'
    } else {
      ptsTag.textContent = '적립 포인트: 0p'
      ptsTag.style.display = 'block'
    }
  }
}

var handleStockInfoUpdate = function () {
  const products = getProducts() // state에서 가져옴
  var infoMsg = ''

  products.forEach(function (item) {
    if (item.stock < THRESHOLDS.LOW_STOCK) {
      // q -> stock, 상수 사용
      if (item.stock > 0) {
        infoMsg =
          infoMsg + item.name + ': 재고 부족 (' + item.stock + '개 남음)\n'
      } else {
        infoMsg = infoMsg + item.name + ': 품절\n'
      }
    }
  })
  stockInfo.textContent = infoMsg
}

function doUpdatePricesInCart() {
  var cartItems

  cartItems = cartDisp.children
  for (var i = 0; i < cartItems.length; i++) {
    var itemId = cartItems[i].id
    var product = getProduct(itemId) // state에서 제품 정보 가져오기

    if (product) {
      var priceDiv = cartItems[i].querySelector('.text-lg')
      var nameDiv = cartItems[i].querySelector('h3')
      if (product.onSale && product.recommendSale) {
        // suggestSale -> recommendSale
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalPrice.toLocaleString() +
          '</span> <span class="text-purple-600">₩' +
          product.price.toLocaleString() +
          '</span>' // originalVal -> originalPrice, val -> price
        nameDiv.textContent = '⚡💝' + product.name
      } else if (product.onSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalPrice.toLocaleString() +
          '</span> <span class="text-red-500">₩' +
          product.price.toLocaleString() +
          '</span>'
        nameDiv.textContent = '⚡' + product.name
      } else if (product.recommendSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalPrice.toLocaleString() +
          '</span> <span class="text-blue-500">₩' +
          product.price.toLocaleString() +
          '</span>'
        nameDiv.textContent = '💝' + product.name
      } else {
        priceDiv.textContent = '₩' + product.price.toLocaleString()
        nameDiv.textContent = product.name
      }
    }
  }
  handleCalculateCartStuff()
}

main()

// 이벤트 핸들러들 (state 사용으로 변경)
addBtn.addEventListener('click', function () {
  var selItem = sel.value
  const product = getProduct(selItem) // state에서 가져옴

  if (!selItem || !product) {
    return
  }

  if (product && product.stock > 0) {
    // q -> stock
    var item = document.getElementById(product.id)
    if (item) {
      var qtyElem = item.querySelector('.quantity-number')
      var newQty = parseInt(qtyElem.textContent) + 1
      if (newQty <= product.stock + parseInt(qtyElem.textContent)) {
        // q -> stock
        qtyElem.textContent = newQty
        // state 업데이트
        const currentQuantity = getCartQuantity(selItem)
        setCartQuantity(selItem, currentQuantity + 1)
        updateProduct(selItem, { stock: product.stock - 1 }) // q -> stock
      } else {
        alert('재고가 부족합니다.')
      }
    } else {
      var newItem = document.createElement('div')
      newItem.id = product.id
      newItem.className =
        'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0'
      newItem.innerHTML = `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${product.onSale && product.recommendSale ? '⚡💝' : product.onSale ? '⚡' : product.recommendSale ? '💝' : ''}${product.name}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${product.onSale || product.recommendSale ? '<span class="line-through text-gray-400">₩' + product.originalPrice.toLocaleString() + '</span> <span class="' + (product.onSale && product.recommendSale ? 'text-purple-600' : product.onSale ? 'text-red-500' : 'text-blue-500') + '">₩' + product.price.toLocaleString() + '</span>' : '₩' + product.price.toLocaleString()}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${product.onSale || product.recommendSale ? '<span class="line-through text-gray-400">₩' + product.originalPrice.toLocaleString() + '</span> <span class="' + (product.onSale && product.recommendSale ? 'text-purple-600' : product.onSale ? 'text-red-500' : 'text-blue-500') + '">₩' + product.price.toLocaleString() + '</span>' : '₩' + product.price.toLocaleString()}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${product.id}">Remove</a>
        </div>
      `
      cartDisp.appendChild(newItem)
      // state 업데이트
      setCartQuantity(selItem, 1)
      updateProduct(selItem, { stock: product.stock - 1 })
    }
    handleCalculateCartStuff()
    setLastSelectedProductId(selItem) // state 업데이트
  }
})

cartDisp.addEventListener('click', function (event) {
  var tgt = event.target
  if (
    tgt.classList.contains('quantity-change') ||
    tgt.classList.contains('remove-item')
  ) {
    var prodId = tgt.dataset.productId
    var itemElem = document.getElementById(prodId)
    var prod = getProduct(prodId) // state에서 가져옄

    if (tgt.classList.contains('quantity-change')) {
      var qtyChange = parseInt(tgt.dataset.change)
      let qtyElem = itemElem.querySelector('.quantity-number')
      var currentQty = parseInt(qtyElem.textContent)
      var newQty = currentQty + qtyChange

      if (newQty > 0 && newQty <= prod.stock + currentQty) {
        // q -> stock
        qtyElem.textContent = newQty
        // state 업데이트
        setCartQuantity(prodId, newQty)
        updateProduct(prodId, { stock: prod.stock - qtyChange })
      } else if (newQty <= 0) {
        // state 업데이트
        setCartQuantity(prodId, 0)
        updateProduct(prodId, { stock: prod.stock + currentQty })
        itemElem.remove()
      } else {
        alert('재고가 부족합니다.')
      }
    } else if (tgt.classList.contains('remove-item')) {
      let qtyElem = itemElem.querySelector('.quantity-number')
      var remQty = parseInt(qtyElem.textContent)
      // state 업데이트
      setCartQuantity(prodId, 0)
      updateProduct(prodId, { stock: prod.stock + remQty })
      itemElem.remove()
    }

    if (prod && prod.stock < THRESHOLDS.LOW_STOCK) {
      // 상수 사용
    }
    handleCalculateCartStuff()
    onUpdateSelectOptions()
  }
})
