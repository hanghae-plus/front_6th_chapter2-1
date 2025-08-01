import {
  getProducts,
  setBonusPoints,
  setItemCount,
  setTotalAmount,
  getTotalAmount,
  getItemCount,
  getProductById,
} from '../../shared/core/business-state.js';
import {
  getCartDisplayElement,
  getStockInfoElement,
} from '../../shared/core/dom-refs.js';
import { calculateTotalPoints } from '../order/PointService.js';
import { buildLowStockWarning } from '../product/StockService.js';
import * as CartService from './CartService.js';
import * as CartRenderer from './CartRenderer.js';

/**
 * 장바구니 전체 업데이트 오케스트레이션
 */
export function updateCartDisplay() {
  const cartItems = getCartDisplayElement().children;

  // 1. 상태 초기화
  setTotalAmount(0);
  setItemCount(0);

  // 2. DOM에서 장바구니 데이터 추출
  const cartData = CartService.extractCartData(cartItems);

  // 3. 장바구니 전체 계산
  const cartResult = CartService.calculateCart(cartData, getProductById);
  const {
    subtotal,
    finalAmount,
    totalQuantity,
    totalDiscountRate,
    isTuesdayToday,
    individualDiscountInfo,
  } = cartResult;

  // 4. 상태 업데이트
  setTotalAmount(finalAmount);
  setItemCount(totalQuantity);

  // 5. UI 렌더링
  CartRenderer.renderOrderSummary({
    finalAmount,
    subtotal,
    cartData,
    totalQuantity,
    totalDiscountRate,
    isTuesdayToday,
    individualDiscountInfo,
  });

  CartRenderer.renderCartCount(totalQuantity);
  updateStockWarning();

  // 6. 포인트 계산 및 표시
  updateBonusPoints();
}

/**
 * 재고 경고 메시지
 */
function updateStockWarning() {
  const warningMessage = buildLowStockWarning(getProducts());
  const stockInfoElement = getStockInfoElement();
  if (stockInfoElement) {
    stockInfoElement.textContent = warningMessage;
  }
}

/**
 * 포인트 계산 및 표시
 */
function updateBonusPoints() {
  const cartItems = getCartDisplayElement().children;

  // 빈 장바구니 체크
  if (cartItems.length === 0) {
    CartRenderer.hideLoyaltyPoints();
    return;
  }

  const cartData = CartService.extractCartData(cartItems);

  // 포인트 계산
  const pointsResult = calculateTotalPoints(
    getTotalAmount(),
    getItemCount(),
    cartData,
    getProductById
  );
  const { finalPoints, pointsDetails } = pointsResult;

  // 상태 업데이트 및 UI 표시
  setBonusPoints(finalPoints);
  CartRenderer.renderLoyaltyPoints(finalPoints, pointsDetails);
}

/**
 * 장바구니 가격 업데이트 (세일 적용 시)
 */
export function updateCartPrices() {
  const cartItems = getCartDisplayElement().children;
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    const product = getProductById(itemId);
    if (!product) continue;

    const priceDiv = cartItems[i].querySelector('.text-lg');
    const nameDiv = cartItems[i].querySelector('h3');

    // 할인 상태별 가격 표시
    if (product.isOnSale && product.isSuggestedSale) {
      // 번개세일 + 추천할인
      priceDiv.innerHTML =
        '<span class="line-through text-gray-400">₩' +
        product.originalPrice.toLocaleString() +
        '</span> <span class="text-purple-600">₩' +
        product.price.toLocaleString() +
        '</span>';
      nameDiv.textContent = '⚡💝' + product.name;
    } else if (product.isOnSale) {
      // 번개세일만
      priceDiv.innerHTML =
        '<span class="line-through text-gray-400">₩' +
        product.originalPrice.toLocaleString() +
        '</span> <span class="text-red-500">₩' +
        product.price.toLocaleString() +
        '</span>';
      nameDiv.textContent = '⚡' + product.name;
    } else if (product.isSuggestedSale) {
      // 추천할인만
      priceDiv.innerHTML =
        '<span class="line-through text-gray-400">₩' +
        product.originalPrice.toLocaleString() +
        '</span> <span class="text-blue-500">₩' +
        product.price.toLocaleString() +
        '</span>';
      nameDiv.textContent = '💝' + product.name;
    } else {
      // 일반 가격
      priceDiv.textContent = '₩' + product.price.toLocaleString();
      nameDiv.textContent = product.name;
    }
  }

  // 계산 함수 재호출
  updateCartDisplay();
}

/**
 * 장바구니 아이템들 렌더링
 */
export function renderCartItems(cartData) {
  CartRenderer.renderCartItems(cartData, getProductById);
}

/**
 * 장바구니 수량 표시 렌더링
 */
export function renderCartCount(itemCount) {
  CartRenderer.renderCartCount(itemCount);
}
