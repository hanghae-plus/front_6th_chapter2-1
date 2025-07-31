import { PRODUCT_IDS } from '../../shared/constants/business-rules.js';
import {
  DISCOUNT,
  POINTS,
  STOCK,
  CSS_STYLES,
} from '../../shared/constants/event.js';
import { updateStockDisplay } from './updateStockDisplay.js';

/**
 * 장바구니 표시 영역 업데이트
 * 장바구니 아이템, 총액, 포인트 등을 계산하고 표시
 */
export function updateCartDisplay({ cartDisp, prodList }) {
  const cartItems = Array.from(cartDisp.children);

  // 1. 장바구니 아이템별 가격/할인 계산
  const itemResults = processCartItems(cartItems, prodList);

  // 2. 합계/할인/수량 계산
  const calculationResults = calculateCartTotals(itemResults);

  // 3. 할인 적용
  const discountResults = applyDiscounts(calculationResults);

  // 4. UI 업데이트
  updateAllUI({
    cartItems,
    prodList,
    ...discountResults,
  });

  // 5. 재고 정보 업데이트
  updateStockInfo(prodList);

  return {
    totalAmount: discountResults.totalAmount,
    itemCount: calculationResults.itemCount,
  };
}

/**
 * 장바구니 아이템 처리
 */
const processCartItems = (cartItems, prodList) => {
  return cartItems
    .map(cartItem => processCartItem(cartItem, prodList))
    .filter(Boolean);
};

/**
 * 개별 장바구니 아이템 처리
 */
const processCartItem = (cartItem, prodList) => {
  const currentProduct = prodList.find(p => p.id === cartItem.id);
  if (!currentProduct) {
    return null;
  }

  const quantity = getItemQuantity(cartItem);
  const itemTotal = calculateItemTotal(currentProduct, quantity);
  const discountInfo = calculateItemDiscount(currentProduct, quantity);

  updateCartItemUI(cartItem, currentProduct, quantity, itemTotal);

  return {
    quantity,
    itemTotal,
    discount: discountInfo.discount,
    discountLabel: discountInfo.discountLabel,
    currentProduct,
  };
};

/**
 * 아이템 수량 추출
 */
const getItemQuantity = cartItem => {
  const quantityElement = cartItem.querySelector('.quantity-number');
  return parseInt(quantityElement.textContent, 10);
};

/**
 * 아이템 총액 계산
 */
const calculateItemTotal = (product, quantity) => {
  return product.val * quantity;
};

/**
 * 아이템 할인 계산
 */
const calculateItemDiscount = (product, quantity) => {
  if (quantity < DISCOUNT.individualThreshold) {
    return { discount: 0, discountLabel: null };
  }

  const discountRate = getProductDiscountRate(product.id);
  if (discountRate === 0) {
    return { discount: 0, discountLabel: null };
  }

  return {
    discount: discountRate,
    discountLabel: {
      name: product.name,
      discount: discountRate * 100,
    },
  };
};

/**
 * 상품별 할인율 조회
 */
const getProductDiscountRate = productId => {
  const discountRates = {
    [PRODUCT_IDS.keyboard]: 0.1,
    [PRODUCT_IDS.mouse]: 0.15,
    [PRODUCT_IDS.monitorArm]: 0.2,
    [PRODUCT_IDS.laptopCase]: 0.05,
    [PRODUCT_IDS.speaker]: 0.25,
  };
  return discountRates[productId] || 0;
};

/**
 * 장바구니 아이템 UI 업데이트
 */
const updateCartItemUI = (cartItem, product, quantity, itemTotal) => {
  updateCartItemPriceUI(cartItem, product, quantity, itemTotal);
  updateCartItemFontWeight(cartItem, quantity);
};

/**
 * 장바구니 총액 계산
 */
const calculateCartTotals = itemResults => {
  const subtotal = itemResults.reduce((sum, r) => sum + r.itemTotal, 0);
  const itemCount = itemResults.reduce((sum, r) => sum + r.quantity, 0);
  const totalAmount = itemResults.reduce(
    (sum, r) => sum + r.itemTotal * (1 - r.discount),
    0
  );
  const itemDiscounts = itemResults
    .filter(r => r.discountLabel)
    .map(r => r.discountLabel);

  return {
    subtotal,
    itemCount,
    totalAmount,
    itemDiscounts,
  };
};

/**
 * 할인 적용
 */
const applyDiscounts = ({
  subtotal,
  itemCount,
  totalAmount,
  itemDiscounts,
}) => {
  let finalTotal = totalAmount;
  const originalTotal = subtotal;

  // 대량 할인 적용
  if (itemCount >= DISCOUNT.bulkThreshold) {
    finalTotal = subtotal * (1 - DISCOUNT.bulkDiscountRate);
  }
  // 개별 할인만 적용된 경우는 totalAmount가 이미 계산되어 있음

  // 화요일 할인 적용
  const tuesdayDiscount = applyTuesdayDiscount(finalTotal);
  finalTotal = tuesdayDiscount.totalAmount;

  // 최종 할인율 계산 (원래 가격 대비)
  const finalDiscountRate =
    originalTotal === 0 ? 0 : (originalTotal - finalTotal) / originalTotal;

  return {
    totalAmount: finalTotal,
    discountRate: finalDiscountRate,
    originalTotal,
    itemDiscounts,
  };
};

/**
 * 화요일 할인 적용
 */
const applyTuesdayDiscount = totalAmount => {
  const isTuesday = new Date().getDay() === DISCOUNT.tuesdayDay;
  const tuesdaySpecial = document.getElementById('tuesday-special');

  if (!isTuesday) {
    tuesdaySpecial?.classList.add(CSS_STYLES.hiddenClass);
    return { totalAmount, discountRate: 0 };
  }

  if (totalAmount <= 0) {
    tuesdaySpecial?.classList.add(CSS_STYLES.hiddenClass);
    return { totalAmount, discountRate: 0 };
  }

  const discountedAmount = totalAmount * (1 - DISCOUNT.tuesdayDiscountRate);

  tuesdaySpecial?.classList.remove(CSS_STYLES.hiddenClass);

  return {
    totalAmount: discountedAmount,
    discountRate: 0, // 화요일 할인율은 별도로 계산
  };
};

/**
 * 모든 UI 업데이트
 */
const updateAllUI = ({
  cartItems,
  prodList,
  totalAmount,
  discountRate,
  originalTotal,
  itemDiscounts,
}) => {
  const itemCount = calculateTotalItemCount(cartItems);
  const subtotal = originalTotal;

  updateItemCountUI(itemCount);
  updateSummaryDetailsUI({
    cartItems,
    prodList,
    subtotal,
    itemCount,
    itemDiscounts,
    isTuesday: new Date().getDay() === DISCOUNT.tuesdayDay,
    totalAmount,
  });
  updateCartTotalUI(totalAmount);
  updateDiscountInfoUI(discountRate, totalAmount, originalTotal);
  updateLoyaltyPointsUI({ cartItems, prodList, totalAmount, itemCount });
};

/**
 * 총 아이템 수 계산
 */
const calculateTotalItemCount = cartItems => {
  return cartItems.reduce((total, cartItem) => {
    const quantityElement = cartItem.querySelector('.quantity-number');
    const quantity = parseInt(quantityElement.textContent, 10);
    return total + quantity;
  }, 0);
};

/**
 * 재고 정보 업데이트
 */
const updateStockInfo = prodList => {
  const stockInfo = generateStockInfo(prodList);
  updateStockDisplay({ prodList, stockInfo });
};

// --- UI Side Effect 함수들 (중첩문 추출) ---
const updateCartItemPriceUI = (
  cartItem,
  currentProduct,
  quantity,
  itemTotal
) => {
  const priceElement = cartItem.querySelector('.text-lg');
  if (!priceElement) {
    return;
  }

  if (currentProduct.onSale || currentProduct.suggestSale) {
    const originalPrice = currentProduct.originalVal * quantity;
    const salePrice = currentProduct.val * quantity;
    const saleClass = getSaleClass(currentProduct);
    priceElement.innerHTML = `
      <span class="line-through text-gray-400">₩${originalPrice.toLocaleString()}</span>
      <span class="${saleClass}">₩${salePrice.toLocaleString()}</span>
    `;
    return;
  }

  priceElement.textContent = `₩${itemTotal.toLocaleString()}`;
};

/**
 * 할인 클래스 결정
 */
const getSaleClass = product => {
  if (product.onSale && product.suggestSale) {
    return CSS_STYLES.saleClasses.both;
  }

  if (product.onSale) {
    return CSS_STYLES.saleClasses.lightning;
  }

  return CSS_STYLES.saleClasses.suggestion;
};

const updateCartItemFontWeight = (cartItem, quantity) => {
  const priceElements = cartItem.querySelectorAll('.text-lg, .text-xs');
  priceElements.forEach(elem => {
    if (elem.classList.contains('text-lg')) {
      elem.style.fontWeight =
        quantity >= DISCOUNT.individualThreshold
          ? CSS_STYLES.fontWeight.bold
          : CSS_STYLES.fontWeight.normal;
    }
  });
};

const updateItemCountUI = itemCount => {
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    itemCountElement.textContent = `🛍️ ${itemCount} items in cart`;
  }
};

const updateSummaryDetailsUI = ({
  cartItems,
  prodList,
  subtotal,
  itemCount,
  itemDiscounts,
  isTuesday,
  totalAmount,
}) => {
  const summaryDetails = document.getElementById('summary-details');
  if (!summaryDetails) {
    return;
  }
  summaryDetails.innerHTML = '';
  if (subtotal <= 0) {
    return;
  }

  addCartItemDetails(summaryDetails, cartItems, prodList);
  addSubtotalSection(summaryDetails, subtotal);
  addBulkDiscountSection(summaryDetails, itemCount);
  addIndividualDiscountSection(summaryDetails, itemDiscounts);
  addTuesdayDiscountSection(summaryDetails, isTuesday, totalAmount);
  addShippingSection(summaryDetails);
};

/**
 * 장바구니 아이템 상세 추가
 */
const addCartItemDetails = (summaryDetails, cartItems, prodList) => {
  cartItems.forEach(cartItem => {
    const currentProduct = prodList.find(p => p.id === cartItem.id);
    if (!currentProduct) {
      return;
    }
    const quantityElement = cartItem.querySelector('.quantity-number');
    const quantity = parseInt(quantityElement.textContent, 10);
    const itemTotal = currentProduct.val * quantity;
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-xs tracking-wide text-gray-400">
        <span>${currentProduct.name} x ${quantity}</span>
        <span>₩${itemTotal.toLocaleString()}</span>
      </div>
    `;
  });
};

/**
 * 소계 섹션 추가
 */
const addSubtotalSection = (summaryDetails, subtotal) => {
  summaryDetails.innerHTML += `
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${subtotal.toLocaleString()}</span>
    </div>
  `;
};

/**
 * 대량 할인 섹션 추가
 */
const addBulkDiscountSection = (summaryDetails, itemCount) => {
  if (itemCount >= DISCOUNT.bulkThreshold) {
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
        <span class="text-xs">-25%</span>
      </div>
    `;
  }
};

/**
 * 개별 할인 섹션 추가
 */
const addIndividualDiscountSection = (summaryDetails, itemDiscounts) => {
  if (itemDiscounts.length <= 0) {
    return;
  }
  itemDiscounts.forEach(item => {
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">${item.name} (10개↑)</span>
        <span class="text-xs">-${item.discount}%</span>
      </div>
    `;
  });
};

/**
 * 화요일 할인 섹션 추가
 */
const addTuesdayDiscountSection = (summaryDetails, isTuesday, totalAmount) => {
  if (isTuesday && totalAmount > 0) {
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-purple-400">
        <span class="text-xs">🌟 화요일 추가 할인</span>
        <span class="text-xs">-10%</span>
      </div>
    `;
  }
};

/**
 * 배송 섹션 추가
 */
const addShippingSection = summaryDetails => {
  summaryDetails.innerHTML += `
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;
};

const updateCartTotalUI = totalAmount => {
  const cartTotal = document.getElementById('cart-total');
  if (!cartTotal) {
    return;
  }

  const totalElement = cartTotal.querySelector('.text-2xl');
  if (totalElement) {
    totalElement.textContent = `₩${Math.round(totalAmount).toLocaleString()}`;
  }
};

const updateDiscountInfoUI = (discountRate, totalAmount, originalTotal) => {
  const discountInfoDiv = document.getElementById('discount-info');
  if (!discountInfoDiv) {
    return;
  }

  discountInfoDiv.innerHTML = '';
  if (discountRate <= 0 || totalAmount <= 0) {
    return;
  }

  const savedAmount = originalTotal - totalAmount;
  discountInfoDiv.innerHTML = `
    <div class="bg-green-500/20 rounded-lg p-3">
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
        <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
      </div>
      <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
    </div>
  `;
};

const updateLoyaltyPointsUI = ({
  cartItems,
  prodList,
  totalAmount,
  itemCount,
}) => {
  const loyaltyPointsElement = document.getElementById('loyalty-points');
  if (!loyaltyPointsElement) {
    return;
  }
  if (cartItems.length === 0) {
    loyaltyPointsElement.style.display = CSS_STYLES.display.none;
    return;
  }

  const pointsInfo = calculateLoyaltyPoints({
    totalAmount,
    itemCount,
    cartItems,
    prodList,
  });
  displayLoyaltyPoints(loyaltyPointsElement, pointsInfo);
};

/**
 * 포인트 계산
 */
const calculateLoyaltyPoints = ({
  totalAmount,
  itemCount,
  cartItems,
  prodList,
}) => {
  const basePoints = Math.floor(totalAmount / POINTS.baseRate);
  let finalPoints = 0;
  const pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  // 화요일 보너스
  if (new Date().getDay() === DISCOUNT.tuesdayDay && basePoints > 0) {
    finalPoints = basePoints * POINTS.tuesdayMultiplier;
    pointsDetail.push('화요일 2배');
  }

  // 상품별 보너스 포인트
  const productBonus = calculateProductBonus(cartItems, prodList);
  finalPoints += productBonus.points;
  pointsDetail.push(...productBonus.details);

  // 수량별 보너스
  const quantityBonus = calculateQuantityBonus(itemCount);
  finalPoints += quantityBonus.points;
  pointsDetail.push(...quantityBonus.details);

  return { finalPoints, pointsDetail };
};

/**
 * 상품별 보너스 계산
 */
const calculateProductBonus = (cartItems, prodList) => {
  let points = 0;
  const details = [];
  const productFlags = getProductFlags(cartItems, prodList);

  if (productFlags.hasKeyboard && productFlags.hasMouse) {
    points += POINTS.keyboardMouseSet;
    details.push('키보드+마우스 세트 +50p');
  }

  if (
    productFlags.hasKeyboard &&
    productFlags.hasMouse &&
    productFlags.hasMonitorArm
  ) {
    points += POINTS.fullSet;
    details.push('풀세트 구매 +100p');
  }

  return { points, details };
};

/**
 * 상품 플래그 조회
 */
const getProductFlags = (cartItems, prodList) => {
  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;

  cartItems.forEach(cartItem => {
    const product = prodList.find(p => p.id === cartItem.id);
    if (!product) {
      return;
    }
    if (product.id === PRODUCT_IDS.keyboard) {
      hasKeyboard = true;
    }
    if (product.id === PRODUCT_IDS.mouse) {
      hasMouse = true;
    }
    if (product.id === PRODUCT_IDS.monitorArm) {
      hasMonitorArm = true;
    }
  });

  return { hasKeyboard, hasMouse, hasMonitorArm };
};

/**
 * 수량별 보너스 계산
 */
const calculateQuantityBonus = itemCount => {
  let points = 0;
  const details = [];

  if (itemCount >= DISCOUNT.bulkThreshold) {
    points += POINTS.bulk30;
    details.push('대량구매(30개+) +100p');
    return { points, details };
  }

  if (itemCount >= 20) {
    points += POINTS.bulk20;
    details.push('대량구매(20개+) +50p');
    return { points, details };
  }

  if (itemCount >= DISCOUNT.individualThreshold) {
    points += POINTS.bulk10;
    details.push('대량구매(10개+) +20p');
  }

  return { points, details };
};

/**
 * 포인트 표시
 */
const displayLoyaltyPoints = (
  loyaltyPointsElement,
  { finalPoints, pointsDetail }
) => {
  if (finalPoints > 0) {
    loyaltyPointsElement.innerHTML = `
      <div>적립 포인트: <span class="font-bold">${finalPoints}p</span></div>
      <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>
    `;
    loyaltyPointsElement.style.display = CSS_STYLES.display.block;
    return;
  }

  loyaltyPointsElement.textContent = '적립 포인트: 0p';
  loyaltyPointsElement.style.display = CSS_STYLES.display.block;
};

/**
 * 재고 정보 생성
 */
const generateStockInfo = prodList => {
  return prodList
    .filter(item => item.q < STOCK.lowStockThreshold)
    .map(item =>
      item.q > 0
        ? `${item.name}: 재고 부족 (${item.q}개 남음)\n`
        : `${item.name}: 품절\n`
    )
    .join('');
};
