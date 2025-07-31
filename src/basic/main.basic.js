import {
  Header,
  GridContainer,
  LeftColumn,
  RightColumn,
} from './components/layout';
import {
  ManualToggle,
  ManualOverlay,
  ManualColumn,
  ManualModal,
} from './components/manual';
import {
  ProductSelector,
  generateProductOptions,
  CartContainer,
  CartItem,
} from './components/ui';
import {
  PRODUCT_KEYBOARD,
  PRODUCT_MOUSE,
  PRODUCT_MONITOR_ARM,
  PRODUCT_LAPTOP_POUCH,
  PRODUCT_SPEAKER,
  QUANTITY_THRESHOLDS,
  POINT_RATES_BULK_BONUS,
  PRODUCT_DEFAULT_DISCOUNT_RATES,
} from './constants';
import { initProductList } from './data';

// 상품 데이터 및 장바구니 관련 변수
let productList;
let bonusPoints = 0;
let stockInfo;
let itemCount;
let lastSelectedProductId;
let selectElement;
let addButton;
let totalAmount = 0;
let sum;
let cartContainer;

// 주문 요약 컴포넌트 (오른쪽 컬럼)
function OrderSummary() {
  return `
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
}

// 메인 초기화 함수
function main() {
  // 초기값 설정
  totalAmount = 0;
  itemCount = 0;
  lastSelectedProductId = null;

  // 상품 데이터 초기화
  productList = initProductList();

  // ----------------------------------------
  // 기본 DOM 구조 생성
  // ----------------------------------------
  const root = document.getElementById('app');

  // 헤더 생성
  const header = Header({ itemCount: 0 });

  const gridContainer = GridContainer();
  const leftColumn = LeftColumn();
  const rightColumn = RightColumn();

  rightColumn.innerHTML = OrderSummary();
  sum = rightColumn.querySelector('#cart-total');

  const handleAddToCart = () => {
    const selectedProduct = productList[selectElement.selectedIndex];
    if (selectedProduct?.availableStock > 0) {
      // Todo: 구현
    }
  };
  // 상품 선택 컨테이너
  const selectorContainer = ProductSelector({ onAddToCart: handleAddToCart });
  // 상품 선택 요소들 생성
  selectElement = selectorContainer.querySelector('#product-select');
  // 장바구니 추가 버튼
  addButton = selectorContainer.querySelector('#add-to-cart');
  // 재고 상태 표시
  stockInfo = selectorContainer.querySelector('#stock-status');

  leftColumn.appendChild(selectorContainer);

  // 장바구니 표시 영역
  cartContainer = CartContainer();
  leftColumn.appendChild(cartContainer);

  // ----------------------------------------
  // 도움말 모달 생성
  // ----------------------------------------
  const handleManualToggle = () => {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };

  const handleManualClose = () => {
    manualOverlay.classList.add('hidden');
    manualColumn.classList.add('translate-x-full');
  };

  const manualToggle = ManualToggle({ onToggle: handleManualToggle });
  const manualOverlay = ManualOverlay({ onClose: handleManualClose });
  const manualColumn = ManualColumn();

  // ----------------------------------------
  // DOM 구조 조립
  // ----------------------------------------
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);

  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  // ----------------------------------------
  // 초기 데이터 설정
  // ----------------------------------------
  let initStock = 0;
  for (let i = 0; i < productList.length; i++) {
    initStock += productList[i].availableStock;
  }

  onUpdateSelectOptions();
  handleCalculateCartStuff();

  // ----------------------------------------
  // 타이머 기반 이벤트 설정
  // ----------------------------------------

  // 번개세일 타이머
  const lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * productList.length);
      const luckyItem = productList[luckyIdx];
      if (luckyItem.availableStock > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
        luckyItem.onSale = true;
        alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, 30000);
  }, lightningDelay);

  // 추천 상품 타이머
  setTimeout(function () {
    setInterval(function () {
      if (cartContainer.children.length === 0) {
      }
      if (lastSelectedProductId) {
        let suggest = null;
        for (let k = 0; k < productList.length; k++) {
          if (productList[k].id !== lastSelectedProductId) {
            if (productList[k].availableStock > 0) {
              if (!productList[k].suggestSale) {
                suggest = productList[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert(
            `💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
          );
          suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

// ========================================
// 상품 옵션 업데이트 함수
// ========================================

function onUpdateSelectOptions() {
  generateProductOptions({ selectElement, productList });
}

// ========================================
// 장바구니 계산 및 표시 함수
// ========================================

function handleCalculateCartStuff() {
  // 변수 선언
  let subTotal;
  let idx;
  let originalTotal;
  let itemDisc;
  let savedAmount;
  let points;
  let previousCount;
  let stockMsg;
  let pts;
  let hasP1;
  let hasP2;
  let loyaltyDiv;

  const cartItems = cartContainer.children;
  const bulkDisc = subTotal;
  const itemDiscounts = [];
  const lowStockItems = [];

  // 초기값 설정
  totalAmount = 0;
  itemCount = 0;
  originalTotal = totalAmount;
  subTotal = 0;

  // ----------------------------------------
  // 재고 부족 상품 체크
  // ----------------------------------------
  for (idx = 0; idx < productList.length; idx++) {
    if (
      productList[idx].availableStock < 5 &&
      productList[idx].availableStock > 0
    ) {
      lowStockItems.push(productList[idx].name);
    }
  }

  // ----------------------------------------
  // 장바구니 아이템별 계산
  // ----------------------------------------
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      // 상품 정보 찾기
      const curItem = findProductById(cartItems[i].id);

      const quantityElem = cartItems[i].querySelector('.quantity-number');
      let disc;

      // 수량 및 가격 계산
      const quantity = parseInt(quantityElem.textContent);
      const itemTot = curItem.val * quantity;
      disc = 0;
      itemCount += quantity;
      subTotal += itemTot;

      // 수량별 스타일 적용
      const itemDiv = cartItems[i];
      const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
      priceElems.forEach(function (elem) {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight = quantity >= 10 ? 'bold' : 'normal';
        }
      });

      // 개별 상품 할인율 적용
      if (quantity >= 10) {
        disc = getProductDiscountRate(curItem.id);
        if (disc > 0) {
          itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
        }
      }

      totalAmount += itemTot * (1 - disc);
    })();
  }

  // ----------------------------------------
  // 대량 구매 할인 적용
  // ----------------------------------------
  let discountRate = 0;
  originalTotal = subTotal;
  if (itemCount >= 30) {
    totalAmount = (subTotal * 75) / 100;
    discountRate = 25 / 100;
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  // ----------------------------------------
  // 화요일 특별 할인 적용
  // ----------------------------------------
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday) {
    if (totalAmount > 0) {
      totalAmount = (totalAmount * 90) / 100;
      discountRate = 1 - totalAmount / originalTotal;
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  // ----------------------------------------
  // UI 업데이트
  // ----------------------------------------

  // 아이템 수량 표시
  document.getElementById('item-count').textContent =
    `🛍️ ${itemCount} items in cart`;

  // 주문 요약 세부사항 업데이트
  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';

  if (subTotal > 0) {
    // 각 상품별 요약 표시
    for (let i = 0; i < cartItems.length; i++) {
      const curItem = findProductById(cartItems[i].id);
      const quantityElem = cartItems[i].querySelector('.quantity-number');
      const q = parseInt(quantityElem.textContent);
      const itemTotal = curItem.val * q;
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }

    // 소계 표시
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTotal.toLocaleString()}</span>
      </div>
    `;

    // 할인 정보 표시
    if (itemCount >= 30) {
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
    if (isTuesday) {
      if (totalAmount > 0) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
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

  // ----------------------------------------
  // 총액 및 포인트 업데이트
  // ----------------------------------------

  // 총액 표시
  const totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(totalAmount).toLocaleString()}`;
  }

  // 적립 포인트 표시
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    points = Math.floor(totalAmount / 1000);
    if (points > 0) {
      loyaltyPointsDiv.textContent = `적립 포인트: ${points}p`;
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }

  // 할인 정보 표시
  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  if (discountRate > 0 && totalAmount > 0) {
    savedAmount = originalTotal - totalAmount;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }

  // 아이템 카운트 업데이트
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = `🛍️ ${itemCount} items in cart`;
    if (previousCount !== itemCount) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }

  // ----------------------------------------
  // 재고 상태 메시지 업데이트
  // ----------------------------------------
  stockMsg = '';
  for (let stockIdx = 0; stockIdx < productList.length; stockIdx++) {
    const item = productList[stockIdx];
    if (item.availableStock < 5) {
      if (item.availableStock > 0) {
        stockMsg = `${stockMsg + item.name}: 재고 부족 (${item.availableStock}개 남음)\n`;
      } else {
        stockMsg = `${stockMsg + item.name}: 품절\n`;
      }
    }
  }
  stockInfo.textContent = stockMsg;

  handleStockInfoUpdate();
  doRenderBonusPoints();
}

// ========================================
// 보너스 포인트 계산 및 렌더링 함수
// ========================================

const doRenderBonusPoints = () => {
  let finalPoints;
  let hasKeyboard;
  let hasMouse;
  let hasMonitorArm;

  // 장바구니가 비어있으면 포인트 숨김
  if (cartContainer.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }

  // ----------------------------------------
  // 기본 포인트 계산
  // ----------------------------------------
  const basePoints = Math.floor(totalAmount / 1000);
  finalPoints = 0;
  const pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  // ----------------------------------------
  // 화요일 포인트 2배
  // ----------------------------------------
  if (new Date().getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2;
      pointsDetail.push('화요일 2배');
    }
  }

  // ----------------------------------------
  // 세트 상품 보너스 포인트
  // ----------------------------------------
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  const nodes = cartContainer.children;

  // 장바구니에 있는 상품 종류 확인
  for (const node of nodes) {
    const product = findProductById(node.id);
    if (!product) continue;

    if (product.id === PRODUCT_KEYBOARD) {
      hasKeyboard = true;
    } else if (product.id === PRODUCT_MOUSE) {
      hasMouse = true;
    } else if (product.id === PRODUCT_MONITOR_ARM) {
      hasMonitorArm = true;
    }
  }

  // 키보드 + 마우스 세트 보너스
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + 50;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }

  // 풀세트 보너스
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('풀세트 구매 +100p');
  }

  // 수량별 보너스 포인트
  const bonusPerBulkInfo = getBonusPerBulkInfo(itemCount);
  if (bonusPerBulkInfo) {
    finalPoints += bonusPerBulkInfo.points;
    pointsDetail.push(
      `대량구매(${bonusPerBulkInfo.threshold}개+) +${bonusPerBulkInfo.points}p`,
    );
  }

  // ----------------------------------------
  // 포인트 UI 업데이트
  // ----------------------------------------
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

// ========================================
// 재고 관리 함수들
// ========================================

function onGetStockTotal() {
  let sum;
  let i;
  let currentProduct;

  sum = 0;
  for (i = 0; i < productList.length; i++) {
    currentProduct = productList[i];
    sum += currentProduct.availableStock;
  }
  return sum;
}

const handleStockInfoUpdate = () => {
  let infoMsg = '';
  let messageOptimizer;

  const totalStock = onGetStockTotal();

  // 재고 부족 경고 체크
  if (totalStock < 30) {
  }

  // 각 상품별 재고 상태 메시지 생성
  productList.forEach(function (item) {
    if (item.availableStock < 5) {
      if (item.availableStock > 0) {
        infoMsg = `${infoMsg + item.name}: 재고 부족 (${item.availableStock}개 남음)\n`;
      } else {
        infoMsg = `${infoMsg + item.name}: 품절\n`;
      }
    }
  });

  stockInfo.textContent = infoMsg;
};

// ========================================
// 장바구니 가격 업데이트 함수
// ========================================

function doUpdatePricesInCart() {
  let totalCount = 0;
  let j = 0;

  // 총 수량 계산 (첫 번째 방법)
  while (cartContainer.children[j]) {
    const quantity =
      cartContainer.children[j].querySelector('.quantity-number');
    totalCount += quantity ? parseInt(quantity.textContent) : 0;
    j++;
  }

  // 총 수량 계산 (두 번째 방법)
  totalCount = 0;
  for (j = 0; j < cartContainer.children.length; j++) {
    totalCount += parseInt(
      cartContainer.children[j].querySelector('.quantity-number').textContent,
    );
  }

  // ----------------------------------------
  // 각 장바구니 아이템의 가격 업데이트
  // ----------------------------------------
  const cartItems = cartContainer.children;
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    const product = findProductById(itemId);

    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');

      // 할인 상태에 따른 가격 및 이름 표시
      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-purple-600">₩${product.val.toLocaleString()}</span>`;
        nameDiv.textContent = `⚡💝${product.name}`;
      } else if (product.onSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-red-500">₩${product.val.toLocaleString()}</span>`;
        nameDiv.textContent = `⚡${product.name}`;
      } else if (product.suggestSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-blue-500">₩${product.val.toLocaleString()}</span>`;
        nameDiv.textContent = `💝${product.name}`;
      } else {
        priceDiv.textContent = `₩${product.val.toLocaleString()}`;
        nameDiv.textContent = product.name;
      }
    }
  }

  handleCalculateCartStuff();
}

// ========================================
// 메인 실행 및 이벤트 리스너 설정
// ========================================

// 애플리케이션 초기화
main();

// ----------------------------------------
// 장바구니 추가 버튼 이벤트
// ----------------------------------------
addButton.addEventListener('click', function () {
  const selItem = selectElement.value;
  let hasItem = false;

  // 선택된 상품 유효성 검사
  for (let idx = 0; idx < productList.length; idx++) {
    if (productList[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }

  if (!selItem || !hasItem) {
    return;
  }

  // 선택된 상품 정보 가져오기
  const itemToAdd = findProductById(selItem);

  if (itemToAdd && itemToAdd.availableStock > 0) {
    const item = document.getElementById(itemToAdd['id']);

    // 이미 장바구니에 있는 상품인 경우 수량 증가
    if (item) {
      const quantityElem = item.querySelector('.quantity-number');
      const newQuantity = parseInt(quantityElem['textContent']) + 1;
      if (
        newQuantity <=
        itemToAdd.availableStock + parseInt(quantityElem.textContent)
      ) {
        quantityElem.textContent = newQuantity;
        itemToAdd['availableStock']--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // 새로운 상품을 장바구니에 추가
      const newItem = CartItem(itemToAdd);
      cartContainer.appendChild(newItem);
      itemToAdd.availableStock--;
    }

    handleCalculateCartStuff();
    lastSelectedProductId = selItem;
  }
});

// ----------------------------------------
// 장바구니 수량 변경 및 삭제 이벤트
// ----------------------------------------
cartContainer.addEventListener('click', function (event) {
  const tgt = event.target;
  let quantityElem;

  if (
    tgt.classList.contains('quantity-change') ||
    tgt.classList.contains('remove-item')
  ) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    const prod = findProductById(prodId);

    // 수량 변경 처리
    if (tgt.classList.contains('quantity-change')) {
      const quantityChange = parseInt(tgt.dataset.change);
      quantityElem = itemElem.querySelector('.quantity-number');
      const currentQuantity = parseInt(quantityElem.textContent);
      const newQuantity = currentQuantity + quantityChange;

      if (
        newQuantity > 0 &&
        newQuantity <= prod.availableStock + currentQuantity
      ) {
        quantityElem.textContent = newQuantity;
        prod.availableStock -= quantityChange;
      } else if (newQuantity <= 0) {
        prod.availableStock += currentQuantity;
        itemElem.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    }
    // 상품 삭제 처리
    else if (tgt.classList.contains('remove-item')) {
      quantityElem = itemElem.querySelector('.quantity-number');
      const removeQuantity = parseInt(quantityElem.textContent);
      prod.availableStock += removeQuantity;
      itemElem.remove();
    }

    // 재고 부족 상품 체크
    if (prod && prod.availableStock < 5) {
    }

    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
});

function findProductById(productId) {
  return productList.find((product) => product.id === productId);
}

function getBonusPerBulkInfo(itemCount) {
  if (itemCount >= QUANTITY_THRESHOLDS.BONUS_LARGE) {
    return {
      points: POINT_RATES_BULK_BONUS.LARGE,
      threshold: QUANTITY_THRESHOLDS.BONUS_LARGE,
    };
  }
  if (itemCount >= QUANTITY_THRESHOLDS.BONUS_MEDIUM) {
    return {
      points: POINT_RATES_BULK_BONUS.MEDIUM,
      threshold: QUANTITY_THRESHOLDS.BONUS_MEDIUM,
    };
  }
  if (itemCount >= QUANTITY_THRESHOLDS.BONUS_SMALL) {
    return {
      points: POINT_RATES_BULK_BONUS.SMALL,
      threshold: QUANTITY_THRESHOLDS.BONUS_SMALL,
    };
  }
  return null;
}

function getProductDiscountRate(productId) {
  switch (productId) {
    case PRODUCT_KEYBOARD:
      return PRODUCT_DEFAULT_DISCOUNT_RATES.KEYBOARD;
    case PRODUCT_MOUSE:
      return PRODUCT_DEFAULT_DISCOUNT_RATES.MOUSE;
    case PRODUCT_MONITOR_ARM:
      return PRODUCT_DEFAULT_DISCOUNT_RATES.MONITOR_ARM;
    case PRODUCT_LAPTOP_POUCH:
      return PRODUCT_DEFAULT_DISCOUNT_RATES.LAPTOP_POUCH;
    case PRODUCT_SPEAKER:
      return PRODUCT_DEFAULT_DISCOUNT_RATES.SPEAKER;
    default:
      return 0;
  }
}
