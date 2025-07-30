// 상수 import
import {
  PRODUCT_IDS,
  PRODUCT_NAMES,
  PRODUCT_PRICES,
  INITIAL_STOCK,
  DISCOUNT_THRESHOLDS,
  DISCOUNT_RATES,
  POINT_RATES,
  UI_CONSTANTS,
} from './constants/index.js';

// ProductService import
import {
  initializeProducts,
  getProductById,
  decreaseStock,
  increaseStock,
  applySale,
  applySuggestSale,
  getLowStockProducts,
  getOutOfStockProducts,
  getTotalStock,
  calculateItemDiscount,
} from './services/product/ProductService.js';

// 전역 변수들 (명명 규칙 적용)
let productList;
let bonusPoints = 0;
let stockInfoElement;
let itemCount;
let lastSelectedProductId;
let productSelector;
let addToCartButton;
let totalAmount = 0;
let cartDisplayElement;
let orderSummaryElement;

function main() {
  totalAmount = 0;
  itemCount = 0;
  lastSelectedProductId = null;

  // 상품 정보 초기화 - ProductService 사용
  productList = initializeProducts();

  const root = document.getElementById('app');

  const header = document.createElement('div');
  header.className = 'mb-8';
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;

  productSelector = document.createElement('select');
  productSelector.id = 'product-select';
  productSelector.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  const leftColumn = document.createElement('div');
  leftColumn['className'] = 'bg-white border border-gray-200 p-8 overflow-y-auto';

  const gridContainer = document.createElement('div');
  gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

  stockInfoElement = document.createElement('div');
  stockInfoElement.id = 'stock-status';
  stockInfoElement.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

  addToCartButton = document.createElement('button');
  addToCartButton.id = 'add-to-cart';
  addToCartButton.innerHTML = 'Add to Cart';
  addToCartButton.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

  // 상품 선택/추가/재고 표시 컨테이너
  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';
  selectorContainer.appendChild(productSelector);
  selectorContainer.appendChild(addToCartButton);
  selectorContainer.appendChild(stockInfoElement);

  cartDisplayElement = document.createElement('div');
  cartDisplayElement.id = 'cart-items';

  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartDisplayElement);

  // 오른쪽 컬럼(주문 요약) 생성
  const rightColumn = document.createElement('div');
  rightColumn.className = 'bg-black text-white p-8 flex flex-col';
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
  `;
  orderSummaryElement = rightColumn.querySelector('#cart-total');

  // 이용 안내(오버레이) 관련 요소 생성
  const manualOverlay = document.createElement('div');
  manualOverlay.className = 'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';
  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  };

  const manualToggle = document.createElement('button');
  manualToggle.onclick = function () {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };
  manualToggle.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;

  const manualColumn = document.createElement('div');
  manualColumn.className =
    'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300';
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
  `;

  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  // 상품 옵션, 장바구니, 가격 등 초기 렌더링
  updateProductOptions();
  calculateCartSummary();

  // 번개 세일(랜덤 상품 20% 할인) 타이머 설정
  const lightningDelay = Math.random() * UI_CONSTANTS.LIGHTNING_SALE_DELAY;
  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * productList.length);
      const luckyItem = productList[luckyIdx];
      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        // ProductService의 applySale 함수 사용
        const result = applySale(productList, luckyItem.id, 0.2);
        if (result.success) {
          productList = result.products;
          alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
          updateProductOptions();
          updateCartPrices();
        }
      }
    }, UI_CONSTANTS.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);

  // 추천 할인(다른 상품 5% 할인) 타이머 설정
  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedProductId && cartDisplayElement.children.length > 0) {
        let suggest = null;
        for (let k = 0; k < productList.length; k++) {
          if (productList[k].id !== lastSelectedProductId) {
            if (productList[k].quantity > 0) {
              if (!productList[k].suggestSale) {
                suggest = productList[k];
                break;
              }
            }
          }
        }

        if (suggest) {
          alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          const result = applySuggestSale(productList, suggest.id, 0.05);
          if (result.success) {
            productList = result.products;
            updateProductOptions();
            updateCartPrices();
          }
        }
      }
    }, UI_CONSTANTS.SUGGEST_SALE_INTERVAL);
  }, Math.random() * UI_CONSTANTS.SUGGEST_SALE_DELAY);
}

// 장바구니 내 각 상품별 합계/할인 계산
function processCartItems(cartItems) {
  let totalAmount = 0;
  let itemCount = 0;
  let subTot = 0;
  const itemDiscounts = [];

  for (let i = 0; i < cartItems.length; i++) {
    // 상품 찾기
    let curItem;
    for (let j = 0; j < productList.length; j++) {
      if (productList[j].id === cartItems[i].id) {
        curItem = productList[j];
        break;
      }
    }

    const quantityElem = cartItems[i].querySelector('.quantity-number');
    const quantity = parseInt(quantityElem.textContent);
    const itemTot = curItem.price * quantity;

    itemCount += quantity;
    subTot += itemTot;

    // UI 스타일 조정 (10개 이상시 볼드 처리)
    const itemDiv = cartItems[i];
    const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
    priceElems.forEach(function (elem) {
      if (elem.classList.contains('text-lg')) {
        elem.style.fontWeight = quantity >= DISCOUNT_THRESHOLDS.INDIVIDUAL_ITEM ? 'bold' : 'normal';
      }
    });

    // 개별 할인 계산 - ProductService 사용
    const disc = calculateItemDiscount(curItem.id, quantity);
    if (disc > 0) {
      itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
    }

    totalAmount += itemTot * (1 - disc);
  }

  return {
    totalAmount,
    itemCount,
    subTot,
    itemDiscounts,
  };
}

// 할인 총합 계산 (대량구매 할인 + 화요일 할인)
function calculateTotalDiscount(subTot, itemCount, currentAmount) {
  let finalAmount = currentAmount;
  let discountRate = 0;

  // 대량구매 할인 적용
  if (itemCount >= DISCOUNT_THRESHOLDS.BULK_PURCHASE) {
    finalAmount = subTot * (1 - DISCOUNT_RATES.BULK_PURCHASE);
    discountRate = DISCOUNT_RATES.BULK_PURCHASE;
  } else {
    discountRate = (subTot - finalAmount) / subTot;
  }

  // 화요일 할인 적용
  const today = new Date();
  const isTuesday = today.getDay() === UI_CONSTANTS.TUESDAY;

  if (isTuesday && finalAmount > 0) {
    finalAmount = finalAmount * (1 - DISCOUNT_RATES.TUESDAY);
    discountRate = 1 - finalAmount / subTot;
  }

  return {
    finalAmount,
    discountRate,
    isTuesday,
  };
}

// 주문 요약 상세 내역 갱신
function updateOrderSummary(cartItems, subTot, itemCount, itemDiscounts, isTuesday, totalAmount) {
  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';

  if (subTot > 0) {
    // 각 상품별 정보 표시
    for (let i = 0; i < cartItems.length; i++) {
      let curItem;
      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          curItem = productList[j];
          break;
        }
      }

      const quantityElem = cartItems[i].querySelector('.quantity-number');
      const quantity = parseInt(quantityElem.textContent);
      const itemTotal = curItem.price * quantity;

      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${quantity}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }

    // 소계 표시
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
      </div>
    `;

    // 할인 정보 표시
    if (itemCount >= DISCOUNT_THRESHOLDS.BULK_PURCHASE) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(function (item) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    // 화요일 할인 표시
    if (isTuesday && totalAmount > 0) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-10%</span>
        </div>
      `;
    }

    // 배송비 표시
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
}

// 상품 선택 옵션 렌더링 및 재고 상태 표시
function updateProductOptions() {
  let opt;
  let discountText;

  productSelector.innerHTML = '';

  // ProductService의 getTotalStock 함수 사용
  const totalStock = getTotalStock(productList);

  // 각 상품별 옵션 생성
  for (let i = 0; i < productList.length; i++) {
    (function () {
      const item = productList[i];
      opt = document.createElement('option');
      opt.value = item.id;
      discountText = '';

      if (item.onSale) discountText += ' ⚡SALE';
      if (item.suggestSale) discountText += ' 💝추천';

      if (item.quantity === 0) {
        opt.textContent = `${item.name} - ${item.price}원 (품절)${discountText}`;
        opt.disabled = true;
        opt.className = 'text-gray-400';
      } else {
        if (item.onSale && item.suggestSale) {
          opt.textContent = `⚡💝${item.name} - ${item.originalPrice}원 → ${item.price}원 (25% SUPER SALE!)`;
          opt.className = 'text-purple-600 font-bold';
        } else if (item.onSale) {
          opt.textContent = `⚡${item.name} - ${item.originalPrice}원 → ${item.price}원 (20% SALE!)`;
          opt.className = 'text-red-500 font-bold';
        } else if (item.suggestSale) {
          opt.textContent = `💝${item.name} - ${item.originalPrice}원 → ${item.price}원 (5% 추천할인!)`;
          opt.className = 'text-blue-500 font-bold';
        } else {
          opt.textContent = `${item.name} - ${item.price}원${discountText}`;
        }
      }
      productSelector.appendChild(opt);
    })();
  }

  if (totalStock < UI_CONSTANTS.TOTAL_STOCK_THRESHOLD) {
    productSelector.style.borderColor = 'orange';
  } else {
    productSelector.style.borderColor = '';
  }
}

// 장바구니, 할인, 포인트 등 계산 및 화면 갱신
function calculateCartSummary() {
  let savedAmount;
  let points;
  let previousCount;

  const cartItems = cartDisplayElement.children;

  // 장바구니 내 각 상품별 합계/할인 계산
  const {
    totalAmount: calcTotalAmount,
    itemCount: calcItemCount,
    subTot,
    itemDiscounts,
  } = processCartItems(cartItems);

  totalAmount = calcTotalAmount;
  itemCount = calcItemCount;

  const originalTotal = subTot;

  // 할인 총합 계산 적용
  const { finalAmount, discountRate, isTuesday } = calculateTotalDiscount(
    subTot,
    itemCount,
    totalAmount,
  );
  totalAmount = finalAmount;
  const discRate = discountRate;

  // 화요일 특별 할인 UI 표시
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday && totalAmount > 0) {
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
  // 장바구니 수량 표시 갱신
  document.getElementById('item-count').textContent = `🛍️ ${itemCount} items in cart`;

  // 주문 요약(상품별, 할인, 배송 등) 갱신
  updateOrderSummary(cartItems, subTot, itemCount, itemDiscounts, isTuesday, totalAmount);
  // 총 결제 금액 표시 갱신
  const totalDiv = orderSummaryElement.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(totalAmount).toLocaleString()}`;
  }
  // 적립 포인트 표시 갱신
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    points = Math.floor(totalAmount * POINT_RATES.BASE_RATE);
    if (points > 0) {
      loyaltyPointsDiv.textContent = `적립 포인트: ${points}p`;
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }
  // 할인 정보 표시 갱신
  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';

  if (discRate > 0 && totalAmount > 0) {
    savedAmount = originalTotal - totalAmount;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(
          savedAmount,
        ).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }
  // 장바구니 수량 변화 애니메이션 표시
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = `🛍️ ${itemCount} items in cart`;
    if (previousCount !== itemCount) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
  // 재고 부족/품절 안내 메시지 갱신
  updateStockMessages();

  renderBonusPoints();
}

// 적립 포인트 계산 및 상세 내역 표시
const renderBonusPoints = function () {
  let finalPoints;
  let hasKeyboard;
  let hasMouse;
  let hasMonitorArm;

  if (cartDisplayElement.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }

  const basePoints = Math.floor(totalAmount * POINT_RATES.BASE_RATE);
  finalPoints = 0;
  const pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }
  // 화요일 2배 포인트
  if (new Date().getDay() === UI_CONSTANTS.TUESDAY) {
    if (basePoints > 0) {
      finalPoints = basePoints * POINT_RATES.TUESDAY_MULTIPLIER;
      pointsDetail.push('화요일 2배');
    }
  }
  // 키보드/마우스/모니터암 포함 여부 체크
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  const nodes = cartDisplayElement.children;

  for (const node of nodes) {
    let product = null;
    for (let pIdx = 0; pIdx < productList.length; pIdx++) {
      if (productList[pIdx].id === node.id) {
        product = productList[pIdx];
        break;
      }
    }

    if (!product) continue;

    if (product.id === PRODUCT_IDS.KEYBOARD) {
      hasKeyboard = true;
    } else if (product.id === PRODUCT_IDS.MOUSE) {
      hasMouse = true;
    } else if (product.id === PRODUCT_IDS.MONITOR_ARM) {
      hasMonitorArm = true;
    }
  }
  // 키보드+마우스 세트, 풀세트, 대량구매 추가 포인트
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + POINT_RATES.SET_BONUS;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + POINT_RATES.FULL_SET_BONUS;
    pointsDetail.push('풀세트 구매 +100p');
  }

  if (itemCount >= DISCOUNT_THRESHOLDS.BULK_PURCHASE) {
    finalPoints = finalPoints + POINT_RATES.QUANTITY_BONUS_30;
    pointsDetail.push('대량구매(30개+) +100p');
  } else {
    if (itemCount >= 20) {
      finalPoints = finalPoints + POINT_RATES.QUANTITY_BONUS_20;
      pointsDetail.push('대량구매(20개+) +50p');
    } else {
      if (itemCount >= DISCOUNT_THRESHOLDS.INDIVIDUAL_ITEM) {
        finalPoints = finalPoints + POINT_RATES.QUANTITY_BONUS_10;
        pointsDetail.push('대량구매(10개+) +20p');
      }
    }
  }
  bonusPoints = finalPoints;
  const ptsTag = document.getElementById('loyalty-points');

  if (ptsTag) {
    if (bonusPoints > 0) {
      ptsTag.innerHTML =
        `<div>적립 포인트: <span class="font-bold">${bonusPoints}p</span></div>` +
        `<div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>`;
      ptsTag.style.display = 'block';
    } else {
      ptsTag.textContent = '적립 포인트: 0p';
      ptsTag.style.display = 'block';
    }
  }
};

// 재고 부족/품절 안내 메시지 생성 및 표시
function updateStockMessages() {
  // 재고 부족 상품 조회
  const lowStockProducts = getLowStockProducts(productList);
  // 품절 상품 조회
  const outOfStockProducts = getOutOfStockProducts(productList);

  let stockMsg = '';

  // 재고 부족 상품 메시지
  lowStockProducts.forEach((item) => {
    stockMsg += `${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
  });

  // 품절 상품 메시지
  outOfStockProducts.forEach((item) => {
    stockMsg += `${item.name}: 품절\n`;
  });

  stockInfoElement.textContent = stockMsg;
}

// 상품 가격 렌더링 로직 분리
function renderProductPrice(product, priceDiv, nameDiv) {
  if (product.onSale && product.suggestSale) {
    priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> <span class="text-purple-600">₩${product.price.toLocaleString()}</span>`;
    nameDiv.textContent = `⚡💝${product.name}`;
  } else if (product.onSale) {
    priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> <span class="text-red-500">₩${product.price.toLocaleString()}</span>`;
    nameDiv.textContent = `⚡${product.name}`;
  } else if (product.suggestSale) {
    priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> <span class="text-blue-500">₩${product.price.toLocaleString()}</span>`;
    nameDiv.textContent = `💝${product.name}`;
  } else {
    priceDiv.textContent = `₩${product.price.toLocaleString()}`;
    nameDiv.textContent = product.name;
  }
}

// 장바구니 내 상품 가격/이름 갱신 및 전체 금액 재계산
function updateCartPrices() {
  const cartItems = cartDisplayElement.children;

  const productMap = productList.reduce((map, product) => {
    map[product.id] = product;
    return map;
  }, {});

  // 각 카트 아이템을 순회하며 가격/이름 업데이트 (productMap 사용)
  for (const cartItem of cartItems) {
    const product = productMap[cartItem.id];

    if (product) {
      const priceDiv = cartItem.querySelector('.text-lg');
      const nameDiv = cartItem.querySelector('h3');
      renderProductPrice(product, priceDiv, nameDiv);
    }
  }

  calculateCartSummary();
}

main();

// 장바구니 추가 버튼 클릭 이벤트
addToCartButton.addEventListener('click', function () {
  const selItem = productSelector.value;

  // ProductService의 getProductById 함수 사용
  const itemToAdd = getProductById(productList, selItem);

  if (!selItem || !itemToAdd) {
    return;
  }

  if (itemToAdd.quantity > 0) {
    const item = document.getElementById(itemToAdd.id);

    if (item) {
      // 이미 장바구니에 있으면 수량 증가
      const quantityElem = item.querySelector('.quantity-number');
      const newQty = parseInt(quantityElem.textContent) + 1;

      if (newQty <= itemToAdd.quantity + parseInt(quantityElem.textContent)) {
        quantityElem.textContent = newQty;
        // ProductService의 decreaseStock 함수 사용
        const result = decreaseStock(productList, itemToAdd.id, 1);
        if (result.success) {
          productList = result.products;
        }
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // 장바구니에 새로 추가
      const newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className =
        'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
      newItem.innerHTML = `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${
            itemToAdd.onSale && itemToAdd.suggestSale
              ? '⚡💝'
              : itemToAdd.onSale
              ? '⚡'
              : itemToAdd.suggestSale
              ? '💝'
              : ''
          }${itemToAdd.name}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${
            itemToAdd.onSale || itemToAdd.suggestSale
              ? `<span class="line-through text-gray-400">₩${itemToAdd.originalPrice.toLocaleString()}</span> <span class="${
                  itemToAdd.onSale && itemToAdd.suggestSale
                    ? 'text-purple-600'
                    : itemToAdd.onSale
                    ? 'text-red-500'
                    : 'text-blue-500'
                }">₩${itemToAdd.price.toLocaleString()}</span>`
              : `₩${itemToAdd.price.toLocaleString()}`
          }</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${
              itemToAdd.id
            }" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${
              itemToAdd.id
            }" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${
            itemToAdd.onSale || itemToAdd.suggestSale
              ? `<span class="line-through text-gray-400">₩${itemToAdd.originalPrice.toLocaleString()}</span> <span class="${
                  itemToAdd.onSale && itemToAdd.suggestSale
                    ? 'text-purple-600'
                    : itemToAdd.onSale
                    ? 'text-red-500'
                    : 'text-blue-500'
                }">₩${itemToAdd.price.toLocaleString()}</span>`
              : `₩${itemToAdd.price.toLocaleString()}`
          }</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${
            itemToAdd.id
          }">Remove</a>
        </div>
      `;
      cartDisplayElement.appendChild(newItem);
      // ProductService의 decreaseStock 함수 사용
      const result = decreaseStock(productList, itemToAdd.id, 1);
      if (result.success) {
        productList = result.products;
      }
    }

    calculateCartSummary();
    lastSelectedProductId = selItem;
  }
});

// 장바구니 내 수량 변경/삭제 이벤트 처리
cartDisplayElement.addEventListener('click', function (event) {
  const tgt = event.target;

  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);

    // ProductService의 getProductById 함수 사용
    const prod = getProductById(productList, prodId);

    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change);
      const qtyElem = itemElem.querySelector('.quantity-number');
      const currentQty = parseInt(qtyElem.textContent);
      const newQty = currentQty + qtyChange;

      if (newQty > 0 && newQty <= prod.quantity + currentQty) {
        qtyElem.textContent = newQty;
        // ProductService의 decreaseStock 함수 사용
        const result = decreaseStock(productList, prodId, qtyChange);
        if (result.success) {
          productList = result.products;
        }
      } else if (newQty <= 0) {
        // ProductService의 increaseStock 함수 사용
        const result = increaseStock(productList, prodId, currentQty);
        if (result.success) {
          productList = result.products;
        }
        itemElem.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      const qtyElem = itemElem.querySelector('.quantity-number');
      const remQty = parseInt(qtyElem.textContent);
      // ProductService의 increaseStock 함수 사용
      const result = increaseStock(productList, prodId, remQty);
      if (result.success) {
        productList = result.products;
      }
      itemElem.remove();
    }

    if (prod && prod.quantity < UI_CONSTANTS.LOW_STOCK_THRESHOLD) {
      // 재고 부족 알림 (필요시 추가 구현)
    }

    calculateCartSummary();
    updateProductOptions();
  }
});
