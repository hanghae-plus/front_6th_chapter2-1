/**
 * 장바구니 아이템들의 총 가격을 계산하는 함수
 * @param {Array} cartItems - 장바구니 아이템 목록
 * @returns {number} 장바구니 아이템들의 총 가격
 */
export function calculateItemTotals(cartItems) {
  return cartItems.reduce((acc, item) => acc + item.val * item.quantity, 0);
}

/**
 * 장바구니 아이템들의 총 개수를 계산하는 함수
 * @param {Array} cartItems - 장바구니 아이템 목록
 * @returns {number} 장바구니 아이템들의 총 개수
 */
export function calculateTotalAmount(cartItems) {
  return cartItems.reduce((acc, item) => acc + item.quantity, 0);
}

export function calculateTotalDiscount(cartItems) {
  return cartItems.reduce((acc, item) => acc + item.discount, 0);
}

/**
 * 장바구니 아이템들의 기본 정보를 계산하는 함수
 * @param {Array} cartItems - 장바구니 아이템 목록
 * @param {Array} productList - 상품 목록
 * @returns {Object} 계산된 장바구니 정보
 */
export function calculateCartItemsInfo(cartItems, productList) {
  let totalAmount = 0;
  let itemCounts = 0;
  let subtotal = 0;
  const itemDiscounts = [];

  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const product = findProductById(cartItem.id, productList);

    if (!product) continue;

    const quantity = parseInt(cartItem.quantity.textContent);
    const itemTotal = product.val * quantity;
    const discount = calculateProductDiscount(product.id, quantity);

    itemCounts += quantity;
    subtotal += itemTotal;
    totalAmount += itemTotal * (1 - discount);

    if (discount > 0) {
      itemDiscounts.push({
        name: product.name,
        discount: discount * 100,
      });
    }
  }

  return {
    totalAmount,
    itemCounts,
    subtotal,
    itemDiscounts,
  };
}

/**
 * 장바구니 계산 결과를 생성하는 함수
 * @param {Array} cartItems - 장바구니 아이템 목록
 * @param {Array} productList - 상품 목록
 * @param {number} lowStockThreshold - 재고 부족 임계값
 * @returns {Object} 장바구니 계산 결과
 */
export function calculateCartResult(cartItems, productList, lowStockThreshold) {
  // 기본 장바구니 정보 계산
  const cartInfo = calculateCartItemsInfo(cartItems, productList);

  // 대량구매 할인 적용
  const bulkDiscountResult = applyBulkDiscount(
    cartInfo.subtotal,
    cartInfo.itemCounts,
    cartInfo.totalAmount
  );

  // 화요일 할인 적용
  const tuesdayDiscountResult = applyTuesdayDiscount(
    bulkDiscountResult.totalAmount,
    cartInfo.subtotal
  );

  // 포인트 계산
  const pointsResult = calculateTotalPoints(
    tuesdayDiscountResult.totalAmount,
    cartItems,
    productList,
    cartInfo.itemCounts
  );

  // 재고 메시지 생성
  const stockMessage = generateStockMessage(productList, lowStockThreshold);

  return {
    totalAmount: tuesdayDiscountResult.totalAmount,
    itemCounts: cartInfo.itemCounts,
    subtotal: cartInfo.subtotal,
    itemDiscounts: cartInfo.itemDiscounts,
    discountRate: tuesdayDiscountResult.discountRate,
    isTuesday: tuesdayDiscountResult.isTuesday,
    points: pointsResult.totalPoints,
    pointsDetails: pointsResult.details,
    stockMessage,
  };
}
