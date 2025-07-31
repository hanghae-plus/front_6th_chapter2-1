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
import {
  createInitialCartState,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
} from './services/cart/CartService.js';

// cartStore import
import { cartStore, cartStoreActions } from './store/cartStore.js';

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

// UI 요소들 (cartStore와 분리)
let stockInfoElement;
let productSelector;
let addToCartButton;
let cartDisplayElement;
let orderSummaryElement;

// CartService를 위한 상태 관리
let cartState = createInitialCartState();

// ProductService 래퍼 (CartService에서 사용하기 위한 인터페이스)
const productService = {
  getProductById: (productId) => getProductById(cartStore.products, productId),
  decreaseStock: (productId, quantity) => {
    const result = decreaseStock(cartStore.products, productId, quantity);
    if (result.success) {
      cartStore.products = result.products;
    }
    return result;
  },
  increaseStock: (productId, quantity) => {
    const result = increaseStock(cartStore.products, productId, quantity);
    if (result.success) {
      cartStore.products = result.products;
    }
    return result;
  },
};

function main() {
  // cartStore 초기화
  cartStoreActions.reset();

  // 상품 정보 초기화 - ProductService 사용
  const initialProducts = initializeProducts();
  cartStoreActions.setProducts(initialProducts);

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
      const luckyIdx = Math.floor(Math.random() * cartStore.products.length);
      const luckyItem = cartStore.products[luckyIdx];
      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        // ProductService의 applySale 함수 사용
        const result = applySale(cartStore.products, luckyItem.id, 0.2);
        if (result.success) {
          cartStore.products = result.products;
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
      if (cartState.lastSelectedProductId && cartDisplayElement.children.length > 0) {
        let suggest = null;
        for (let k = 0; k < cartStore.products.length; k++) {
          if (cartStore.products[k].id !== cartState.lastSelectedProductId) {
            if (cartStore.products[k].quantity > 0) {
              if (!cartStore.products[k].suggestSale) {
                suggest = cartStore.products[k];
                break;
              }
            }
          }
        }

        if (suggest) {
          alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          const result = applySuggestSale(cartStore.products, suggest.id, 0.05);
          if (result.success) {
            cartStore.products = result.products;
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
    for (let j = 0; j < cartStore.products.length; j++) {
      if (cartStore.products[j].id === cartItems[i].id) {
        curItem = cartStore.products[j];
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
  renderOrderSummaryDetails(cartItems, cartStore.products, subTot, itemDiscounts);
}

// 상품 선택 옵션 렌더링 및 재고 상태 표시
function updateProductOptions() {
  renderProductOptions(productSelector, cartStore.products);

  // ProductService의 getTotalStock 함수 사용
  const totalStock = getTotalStock(cartStore.products);

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

  // cartStore 상태 업데이트
  cartStore.totalAmount = calcTotalAmount;
  cartStore.itemCount = calcItemCount;

  const originalTotal = subTot;

  // 할인 총합 계산 적용
  const { finalAmount, discountRate, isTuesday } = calculateTotalDiscount(
    subTot,
    cartStore.itemCount,
    cartStore.totalAmount,
  );
  cartStore.totalAmount = finalAmount;
  const discRate = discountRate;

  // 화요일 특별 할인 UI 표시
  renderTuesdaySpecial(isTuesday, cartStore.totalAmount);

  // 장바구니 수량 표시 갱신
  renderItemCount(cartStore.itemCount);

  // 주문 요약(상품별, 할인, 배송 등) 갱신
  updateOrderSummary(cartItems, subTot, cartStore.itemCount, itemDiscounts);

  // 총 결제 금액 표시 갱신
  renderTotalAmount(cartStore.totalAmount, orderSummaryElement);

  // 적립 포인트 표시 갱신 - PointService 사용
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    // cartStore에서 장바구니 아이템 정보 추출
    const cartItemsData = Array.from(cartItems).map((item) => {
      const productId = item.id;
      const product = productService.getProductById(productId);
      const quantity = parseInt(item.querySelector('.quantity-number').textContent);
      return {
        id: productId,
        quantity,
        name: product ? product.name : '',
        price: product ? product.price : 0,
      };
    });

    // PointService를 사용하여 포인트 계산
    const pointInfo = createPointInfo(cartStore.totalAmount, cartItemsData);
    points = pointInfo.totalPoints;

    // cartStore에 포인트 업데이트
    cartStoreActions.updateBonusPoints(points);

    renderLoyaltyPoints(points, pointInfo);
  }

  // 할인 정보 표시 갱신
  renderDiscountInfo(discRate, originalTotal, cartStore.totalAmount);

  // 장바구니 수량 변화 애니메이션 표시
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    if (previousCount !== cartStore.itemCount) {
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

  // cartStore에서 장바구니 아이템 정보 추출
  const cartItems = cartDisplayElement.children;
  const cartItemsData = Array.from(cartItems).map((item) => {
    const productId = item.id;
    const product = productService.getProductById(productId);
    const quantity = parseInt(item.querySelector('.quantity-number').textContent);
    return {
      id: productId,
      quantity,
      name: product ? product.name : '',
      price: product ? product.price : 0,
    };
  });

  // PointService를 사용하여 포인트 정보 생성
  const pointInfo = createPointInfo(cartStore.totalAmount, cartItemsData);
  cartStore.bonusPoints = pointInfo.totalPoints;

  const ptsTag = document.getElementById('loyalty-points');

  if (ptsTag) {
    if (cartStore.bonusPoints > 0) {
      ptsTag.innerHTML =
        `<div>적립 포인트: <span class="font-bold">${cartStore.bonusPoints}p</span></div>` +
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
  const lowStockProducts = getLowStockProducts(cartStore.products);
  // 품절 상품 조회
  const outOfStockProducts = getOutOfStockProducts(cartStore.products);

  renderStockMessages(lowStockProducts, outOfStockProducts, stockInfoElement);
}

// 장바구니 내 상품 가격/이름 갱신 및 전체 금액 재계산
// updateCartPrices 함수는 utils/renderers/CartRenderer.js에서 import됨

// CartService를 사용한 장바구니 아이템 추가 함수
function addItemToCartUI(productId, quantity = 1) {
  const {
    success,
    cartState: newCartState,
    message,
  } = addItemToCart(cartState, productId, quantity, productService);

  if (success) {
    // CartService 상태 업데이트
    cartState = newCartState;

    // DOM에 아이템 추가
    addItemToCartDOM(productId, quantity);
    calculateCartSummary();
  } else {
    alert(message || '재고가 부족하거나 상품을 찾을 수 없습니다.');
  }
}

// DOM에 장바구니 아이템 추가
function addItemToCartDOM(productId, quantity = 1) {
  const product = productService.getProductById(productId);
  if (!product) return;

  // 기존 아이템이 있는지 확인
  const existingItem = cartDisplayElement.querySelector(`#${productId}`);

  if (existingItem) {
    // 기존 아이템 수량 증가
    const qtyElement = existingItem.querySelector('.quantity-number');
    const currentQty = parseInt(qtyElement.textContent);
    qtyElement.textContent = currentQty + quantity;
  } else {
    // 새 아이템 생성
    const newItem = createCartItemElement(product, quantity);
    cartDisplayElement.appendChild(newItem);
  }
}

// 장바구니 아이템 DOM 요소 생성
function createCartItemElement(product, quantity) {
  const itemDiv = document.createElement('div');
  itemDiv.id = product.id;
  itemDiv.className =
    'cart-item bg-white rounded-lg shadow-md p-4 mb-4 border-b border-gray-200 first:pt-0 last:border-b-0';

  itemDiv.innerHTML = `
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="w-16 h-16 bg-gradient-black rounded-lg flex items-center justify-center text-white font-bold text-lg">
          ${product.name.charAt(0)}
        </div>
        <div>
          <h3 class="font-semibold text-lg">${product.name}</h3>
          <p class="text-gray-600">₩${product.price.toLocaleString()}</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button class="quantity-change bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded" data-change="-1" data-product-id="${
          product.id
        }">
          -
        </button>
        <span class="quantity-number px-3 py-1 bg-white border rounded">${quantity}</span>
        <button class="quantity-change bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded" data-change="1" data-product-id="${
          product.id
        }">
          +
        </button>
        <button class="remove-item bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ml-2" data-product-id="${
          product.id
        }">
          Remove
        </button>
      </div>
    </div>
  `;

  return itemDiv;
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
    const prod = getProductById(cartStore.products, prodId);

    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change);
      const qtyElem = itemElem.querySelector('.quantity-number');
      const currentQty = parseInt(qtyElem.textContent);
      const newQty = currentQty + qtyChange;

      if (newQty > 0) {
        // CartService를 사용하여 수량 변경
        const result = updateCartItemQuantity(cartState, prodId, newQty, productService);
        if (result.success) {
          cartState = result.cartState;
          qtyElem.textContent = newQty;
        } else {
          alert(result.message || '재고가 부족합니다.');
        }
      } else {
        // CartService를 사용하여 상품 제거
        const result = removeItemFromCart(cartState, prodId, productService);
        if (result.success) {
          cartState = result.cartState;
          itemElem.remove();
        } else {
          alert(result.message || '상품 제거에 실패했습니다.');
        }
      }
    } else if (tgt.classList.contains('remove-item')) {
      const qtyElem = itemElem.querySelector('.quantity-number');
      const remQty = parseInt(qtyElem.textContent);

      // CartService를 사용하여 상품 제거
      const result = removeItemFromCart(cartState, prodId, productService);
      if (result.success) {
        cartState = result.cartState;
        itemElem.remove();
      } else {
        alert(result.message || '상품 제거에 실패했습니다.');
      }
    }

    if (prod && prod.quantity < UI_CONSTANTS.LOW_STOCK_THRESHOLD) {
      // 재고 부족 알림 (필요시 추가 구현)
    }

    calculateCartSummary();
    updateProductOptions();
  }
});
