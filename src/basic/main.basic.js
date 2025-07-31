// 상수 import
import { DISCOUNT_THRESHOLDS, UI_CONSTANTS } from './constants/index.js';

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
} from './services/product/ProductService.js';

// DiscountService import
import { calculateTotalDiscountRate } from './services/discount/DiscountService.js';

// PointService import
import { createPointInfo } from './services/point/PointService.js';

// CartService import
import { createInitialCartState, addItemToCart } from './services/cart/CartService.js';

// Components import (새로운 폴더 구조)
import {
  createHeader,
  createGridContainer,
  createProductSelector,
  createStockInfo,
  createCartDisplay,
  createRightColumn,
  createManualOverlay,
  createManualToggle,
  createManualColumn,
  renderCartItem,
  renderDiscountInfo,
  renderLoyaltyPoints,
} from './components/index.js';

// Utils import
import {
  createAddToCartButton,
  createSelectorContainer,
  createLeftColumn,
} from './utils/UIRenderer.js';

// Renderers import
import {
  renderProductOptions,
  renderOrderSummaryDetails,
  renderTuesdaySpecial,
  renderTotalAmount,
  renderItemCount,
  renderStockMessages,
  updateCartPrices,
} from './utils/renderers/index.js';

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
let cartState; // CartService를 위한 상태 추가

// ProductService 래퍼 (CartService에서 사용하기 위한 인터페이스)
const productService = {
  getProductById: (productId) => getProductById(productList, productId),
  decreaseStock: (productId, quantity) => {
    const result = decreaseStock(productList, productId, quantity);
    if (result.success) {
      productList = result.products;
    }
    return result;
  },
  increaseStock: (productId, quantity) => {
    const result = increaseStock(productList, productId, quantity);
    if (result.success) {
      productList = result.products;
    }
    return result;
  },
};

function main() {
  totalAmount = 0;
  itemCount = 0;
  lastSelectedProductId = null;

  // 상품 정보 초기화 - ProductService 사용
  productList = initializeProducts();

  // CartService 상태 초기화
  cartState = createInitialCartState();

  const root = document.getElementById('app');

  // UI 컴포넌트들 생성
  const header = createHeader();

  productSelector = createProductSelector();
  addToCartButton = createAddToCartButton();
  stockInfoElement = createStockInfo();

  const selectorContainer = createSelectorContainer(
    productSelector,
    addToCartButton,
    stockInfoElement,
  );
  cartDisplayElement = createCartDisplay();

  const leftColumn = createLeftColumn(selectorContainer, cartDisplayElement);
  const rightColumn = createRightColumn();

  const manualOverlay = createManualOverlay();
  const manualToggle = createManualToggle();
  const manualColumn = createManualColumn();

  const gridContainer = createGridContainer(leftColumn, rightColumn);

  // DOM에 요소들 추가
  manualOverlay.appendChild(manualColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  // orderSummaryElement 참조 설정
  orderSummaryElement = rightColumn.querySelector('#cart-total');

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
  return calculateTotalDiscountRate(itemCount, subTot, currentAmount);
}

// 주문 요약 상세 내역 갱신
function updateOrderSummary(cartItems, subTot, itemCount, itemDiscounts) {
  renderOrderSummaryDetails(cartItems, productList, subTot, itemDiscounts);
}

// 상품 선택 옵션 렌더링 및 재고 상태 표시
function updateProductOptions() {
  renderProductOptions(productSelector, productList);

  // ProductService의 getTotalStock 함수 사용
  const totalStock = getTotalStock(productList);

  if (totalStock < UI_CONSTANTS.TOTAL_STOCK_THRESHOLD) {
    productSelector.style.borderColor = 'orange';
  } else {
    productSelector.style.borderColor = '';
  }
}

// 장바구니, 할인, 포인트 등 계산 및 화면 갱신
function calculateCartSummary() {
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
  renderTuesdaySpecial(isTuesday, totalAmount);

  // 장바구니 수량 표시 갱신
  renderItemCount(itemCount);

  // 주문 요약(상품별, 할인, 배송 등) 갱신
  updateOrderSummary(cartItems, subTot, itemCount, itemDiscounts);

  // 총 결제 금액 표시 갱신
  renderTotalAmount(totalAmount, orderSummaryElement);

  // 적립 포인트 표시 갱신 - PointService 사용
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    // CartService 상태에서 장바구니 아이템 정보 추출
    const cartItems = cartState.items.map((item) => {
      const product = productService.getProductById(item.id);
      return {
        id: item.id,
        quantity: item.quantity,
        name: product ? product.name : '',
        price: product ? product.price : 0,
      };
    });

    // PointService를 사용하여 포인트 계산
    const pointInfo = createPointInfo(totalAmount, cartItems);
    points = pointInfo.totalPoints;

    renderLoyaltyPoints(points, pointInfo);
  }

  // 할인 정보 표시 갱신
  renderDiscountInfo(discRate, originalTotal, totalAmount);

  // 장바구니 수량 변화 애니메이션 표시
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
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
  if (cartDisplayElement.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }

  // CartService 상태에서 장바구니 아이템 정보 추출
  const cartItems = cartState.items.map((item) => {
    const product = productService.getProductById(item.id);
    return {
      id: item.id,
      quantity: item.quantity,
      name: product ? product.name : '',
      price: product ? product.price : 0,
    };
  });

  // PointService를 사용하여 포인트 정보 생성
  const pointInfo = createPointInfo(totalAmount, cartItems);
  bonusPoints = pointInfo.totalPoints;

  const ptsTag = document.getElementById('loyalty-points');

  if (ptsTag) {
    if (bonusPoints > 0) {
      ptsTag.innerHTML =
        `<div>적립 포인트: <span class="font-bold">${bonusPoints}p</span></div>` +
        `<div class="text-2xs opacity-70 mt-1">${pointInfo.detailText}</div>`;
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

  renderStockMessages(lowStockProducts, outOfStockProducts, stockInfoElement);
}

// 장바구니 내 상품 가격/이름 갱신 및 전체 금액 재계산
// updateCartPrices 함수는 utils/renderers/CartRenderer.js에서 import됨

// CartService를 사용한 장바구니 아이템 추가 함수
function addItemToCartUI(productId, quantity = 1) {
  const result = addItemToCart(cartState, productId, quantity, productService);

  if (result.success) {
    const { cartState: newCartState } = result;
    cartState = newCartState;
    renderCartItems();
    calculateCartSummary();
    lastSelectedProductId = productId;
  } else {
    alert(result.message);
  }
}

// CartService 상태를 기반으로 UI 렌더링
function renderCartItems() {
  cartDisplayElement.innerHTML = '';

  cartState.items.forEach((item) => {
    const product = productService.getProductById(item.id);
    if (!product) return;

    const newItem = renderCartItem(item, product);
    cartDisplayElement.appendChild(newItem);
  });
}

main();

// 장바구니 추가 버튼 클릭 이벤트 - CartService 사용
addToCartButton.addEventListener('click', function () {
  const selItem = productSelector.value;

  if (!selItem) {
    return;
  }

  // CartService를 사용하여 장바구니에 추가
  addItemToCartUI(selItem, 1);
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
