import { 
  getProductById, 
  getProductDiscountRate, 
  calculateBonusPoints,
  getBonusPointsText,
  calculateBasePoints,
  isTuesday,
  calculateTotalPrice,
  calculateTotalItemCount
} from '../data/index.js';
import { DISCOUNT_POLICY, POINTS_POLICY, PRODUCT_DISCOUNT_RATE } from '../data/constants.js';
import { UI_CONSTANTS } from "./constants.js";

export const CartTotal = /*html*/ `
  <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
  <div class="flex-1 flex flex-col">
    <div id="summary-details" class="space-y-3"></div>
    <div class="mt-auto">
      <div id="discount-info" class="mb-4"></div>
      <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
        <div class="flex items-center gap-2">
          <span class="text-2xs">🎉</span>
          <span class="text-xs uppercase tracking-wide">Tuesday Special ${(DISCOUNT_POLICY.TUESDAY_DISCOUNT_RATE * 100).toFixed(0)}% Applied</span>
        </div>
      </div>
      <div id="cart-total" class="pt-5 border-t border-white/10">
        <div class="flex justify-between items-baseline">
          <span class="text-sm uppercase tracking-wider">Total</span>
          <div id="total-price" class="text-2xl tracking-tight">₩0</div>
        </div>
        <div id="loyalty-points" class="text-xs ${UI_CONSTANTS.COLORS.POINTS_TEXT} mt-2 text-right" style="display: none;">적립 포인트: 0p</div>
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

/**
 * 주문 요약 업데이트
 */
export const updateCartSummary = () => {
  const summaryDetailsElement = document.getElementById('summary-details');
  if (!summaryDetailsElement) return;

  const cartItems = document.getElementById('cart-items');
  if (!cartItems || cartItems.children.length === 0) {
    handleEmptyCart(summaryDetailsElement);
    return;
  }

  const itemData = getCartItemData();
  if (itemData.length === 0) {
    handleEmptyCart(summaryDetailsElement);
    return;
  }

  let summaryHTML = '';
  let subtotal = 0;

  // 장바구니 아이템 HTML 생성
  summaryHTML += generateCartItemsHTML(itemData);
  
  // subtotal 계산
  subtotal = itemData.reduce((sum, { product, quantity }) => {
    return sum + (product.originalPrice * quantity);
  }, 0);

  // Subtotal 및 할인 정보 추가
  if (subtotal > 0) {
    const totalItemCount = calculateTotalItemCount();
    const discountDetails = calculateIndividualDiscounts(itemData);
    
    summaryHTML += /*html*/ `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subtotal.toLocaleString()}</span>
      </div>
    `;
    
    // 할인 정보 추가
    summaryHTML += generateDiscountHTML(totalItemCount, discountDetails);
    
    // 화요일 할인 추가
    summaryHTML += generateTuesdayDiscountHTML();
    
    // 배송 정보 추가
    summaryHTML += generateShippingHTML();
  }

  summaryDetailsElement.innerHTML = summaryHTML;
};

/**
 * 총 가격 업데이트
 */
export const updateTotalPrice = () => {
  const totalPriceElement = document.getElementById('total-price');
  if (!totalPriceElement) return;

  const totalPrice = calculateTotalPrice();
  totalPriceElement.textContent = `₩${totalPrice.toLocaleString()}`;
};

/**
 * 할인 정보 업데이트
 */
export const updateDiscountInfo = () => {
  const discountInfoElement = document.getElementById('discount-info');
  if (!discountInfoElement) return;

  const cartItems = document.getElementById('cart-items');
  if (!cartItems || cartItems.children.length === 0) {
    discountInfoElement.innerHTML = '';
    return;
  }

  const { subtotal, totalAmount, discountDetails } = calculateDiscounts();

  // 할인 정보를 discount-info 요소에 표시
  if (discountDetails.length > 0) {
    const totalDiscountRate = ((subtotal - totalAmount) / subtotal * 100).toFixed(1);
    discountInfoElement.innerHTML = /*html*/ `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${totalDiscountRate}%</span>
        </div>
        <div class="text-2xs ${UI_CONSTANTS.COLORS.LIGHTER_GRAY_TEXT}">₩${Math.round(subtotal - totalAmount).toLocaleString()} ${UI_CONSTANTS.MESSAGES.DISCOUNT_APPLIED}</div>
      </div>
    `;
  } else {
    discountInfoElement.innerHTML = '';
  }
};

/**
 * 포인트 정보 업데이트
 */
export const updateLoyaltyPoints = () => {
  const loyaltyPointsElement = document.getElementById('loyalty-points');
  if (!loyaltyPointsElement) return;

  const cartItems = document.getElementById('cart-items');
  if (!cartItems || cartItems.children.length === 0) {
    loyaltyPointsElement.style.display = 'none';
    return;
  }

  const { totalPoints, pointsDetails } = calculatePoints();

  if (totalPoints > 0) {
    loyaltyPointsElement.innerHTML = /*html*/ `<div>적립 포인트: <span class="font-bold">${totalPoints}p</span></div>` +
      /*html*/ `<div class="text-2xs opacity-70 mt-1">${pointsDetails.join(', ')}</div>`;
    loyaltyPointsElement.style.display = 'block';
  } else {
    loyaltyPointsElement.textContent = '적립 포인트: 0p';
    loyaltyPointsElement.style.display = 'block';
  }
  
  // 장바구니가 비어있을 때 포인트 섹션 숨김
  const cartItemsForCheck = document.getElementById('cart-items');
  if (!cartItemsForCheck || cartItemsForCheck.children.length === 0) {
    loyaltyPointsElement.style.display = 'none';
  }
};

/**
 * 화요일 특별 할인 표시
 */
export const updateTuesdaySpecial = () => {
  const isTuesdayToday = isTuesday();
  const totalAmount = calculateTotalPrice();
  const tuesdaySpecialElement = document.getElementById('tuesday-special');
  
  if (!tuesdaySpecialElement) return;
  
  if (isTuesdayToday && totalAmount > 0) {
    tuesdaySpecialElement.classList.remove('hidden');
  } else {
    tuesdaySpecialElement.classList.add('hidden');
  }
};

// #region ================ 내부 함수 ================

/**
 * 장바구니 아이템에서 상품 정보와 수량을 추출
 */
const getCartItemData = () => {
  const cartItems = document.getElementById('cart-items');
  if (!cartItems) return [];
  
  const itemData = [];
  for (let i = 0; i < cartItems.children.length; i++) {
    const cartItem = cartItems.children[i];
    const productId = cartItem.id;
    const product = getProductById(productId);
    const quantityElement = cartItem.querySelector('.quantity-number');
    const quantity = parseInt(quantityElement.textContent) || 0;
    
    if (product && quantity > 0) {
      itemData.push({ product, quantity, productId });
    }
  }
  
  return itemData;
};

/**
 * 빈 장바구니 상태 처리
 */
const handleEmptyCart = (summaryDetailsElement) => {
  summaryDetailsElement.innerHTML = /*html*/ `<p class="text-sm ${UI_CONSTANTS.COLORS.LIGHT_GRAY_TEXT}">${UI_CONSTANTS.MESSAGES.EMPTY_CART}</p>`;
  
  const loyaltyPointsElement = document.getElementById('loyalty-points');
  if (loyaltyPointsElement) {
    loyaltyPointsElement.style.display = 'none';
  }
};

/**
 * 개별 상품 할인 정보 계산
 */
const calculateIndividualDiscounts = (itemData) => {
  const discountDetails = [];
  
  itemData.forEach(({ product, quantity, productId }) => {
    if (quantity >= DISCOUNT_POLICY.INDIVIDUAL_DISCOUNT_THRESHOLD) {
      const discountRate = PRODUCT_DISCOUNT_RATE[productId];
      if (discountRate) {
        const discountPercent = Math.round(discountRate * 100);
        discountDetails.push({ name: product.name, discount: discountPercent });
      }
    }
  });
  
  return discountDetails;
};

/**
 * 장바구니 아이템 HTML 생성
 */
const generateCartItemsHTML = (itemData) => {
  return itemData.map(({ product, quantity }) => {
    const itemTotal = product.originalPrice * quantity;
    return /*html*/ `
      <div class="flex justify-between text-xs tracking-wide ${UI_CONSTANTS.COLORS.LIGHT_GRAY_TEXT}">
        <span>${product.name} x ${quantity}</span>
        <span>₩${itemTotal.toLocaleString()}</span>
      </div>
    `;
  }).join('');
};

/**
 * 할인 정보 HTML 생성
 */
const generateDiscountHTML = (totalItemCount, discountDetails) => {
  let discountHTML = '';
  
  // 대량구매 할인
  if (totalItemCount >= DISCOUNT_POLICY.BULK_PURCHASE_THRESHOLD) {
    discountHTML += /*html*/ `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">🎉 대량구매 할인 (${DISCOUNT_POLICY.BULK_PURCHASE_THRESHOLD}개 이상)</span>
        <span class="text-xs">-${Math.round(DISCOUNT_POLICY.BULK_PURCHASE_RATE * 100)}%</span>
      </div>
    `;
  } else if (discountDetails.length > 0) {
    // 개별 상품 할인
    discountDetails.forEach(item => {
      discountHTML += /*html*/ `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">${item.name} (${DISCOUNT_POLICY.INDIVIDUAL_DISCOUNT_THRESHOLD}개↑)</span>
          <span class="text-xs">-${item.discount}%</span>
        </div>
      `;
    });
  }
  
  return discountHTML;
};

/**
 * 화요일 할인 HTML 생성
 */
const generateTuesdayDiscountHTML = () => {
  if (isTuesday() && calculateTotalPrice() > 0) {
    return /*html*/ `
      <div class="flex justify-between text-sm tracking-wide ${UI_CONSTANTS.COLORS.DISCOUNT_TEXT}">
        <span class="text-xs">🌟 화요일 추가 할인</span>
        <span class="text-xs">-${Math.round(DISCOUNT_POLICY.TUESDAY_DISCOUNT_RATE * 100)}%</span>
      </div>
    `;
  }
  return '';
};

/**
 * 배송 정보 HTML 생성
 */
const generateShippingHTML = () => {
  return /*html*/ `
    <div class="flex justify-between text-sm tracking-wide ${UI_CONSTANTS.COLORS.LIGHT_GRAY_TEXT}">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;
};

/**
 * 할인 계산 로직
 */
const calculateDiscounts = () => {
  const itemData = getCartItemData();
  if (itemData.length === 0) return { subtotal: 0, totalAmount: 0, discountDetails: [] };

  let subtotal = 0;
  let totalAmount = 0;
  let totalItemCount = 0;
  let discountDetails = [];

  // 각 아이템별 계산
  itemData.forEach(({ product, quantity, productId }) => {
    const itemTotal = product.originalPrice * quantity;
    subtotal += itemTotal;
    totalItemCount += quantity;
    
    let discount = 0;
    
    // 개별 상품 할인 적용
    if (quantity >= DISCOUNT_POLICY.INDIVIDUAL_DISCOUNT_THRESHOLD) {
      discount = PRODUCT_DISCOUNT_RATE[productId] || 0;
    }
    
    if (discount > 0) {
      discountDetails.push(`${product.name}: ${(discount * 100).toFixed(1)}% 할인`);
    }
    
    totalAmount += itemTotal * (1 - discount);
  });

  // 대량구매 할인 (개별 할인 무시하고 전체 할인)
  if (totalItemCount >= DISCOUNT_POLICY.BULK_PURCHASE_THRESHOLD) {
    totalAmount = subtotal * (1 - DISCOUNT_POLICY.BULK_PURCHASE_RATE);
    discountDetails = [`대량구매: ${(DISCOUNT_POLICY.BULK_PURCHASE_RATE * 100).toFixed(1)}% 할인`];
  }

  // 화요일 할인 (추가 할인)
  if (isTuesday() && totalAmount > 0) {
    totalAmount = totalAmount * (1 - DISCOUNT_POLICY.TUESDAY_DISCOUNT_RATE);
    discountDetails.push(`화요일 할인: ${(DISCOUNT_POLICY.TUESDAY_DISCOUNT_RATE * 100).toFixed(1)}% 추가`);
  }

  // 총 할인율 계산
  if (discountDetails.length > 0) {
    const totalDiscountRate = ((subtotal - totalAmount) / subtotal * 100).toFixed(1);
    discountDetails.push(`총 할인율: ${totalDiscountRate}%`);
  }

  return { subtotal, totalAmount, discountDetails };
};

/**
 * 포인트 계산 로직
 */
const calculatePoints = () => {
  const totalPrice = calculateTotalPrice();
  const basePoints = calculateBasePoints(totalPrice);
  const bonusPoints = calculateBonusPoints();
  const bonusText = getBonusPointsText();
  
  let totalPoints = basePoints + bonusPoints;
  let pointsDetails = [`기본: ${basePoints}p`];
  
  // 화요일에는 기본 포인트 배수 적용
  if (isTuesday()) {
    totalPoints = basePoints * POINTS_POLICY.TUESDAY_MULTIPLIER + bonusPoints;
    pointsDetails = [`기본: ${basePoints}p`, `화요일 ${POINTS_POLICY.TUESDAY_MULTIPLIER}배`];
  }
  
  if (bonusText !== '없음') {
    pointsDetails.push(bonusText);
  }

  return { totalPoints, pointsDetails };
};

// #endregion