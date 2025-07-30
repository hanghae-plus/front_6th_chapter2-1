// ==========================================
// 장바구니 컴포넌트 (리액트 스러운 패턴)
// ==========================================

import {
  calculateCartSubtotal,
  calculateFinalDiscounts,
  calculatePoints,
} from '../utils/pureFunctions.js';
// import { renderCartDisplay } from './CartDisplay.js';

/**
 * 장바구니 컴포넌트
 *
 * @description 리액트 함수형 컴포넌트 패턴을 모방한 장바구니 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Array} props.cartItems - 장바구니 아이템들
 * @param {Array} props.products - 상품 목록
 * @param {boolean} props.isTuesdayApplied - 화요일 할인 적용 여부
 * @returns {string} 장바구니 HTML 문자열
 */
export function CartComponent(props) {
  const { cartItems, products, isTuesdayApplied = false } = props;

  // 순수 함수로 계산 (fn 패턴)
  const subtotal = calculateCartSubtotal(cartItems, products);
  const itemCount = Array.from(cartItems).length;

  // 할인 계산
  const discountResult = calculateFinalDiscounts(
    subtotal,
    itemCount,
    [],
    isTuesdayApplied,
  );

  // 포인트 계산
  const pointsResult = calculatePoints(
    discountResult.finalAmount,
    cartItems,
    products,
    isTuesdayApplied,
  );

  // 렌더링
  return renderCartItems(cartItems, subtotal, discountResult, pointsResult);
}

/**
 * 장바구니 아이템 렌더링 함수
 *
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {number} subtotal - 소계
 * @param {Object} discountResult - 할인 결과
 * @param {Object} pointsResult - 포인트 결과
 * @returns {string} 장바구니 HTML 문자열
 */

function renderCartItems(cartItems, subtotal, discountResult, pointsResult) {
  if (cartItems.length === 0) {
    return `
      <div id="cart-items" class="space-y-4">
        <div class="text-center text-gray-500 py-8">
          장바구니가 비어있습니다.
        </div>
      </div>
    `;
  }

  const cartItemsHTML = Array.from(cartItems)
    .map((cartItem, index) => {
      const product = findProductById(cartItem.id);
      if (!product) {
        return '';
      }

      const quantity = parseInt(
        cartItem.querySelector('.quantity-number')?.textContent || '0',
      );
      const isFirst = index === 0;
      const isLast = index === cartItems.length - 1;

      return renderCartItem(product, quantity, isFirst, isLast);
    })
    .join('');

  return `
    <div id="cart-items" class="space-y-4">
      ${cartItemsHTML}
    </div>
  `;
}

/**
 * 장바구니 아이템 렌더링 함수
 *
 * @param {Object} product - 상품 정보
 * @param {number} quantity - 수량
 * @param {boolean} isFirst - 첫 번째 아이템 여부
 * @param {boolean} isLast - 마지막 아이템 여부
 * @returns {string} 장바구니 아이템 HTML 문자열
 */
function renderCartItem(product, quantity, isFirst, isLast) {
  const itemTotal = product.val * quantity;
  const topMargin = isFirst ? '' : 'mt-4';
  const bottomBorder = isLast ? '' : 'border-b border-gray-200 pb-4';

  return `
    <div class="flex items-center justify-between ${topMargin} ${bottomBorder}">
      <div class="flex-1">
        <h3 class="text-sm font-medium text-gray-900">${product.name}</h3>
        <p class="text-sm text-gray-500">₩${product.val.toLocaleString()}</p>
      </div>
      <div class="flex items-center space-x-2">
        <button class="quantity-btn minus" data-product-id="${product.id}">-</button>
        <span class="quantity-number w-8 text-center">${quantity}</span>
        <button class="quantity-btn plus" data-product-id="${product.id}">+</button>
        <span class="text-sm font-medium">₩${itemTotal.toLocaleString()}</span>
        <button class="remove-btn text-red-500 hover:text-red-700" data-product-id="${product.id}">
          Remove
        </button>
      </div>
    </div>
  `;
}

/**
 * 상품 ID로 상품 찾기 (임시 함수)
 *
 * @param {string} productId - 상품 ID
 * @returns {Object|null} 상품 정보
 */
function findProductById(productId) {
  // 실제로는 products 배열에서 찾아야 함
  const products = [
    { id: 'p1', name: '버그 없애는 키보드', val: 30000 },
    { id: 'p2', name: '생산성 폭발 마우스', val: 30000 },
    { id: 'p3', name: '거북목 탈출 모니터암', val: 30000 },
    { id: 'p4', name: '에러 방지 노트북 파우치', val: 30000 },
    { id: 'p5', name: '코딩할 때 듣는 Lo-Fi 스피커', val: 30000 },
  ];

  return products.find(product => product.id === productId) || null;
}
