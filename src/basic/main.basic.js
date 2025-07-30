// ==========================================
// 전역 변수 선언
// ==========================================
import {
  PRODUCT_ONE,
  PRODUCT_TWO,
  PRODUCT_THREE,
  PRODUCT_FOUR,
  PRODUCT_FIVE,
  PRODUCT_LIST,
} from './constants/products.js';

import {
  TIMER_CONFIG,
  DISCOUNT_RATES,
  QUANTITY_THRESHOLDS,
  POINTS_CONFIG,
  WEEKDAYS,
  PRICE_CONFIG,
} from './constants/config.js';

import { Header, HelpModal, MainLayout } from './components/ui.js';

let bonusPoints = 0;
let stockInfo;
let itemCount;
let lastSelectedProduct;
let productSelect;
let addButton;
let totalAmount = 0;

let cartDisplay;

// ==========================================
// 메인 초기화 함수
// ==========================================

// 애플리케이션 상태를 초기화합니다
function initializeAppState() {
  totalAmount = 0;
  itemCount = 0;
  lastSelectedProduct = null;
}

// UI를 렌더링 합니다
function renderInitialUI() {
  const root = document.getElementById('app');
  if (!root) {
    throw new Error('Root 요소를 찾을 수 없습니다.');
  }

  root.innerHTML = `
    ${Header()}
    ${MainLayout(PRODUCT_LIST)}
    ${HelpModal()}
  `;
}

function main() {
  // DOM 요소 변수들
  let manualToggle;
  let manualOverlay;
  let lightningDelay;

  // DOM 요소 참조 (Template Literal 방식 이후)
  productSelect = document.getElementById('product-select');
  addButton = document.getElementById('add-to-cart');
  cartDisplay = document.getElementById('cart-items');
  stockInfo = document.getElementById('stock-status');

  sum = document.getElementById('cart-total');

  manualToggle = document.getElementById('manual-toggle');
  manualOverlay = document.getElementById('manual-overlay');

  // 이벤트 리스너 등록 (Template Literal 방식 이후)
  if (manualToggle) {
    manualToggle.addEventListener('click', function () {
      if (manualOverlay) {
        manualOverlay.classList.toggle('hidden');
        const manualPanel = document.getElementById('manual-panel');
        if (manualPanel) {
          manualPanel.classList.toggle('translate-x-full');
        }
      }
    });
  }

  if (manualOverlay) {
    manualOverlay.addEventListener('click', function (e) {
      if (e.target === manualOverlay) {
        manualOverlay.classList.add('hidden');
        const manualPanel = document.getElementById('manual-panel');
        if (manualPanel) {
          manualPanel.classList.add('translate-x-full');
        }
      }
    });
  }

  // 초기 재고 계산
  let initStock = 0;
  for (let i = 0; i < PRODUCT_LIST.length; i++) {
    initStock += PRODUCT_LIST[i].quantity;
  }

  // 초기 렌더링
  updateProductOptions();
  handleCalculateCartStuff();

  // 번개세일 타이머 설정
  lightningDelay = Math.random() * TIMER_CONFIG.LIGHTNING_SALE_MAX_DELAY;
  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * PRODUCT_LIST.length);
      const luckyItem = PRODUCT_LIST[luckyIdx];
      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        luckyItem.price = Math.round(
          luckyItem.originalPrice * PRICE_CONFIG.LIGHTNING_SALE_MULTIPLIER
        );
        luckyItem.onSale = true;
        alert(
          `⚡번개세일! ${luckyItem.name}이(가) ${DISCOUNT_RATES.LIGHTNING_SALE * 100}% 할인 중입니다!`
        );
        updateProductOptions();
        doUpdatePricesInCart();
      }
    }, TIMER_CONFIG.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);

  // 추천 상품 타이머 설정
  setTimeout(function () {
    setInterval(function () {
      if (cartDisplay.children.length === 0) {
      }
      if (lastSelectedProduct) {
        let suggest = null;

        for (let k = 0; k < PRODUCT_LIST.length; k++) {
          if (PRODUCT_LIST[k].id !== lastSelectedProduct) {
            if (PRODUCT_LIST[k].quantity > 0) {
              if (!PRODUCT_LIST[k].suggestSale) {
                suggest = PRODUCT_LIST[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert(
            `💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 ${DISCOUNT_RATES.SUGGESTION * 100}% 추가 할인!`
          );

          suggest.price = Math.round(
            suggest.price * PRICE_CONFIG.SUGGESTION_SALE_MULTIPLIER
          );
          suggest.suggestSale = true;
          updateProductOptions();
          doUpdatePricesInCart();
        }
      }
    }, TIMER_CONFIG.SUGGESTION_INTERVAL);
  }, Math.random() * TIMER_CONFIG.SUGGESTION_MAX_DELAY);
}

// ==========================================
// UI 업데이트 함수들
// ==========================================

let sum;

// 상품 선택 옵션 업데이트
function updateProductOptions() {
  let totalStock;
  let option;
  let discountText;
  productSelect.innerHTML = '';
  totalStock = 0;

  // 전체 재고 계산
  for (let idx = 0; idx < PRODUCT_LIST.length; idx++) {
    const product = PRODUCT_LIST[idx];
    totalStock = totalStock + product.quantity;
  }

  // 상품 옵션 생성
  for (let i = 0; i < PRODUCT_LIST.length; i++) {
    (function () {
      const item = PRODUCT_LIST[i];
      option = document.createElement('option');
      option.value = item.id;
      discountText = '';
      if (item.onSale) discountText += ' ⚡SALE';
      if (item.suggestSale) discountText += ' 💝추천';

      if (item.quantity === 0) {
        // 품절 상품
        option.textContent = `${item.name} - ${item.price}원 (품절)${discountText}`;
        option.disabled = true;
        option.className = 'text-gray-400';
      } else {
        // 판매 가능 상품
        if (item.onSale && item.suggestSale) {
          option.textContent = `⚡💝${item.name} - ${item.originalPrice}원 → ${item.price}원 (${DISCOUNT_RATES.SUPER_SALE_COMBO * 100}% SUPER SALE!)`;
          option.className = 'text-purple-600 font-bold';
        } else if (item.onSale) {
          option.textContent = `⚡${item.name} - ${item.originalPrice}원 → ${item.price}원 (${DISCOUNT_RATES.LIGHTNING_SALE * 100}% SALE!)`;
          option.className = 'text-red-500 font-bold';
        } else if (item.suggestSale) {
          option.textContent = `💝${item.name} - ${item.originalPrice}원 → ${item.price}원 (${DISCOUNT_RATES.SUGGESTION * 100}% 추천할인!)`;
          option.className = 'text-blue-500 font-bold';
        } else {
          option.textContent = `${item.name} - ${item.price}원${discountText}`;
        }
      }
      productSelect.appendChild(option);
    })();
  }

  // 재고 부족 시 테두리 색상 변경
  if (totalStock < QUANTITY_THRESHOLDS.STOCK_BORDER_WARNING) {
    productSelect.style.borderColor = 'orange';
  } else {
    productSelect.style.borderColor = '';
  }
}

// ==========================================
// 장바구니 계산 및 할인 로직
// ==========================================

// 장바구니 총액 및 할인 계산
function handleCalculateCartStuff() {
  let cartItems;
  let subTot;
  let itemDiscounts;
  let lowStockItems;
  let idx;
  let originalTotal;
  let bulkDisc;
  let itemDisc;
  let savedAmount;
  let summaryDetails;
  let totalDiv;
  let loyaltyPointsDiv;
  let points;
  let discountInfoDiv;
  let itemCountElement;
  let previousCount;
  let stockMsg;
  let pts;
  let hasP1;
  let hasP2;
  let loyaltyDiv;

  // 초기화
  totalAmount = 0;
  itemCount = 0;
  cartItems = cartDisplay.children;
  subTot = 0;
  itemDiscounts = [];
  lowStockItems = [];

  // 재고 부족 상품 체크
  for (idx = 0; idx < PRODUCT_LIST.length; idx++) {
    if (
      PRODUCT_LIST[idx].quantity < QUANTITY_THRESHOLDS.LOW_STOCK_WARNING &&
      PRODUCT_LIST[idx].quantity > 0
    ) {
      lowStockItems.push(PRODUCT_LIST[idx].name);
    }
  }

  // 장바구니 아이템별 계산
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let currentItem;
      // 상품 정보 찾기
      for (let j = 0; j < PRODUCT_LIST.length; j++) {
        if (PRODUCT_LIST[j].id === cartItems[i].id) {
          currentItem = PRODUCT_LIST[j];
          break;
        }
      }

      const qtyElem = cartItems[i].querySelector('.quantity-number');
      let quantity;
      let itemTotal;
      let discount;

      quantity = parseInt(qtyElem.textContent);
      itemTotal = currentItem.price * quantity;
      discount = 0;
      itemCount += quantity;
      subTot += itemTotal;

      // 대량 구매 시 UI 강조
      const itemDiv = cartItems[i];
      const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
      priceElems.forEach(function (elem) {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight =
            quantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT_MINIMUM
              ? 'bold'
              : 'normal';
        }
      });

      // 개별 상품 할인 계산 (10개 이상)
      if (quantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT_MINIMUM) {
        if (currentItem.id === PRODUCT_ONE) {
          discount = DISCOUNT_RATES.PRODUCT_BULK_DISCOUNTS.KEYBOARD;
        } else if (currentItem.id === PRODUCT_TWO) {
          discount = DISCOUNT_RATES.PRODUCT_BULK_DISCOUNTS.MOUSE;
        } else if (currentItem.id === PRODUCT_THREE) {
          discount = DISCOUNT_RATES.PRODUCT_BULK_DISCOUNTS.MONITOR_ARM;
        } else if (currentItem.id === PRODUCT_FOUR) {
          discount = DISCOUNT_RATES.PRODUCT_BULK_DISCOUNTS.LAPTOP_POUCH;
        } else if (currentItem.id === PRODUCT_FIVE) {
          discount = DISCOUNT_RATES.PRODUCT_BULK_DISCOUNTS.SPEAKER;
        }
        if (discount > 0) {
          itemDiscounts.push({
            name: currentItem.name,
            discount: discount * 100,
          });
        }
      }
      totalAmount += itemTotal * (1 - discount);
    })();
  }

  // 대량 구매 할인 적용 (30개 이상)
  let discRate = 0;
  originalTotal = subTot;
  if (itemCount >= QUANTITY_THRESHOLDS.BULK_DISCOUNT_MINIMUM) {
    totalAmount = subTot * PRICE_CONFIG.BULK_DISCOUNT_MULTIPLIER;
    discRate = DISCOUNT_RATES.BULK_DISCOUNT_30_PLUS;
  } else {
    discRate = (subTot - totalAmount) / subTot;
  }

  // 화요일 특별 할인 적용
  const today = new Date();
  const isTuesday = today.getDay() === WEEKDAYS.TUESDAY;
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday) {
    if (totalAmount > 0) {
      totalAmount = totalAmount * PRICE_CONFIG.TUESDAY_MULTIPLIER;
      discRate = 1 - totalAmount / originalTotal;
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  // 아이템 개수 업데이트
  document.getElementById('item-count').textContent =
    `🛍️ ${itemCount} items in cart`;

  // 주문 요약 상세 내역 업데이트
  summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';
  if (subTot > 0) {
    // 각 상품별 라인 아이템 표시
    for (let i = 0; i < cartItems.length; i++) {
      let currentItem;
      for (let j = 0; j < PRODUCT_LIST.length; j++) {
        if (PRODUCT_LIST[j].id === cartItems[i].id) {
          currentItem = PRODUCT_LIST[j];
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const quantity = parseInt(qtyElem.textContent);
      const itemTotal = currentItem.price * quantity;
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${currentItem.name} x ${quantity}</span>
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

    // 할인 내역 표시
    if (itemCount >= QUANTITY_THRESHOLDS.BULK_DISCOUNT_MINIMUM) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (${QUANTITY_THRESHOLDS.BULK_DISCOUNT_MINIMUM}개 이상)</span>
          <span class="text-xs">-${DISCOUNT_RATES.BULK_DISCOUNT_30_PLUS * 100}%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(function (item) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (${QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT_MINIMUM}개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    // 화요일 할인 표시
    if (isTuesday) {
      if (totalAmount > 0) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-${DISCOUNT_RATES.TUESDAY_SPECIAL * 100}%</span>
          </div>
        `;
      }
    }

    // 배송비 표시
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }

  // 총액 업데이트
  totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(totalAmount).toLocaleString()}`;
  }

  // 기본 포인트 계산 및 표시
  loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    points = Math.floor(totalAmount / POINTS_CONFIG.BASE_POINT_RATE);
    if (points > 0) {
      loyaltyPointsDiv.textContent = `적립 포인트: ${points}p`;
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }

  // 할인 정보 표시
  discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';

  if (discRate > 0 && totalAmount > 0) {
    savedAmount = originalTotal - totalAmount;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }

  // 아이템 개수 변경 감지
  itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = `🛍️ ${itemCount} items in cart`;
    if (previousCount !== itemCount) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }

  // 재고 정보 메시지 생성
  stockMsg = '';

  for (let stockIdx = 0; stockIdx < PRODUCT_LIST.length; stockIdx++) {
    const item = PRODUCT_LIST[stockIdx];
    if (item.quantity < QUANTITY_THRESHOLDS.LOW_STOCK_WARNING) {
      if (item.quantity > 0) {
        stockMsg += `${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
      } else {
        stockMsg += `${item.name}: 품절\n`;
      }
    }
  }
  stockInfo.textContent = stockMsg;

  // 기타 업데이트 함수 호출
  handleStockInfoUpdate();
  doRenderBonusPoints();
}

// ==========================================
// 포인트 계산 시스템
// ==========================================

// 보너스 포인트 계산 및 렌더링
const doRenderBonusPoints = function () {
  let basePoints;
  let finalPoints;
  let pointsDetail;

  let hasKeyboard;
  let hasMouse;
  let hasMonitorArm;
  let nodes;

  // 빈 장바구니 체크
  if (cartDisplay.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }

  // 기본 포인트 계산
  basePoints = Math.floor(totalAmount / POINTS_CONFIG.BASE_POINT_RATE);
  finalPoints = 0;
  pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  // 화요일 포인트 2배
  if (new Date().getDay() === WEEKDAYS.TUESDAY) {
    if (basePoints > 0) {
      finalPoints = basePoints * POINTS_CONFIG.TUESDAY_MULTIPLIER;
      pointsDetail.push('화요일 2배');
    }
  }

  // 상품 조합 보너스 포인트 체크
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  nodes = cartDisplay.children;

  for (const node of nodes) {
    let product = null;

    for (let pIdx = 0; pIdx < PRODUCT_LIST.length; pIdx++) {
      if (PRODUCT_LIST[pIdx].id === node.id) {
        product = PRODUCT_LIST[pIdx];
        break;
      }
    }
    if (!product) continue;

    if (product.id === PRODUCT_ONE) {
      hasKeyboard = true;
    } else if (product.id === PRODUCT_TWO) {
      hasMouse = true;
    } else if (product.id === PRODUCT_THREE) {
      hasMonitorArm = true;
    }
  }

  // 키보드 + 마우스 세트 보너스
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + POINTS_CONFIG.COMBO_BONUS.KEYBOARD_MOUSE;
    pointsDetail.push(
      `키보드+마우스 세트 +${POINTS_CONFIG.COMBO_BONUS.KEYBOARD_MOUSE}p`
    );
  }

  // 풀세트 구매 보너스
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + POINTS_CONFIG.COMBO_BONUS.FULL_SET;
    pointsDetail.push(`풀세트 구매 +${POINTS_CONFIG.COMBO_BONUS.FULL_SET}p`);
  }

  // 대량 구매 보너스 포인트
  if (itemCount >= QUANTITY_THRESHOLDS.BULK_DISCOUNT_MINIMUM) {
    finalPoints = finalPoints + POINTS_CONFIG.BULK_BONUS.THIRTY_PLUS;
    pointsDetail.push(
      `대량구매(${QUANTITY_THRESHOLDS.BULK_DISCOUNT_MINIMUM}개+) +${POINTS_CONFIG.BULK_BONUS.THIRTY_PLUS}p`
    );
  } else if (itemCount >= QUANTITY_THRESHOLDS.MEDIUM_BULK_MINIMUM) {
    finalPoints = finalPoints + POINTS_CONFIG.BULK_BONUS.TWENTY_PLUS;
    pointsDetail.push(
      `대량구매(${QUANTITY_THRESHOLDS.MEDIUM_BULK_MINIMUM}개+) +${POINTS_CONFIG.BULK_BONUS.TWENTY_PLUS}p`
    );
  } else if (itemCount >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT_MINIMUM) {
    finalPoints = finalPoints + POINTS_CONFIG.BULK_BONUS.TEN_PLUS;
    pointsDetail.push(
      `대량구매(${QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT_MINIMUM}개+) +${POINTS_CONFIG.BULK_BONUS.TEN_PLUS}p`
    );
  }

  // 전역 변수 업데이트
  bonusPoints = finalPoints;

  // 포인트 표시 업데이트
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

// ==========================================
// 재고 관리 함수들
// ==========================================

// 전체 재고 수량 계산
function onGetStockTotal() {
  let sum;
  let i;
  let currentProduct;
  sum = 0;

  for (i = 0; i < PRODUCT_LIST.length; i++) {
    currentProduct = PRODUCT_LIST[i];
    sum += currentProduct.quantity;
  }
  return sum;
}

// 재고 정보 업데이트
const handleStockInfoUpdate = function () {
  let infoMsg;
  let totalStock;
  let messageOptimizer;

  infoMsg = '';
  totalStock = onGetStockTotal();

  if (totalStock < QUANTITY_THRESHOLDS.STOCK_WARNING_THRESHOLD) {
    // 재고 부족 경고 (필요시 확장)
  }

  // 각 상품별 재고 상태 체크
  PRODUCT_LIST.forEach(function (item) {
    if (item.quantity < QUANTITY_THRESHOLDS.LOW_STOCK_WARNING) {
      if (item.quantity > 0) {
        infoMsg += `${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
      } else {
        infoMsg += `${item.name}: 품절\n`;
      }
    }
  });
  stockInfo.textContent = infoMsg;
};

// ==========================================
// 장바구니 가격 업데이트
// ==========================================

// 장바구니 내 상품 가격 업데이트 (세일 적용)
function doUpdatePricesInCart() {
  let totalCount = 0,
    j = 0;
  let cartItems;

  // 총 수량 계산 (중복 코드)
  while (cartDisplay.children[j]) {
    const qty = cartDisplay.children[j].querySelector('.quantity-number');
    totalCount += qty ? parseInt(qty.textContent) : 0;
    j++;
  }

  totalCount = 0;
  for (j = 0; j < cartDisplay.children.length; j++) {
    totalCount += parseInt(
      cartDisplay.children[j].querySelector('.quantity-number').textContent
    );
  }

  // 각 장바구니 아이템 가격 업데이트
  cartItems = cartDisplay.children;
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;

    // 상품 정보 찾기
    for (let productIdx = 0; productIdx < PRODUCT_LIST.length; productIdx++) {
      if (PRODUCT_LIST[productIdx].id === itemId) {
        product = PRODUCT_LIST[productIdx];
        break;
      }
    }

    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');

      // 세일 상태에 따른 가격 표시
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
  }

  // 장바구니 계산 재실행
  handleCalculateCartStuff();
}

// ==========================================
// 애플리케이션 시작점
// ==========================================

// 애플리케이션 초기화
main();

// ==========================================
// 이벤트 리스너들
// ==========================================

// 장바구니에 상품 추가 이벤트
addButton.addEventListener('click', function () {
  const selItem = productSelect.value;

  // 선택된 상품 유효성 검사
  let hasItem = false;
  for (let idx = 0; idx < PRODUCT_LIST.length; idx++) {
    if (PRODUCT_LIST[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }
  if (!selItem || !hasItem) {
    return;
  }

  // 추가할 상품 정보 조회
  let itemToAdd = null;
  for (let j = 0; j < PRODUCT_LIST.length; j++) {
    if (PRODUCT_LIST[j].id === selItem) {
      itemToAdd = PRODUCT_LIST[j];
      break;
    }
  }

  // 재고 확인 및 장바구니 추가
  if (itemToAdd && itemToAdd.quantity > 0) {
    const item = document.getElementById(itemToAdd['id']);

    if (item) {
      // 기존 아이템 수량 증가
      const qtyElem = item.querySelector('.quantity-number');
      const newQty =
        parseInt(qtyElem['textContent']) +
        QUANTITY_THRESHOLDS.DEFAULT_QUANTITY_INCREMENT;
      if (newQty <= itemToAdd.quantity + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd['quantity']--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // 새 아이템 추가
      const newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className =
        'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
      newItem.innerHTML = `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${itemToAdd.onSale && itemToAdd.suggestSale ? '⚡💝' : itemToAdd.onSale ? '⚡' : itemToAdd.suggestSale ? '💝' : ''}${itemToAdd.name}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${itemToAdd.onSale || itemToAdd.suggestSale ? `<span class="line-through text-gray-400">₩${itemToAdd.originalPrice.toLocaleString()}</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500'}">₩${itemToAdd.price.toLocaleString()}</span>` : `₩${itemToAdd.price.toLocaleString()}`}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">${QUANTITY_THRESHOLDS.INITIAL_CART_QUANTITY}</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${itemToAdd.onSale || itemToAdd.suggestSale ? `<span class="line-through text-gray-400">₩${itemToAdd.originalPrice.toLocaleString()}</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500'}">₩${itemToAdd.price.toLocaleString()}</span>` : `₩${itemToAdd.price.toLocaleString()}`}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
        </div>
      `;
      cartDisplay.appendChild(newItem);
      itemToAdd.quantity--;
    }

    // UI 업데이트
    handleCalculateCartStuff();
    lastSelectedProduct = selItem;
  }
});

// 장바구니 수량 변경 및 삭제 이벤트
cartDisplay.addEventListener('click', function (event) {
  const target = event.target;

  if (
    target.classList.contains('quantity-change') ||
    target.classList.contains('remove-item')
  ) {
    const prodId = target.dataset.productId;
    const itemElem = document.getElementById(prodId);
    let prod = null;

    // 상품 정보 조회
    for (let prdIdx = 0; prdIdx < PRODUCT_LIST.length; prdIdx++) {
      if (PRODUCT_LIST[prdIdx].id === prodId) {
        prod = PRODUCT_LIST[prdIdx];
        break;
      }
    }

    if (target.classList.contains('quantity-change')) {
      // 수량 변경 처리
      const qtyChange = parseInt(target.dataset.change);
      const qtyElem = itemElem.querySelector('.quantity-number');
      const currentQty = parseInt(qtyElem.textContent);
      const newQty = currentQty + qtyChange;

      if (newQty > 0 && newQty <= prod.quantity + currentQty) {
        qtyElem.textContent = newQty;
        prod.quantity -= qtyChange;
      } else if (newQty <= 0) {
        prod.quantity += currentQty;
        itemElem.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (target.classList.contains('remove-item')) {
      // 아이템 제거 처리
      const qtyElem = itemElem.querySelector('.quantity-number');
      const remQty = parseInt(qtyElem.textContent);
      prod.quantity += remQty;
      itemElem.remove();
    }

    // 재고 부족 상품 체크 (미사용 코드)
    if (prod && prod.quantity < QUANTITY_THRESHOLDS.LOW_STOCK_WARNING) {
    }

    // UI 업데이트
    handleCalculateCartStuff();
    updateProductOptions();
  }
});
