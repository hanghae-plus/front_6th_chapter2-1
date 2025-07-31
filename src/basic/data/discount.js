import { PRODUCT_DISCOUNT_RATE, DISCOUNT_POLICY } from './constants.js';
import { getProductById } from './product.js';
import { calculateTotalItemCount } from './cart.js';

// 할인 관련 상수
const DISCOUNT_CONSTANTS = {
  TUESDAY_DAY_OF_WEEK: 2,        // 화요일 (0=일요일, 1=월요일, 2=화요일, ...)
  TUESDAY_DISCOUNT: 0.1,         // 화요일 할인율 (10%)
  BULK_PURCHASE_THRESHOLD: 30,   // 대량구매 기준 (30개 이상)
  BULK_PURCHASE_DISCOUNT: 0.25,  // 대량구매 할인율 (25%)
  INDIVIDUAL_DISCOUNT_THRESHOLD: 10, // 개별 할인 기준 (10개 이상)
  PRODUCT_DISCOUNTS: {
    'p1': 0.1,  // 10%
    'p2': 0.15, // 15%
    'p3': 0.2,  // 20%
    'p4': 0.05, // 5%
    'p5': 0.25  // 25%
  }
};

// 글로벌 상태 변수
let lastSelectedProductId = null; // 마지막 선택된 상품 ID

// 상품별 할인율 조회
export const getProductDiscountRate = (productId, quantity) => {
  if (quantity < DISCOUNT_POLICY.INDIVIDUAL_DISCOUNT_THRESHOLD) return 0;
  return PRODUCT_DISCOUNT_RATE[productId] || 0;
};

// 화요일 여부 확인
export const isTuesday = () => {
  const today = new Date();
  return today.getDay() === DISCOUNT_CONSTANTS.TUESDAY_DAY_OF_WEEK;
};

// 마지막 선택된 상품 ID 조회
export const getLastSelectedProductId = () => lastSelectedProductId;

// 마지막 선택된 상품 ID 설정
export const setLastSelectedProductId = (productId) => {
  lastSelectedProductId = productId;
};

// 자동 이벤트 초기화
export const initializeDiscount = () => {
  lastSelectedProductId = null;
  console.log('Discount initialized');
};

// 총 가격 계산 (할인 포함)
export const calculateTotalPrice = () => {
  const cartItems = document.getElementById('cart-items');
  if (!cartItems || cartItems.children.length === 0) return 0;

  let totalItemCount = 0;
  let subtotal = 0;
  let totalAmount = 0;

  // DOM 요소를 직접 순회하여 계산
  for (let i = 0; i < cartItems.children.length; i++) {
    const cartItem = cartItems.children[i];
    const productId = cartItem.id;
    const product = getProductById(productId);
    const quantityElement = cartItem.querySelector('.quantity-number');
    const quantity = parseInt(quantityElement.textContent) || 0;
    
    if (product && quantity > 0) {
      // originalPrice 기준으로 계산
      const itemTotal = product.originalPrice * quantity;
      subtotal += itemTotal;
      totalItemCount += quantity;
      
      let discount = 0;
      
      // 10개 이상 구매 시 개별 할인 적용
      if (quantity >= DISCOUNT_CONSTANTS.INDIVIDUAL_DISCOUNT_THRESHOLD) {
        discount = DISCOUNT_CONSTANTS.PRODUCT_DISCOUNTS[productId] || 0;
      }
      
      totalAmount += itemTotal * (1 - discount);
    }
  }

  // 대량구매 할인 (30개 이상 시 개별 할인 무시하고 전체 25% 할인)
  if (totalItemCount >= DISCOUNT_CONSTANTS.BULK_PURCHASE_THRESHOLD) {
    totalAmount = subtotal * (1 - DISCOUNT_CONSTANTS.BULK_PURCHASE_DISCOUNT);
  }

  // 화요일 할인 (10% 추가 할인)
  if (isTuesday() && totalAmount > 0) {
    totalAmount = totalAmount * (1 - DISCOUNT_CONSTANTS.TUESDAY_DISCOUNT);
  }

  return Math.round(totalAmount);
}; 