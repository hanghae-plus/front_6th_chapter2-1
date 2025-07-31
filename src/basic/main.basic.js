import { calculateCartTotals, calculateDiscountedTotal } from './cartUtils';
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
  PointSummary,
  OrderSummary,
  OrderSummaryDetails,
  DiscountSummary,
  PriceSummary,
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
  TIMER_INTERVAL,
} from './constants';
import { initProductList } from './data';
import {
  attachCartEventListener,
  attachManualEventListener,
  attachAddToCartEventListener,
} from './eventListeners';
import { lightningTimer, recommendTimer } from './timer';
import {
  isTuesday,
  getProductDiscountRate,
  getBonusPerBulkInfo,
} from './utils';

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

  const orderSummaryElement = OrderSummary();
  rightColumn.appendChild(orderSummaryElement);
  sum = rightColumn.querySelector('#cart-total');

  // 상품 선택 컨테이너
  const selectorContainer = ProductSelector();
  selectElement = selectorContainer.querySelector('#product-select');
  addButton = selectorContainer.querySelector('#add-to-cart');
  stockInfo = selectorContainer.querySelector('#stock-status');

  leftColumn.appendChild(selectorContainer);

  // 장바구니 표시 영역
  cartContainer = CartContainer();
  leftColumn.appendChild(cartContainer);

  // 도움말 모달 생성
  const manualToggle = ManualToggle();
  const manualOverlay = ManualOverlay();
  const manualColumn = ManualColumn();
  attachAddToCartEventListener(addButton, handleAddToCart);
  // 장바구니 이벤트 리스너
  attachCartEventListener(
    cartContainer,
    findProductById,
    handleCalculateCartStuff,
    onUpdateSelectOptions,
  );
  attachManualEventListener(manualToggle, manualOverlay, manualColumn);

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
  lightningTimer(productList, onUpdateSelectOptions, doUpdatePricesInCart);
  recommendTimer(
    productList,
    lastSelectedProductId,
    onUpdateSelectOptions,
    doUpdatePricesInCart,
  );
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
  // 장바구니 아이템별 계산 (순수 함수 사용)
  // ----------------------------------------
  const {
    subTotal: calculatedSubTotal,
    itemCount: calculatedItemCount,
    itemDiscounts: calculatedDiscounts,
  } = calculateCartTotals(cartItems, findProductById);
  subTotal = calculatedSubTotal;
  itemCount = calculatedItemCount;
  itemDiscounts.push(...calculatedDiscounts);

  // 개별 상품 할인 적용된 총액 계산
  totalAmount = calculateDiscountedTotal(cartItems, findProductById);

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
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday()) {
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
  summaryDetails.appendChild(
    OrderSummaryDetails({
      findProductById,
      cartItems,
      subTotal,
      itemCount,
      itemDiscounts,
      totalAmount,
    }),
  );

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
  discountInfoDiv.appendChild(
    DiscountSummary(discountRate, totalAmount, originalTotal),
  );

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
  if (isTuesday()) {
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

  // 포인트 UI 업데이트
  bonusPoints = finalPoints;
  const pointsTag = document.getElementById('loyalty-points');
  pointsTag.innerHTML = '';
  const pointSummary = PointSummary({ bonusPoints, pointsDetail });
  pointsTag.appendChild(pointSummary);
  pointsTag.style.display = 'block';
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
      PriceSummary(priceDiv, product);
      nameDiv.textContent =
        (product.onSale && product.suggestSale
          ? '⚡💝'
          : product.onSale
            ? '⚡'
            : product.suggestSale
              ? '💝'
              : '') + product.name;
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
function handleAddToCart() {
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
}

function findProductById(productId) {
  return productList.find((product) => product.id === productId);
}
