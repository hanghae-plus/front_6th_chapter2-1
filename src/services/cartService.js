import { calculateIndividualDiscount, calculateBulkDiscount, calculateTuesdayDiscount } from './discountService.js';
import { calculateTotalPoints } from './pointsService.js';

// 장바구니 아이템 계산
export function calculateCartItems(cartItems, productList) {
  let subtotal = 0;
  let totalAmount = 0;
  let itemCount = 0;
  const itemDiscounts = [];

  for (let i = 0; i < cartItems.length; i++) {
    const currentProduct = productList.find((p) => p.id === cartItems[i].id);
    if (!currentProduct) continue;

    const quantityElement = cartItems[i].querySelector('.quantity-number');
    const quantity = parseInt(quantityElement.textContent);
    const itemTotal = currentProduct.price * quantity;

    itemCount += quantity;
    subtotal += itemTotal;

    // 개별 상품 할인 계산
    const individualDiscount = calculateIndividualDiscount(currentProduct.id, quantity);
    if (individualDiscount > 0) {
      const discountAmount = itemTotal * individualDiscount;
      itemDiscounts.push({
        name: currentProduct.name,
        discountRate: individualDiscount,
        discountAmount: discountAmount,
      });
      totalAmount += itemTotal * (1 - individualDiscount);
    } else {
      totalAmount += itemTotal;
    }
  }

  return { subtotal, totalAmount, itemCount, itemDiscounts };
}

// 최종 금액 계산 (대량구매, 화요일 할인 포함)
export function calculateFinalAmount(subtotal, totalAmount, itemCount) {
  let finalAmount = totalAmount;

  // 대량구매 할인 적용
  const bulkDiscount = calculateBulkDiscount(itemCount);
  if (bulkDiscount > 0) {
    finalAmount = subtotal * (1 - bulkDiscount);
  }

  // 화요일 할인 적용
  const tuesdayDiscount = calculateTuesdayDiscount();
  if (tuesdayDiscount > 0) {
    finalAmount = finalAmount * (1 - tuesdayDiscount);
  }

  return finalAmount;
}

// 장바구니 요약 정보 생성
export function generateCartSummary(cartItems, productList, subtotal, itemDiscounts, itemCount, finalAmount) {
  const summaryItems = [];

  // 개별 상품 정보
  for (let i = 0; i < cartItems.length; i++) {
    const currentProduct = productList.find((p) => p.id === cartItems[i].id);
    if (!currentProduct) continue;

    const quantityElement = cartItems[i].querySelector('.quantity-number');
    const quantity = parseInt(quantityElement.textContent);
    const itemTotal = currentProduct.price * quantity;

    summaryItems.push({
      name: currentProduct.name,
      quantity: quantity,
      total: itemTotal,
    });
  }

  // 할인 정보
  const discountInfo = [];

  // 대량구매 할인
  const bulkDiscount = calculateBulkDiscount(itemCount);
  if (bulkDiscount > 0) {
    discountInfo.push({
      type: 'bulk',
      name: '🎉 대량구매 할인 (30개 이상)',
      rate: '-25%',
    });
  }

  // 개별 상품 할인
  itemDiscounts.forEach((item) => {
    discountInfo.push({
      type: 'individual',
      name: `${item.name} (10개↑)`,
      rate: `-${(item.discountRate * 100).toFixed(0)}%`,
    });
  });

  // 화요일 할인
  const tuesdayDiscount = calculateTuesdayDiscount();
  if (tuesdayDiscount > 0) {
    discountInfo.push({
      type: 'tuesday',
      name: '🌟 화요일 추가 할인',
      rate: '-10%',
    });
  }

  return { summaryItems, discountInfo };
}

// 포인트 정보 계산
export function calculatePointsInfo(finalAmount, cartItems, productList) {
  const pointsData = calculateTotalPoints(finalAmount, cartItems, productList);

  return {
    totalPoints: pointsData.totalPoints,
    details: pointsData.details,
  };
}

// 재고 상태 확인
export function checkStockStatus(productList) {
  const lowStockItems = [];
  const outOfStockItems = [];

  productList.forEach((product) => {
    if (product.quantity === 0) {
      outOfStockItems.push(product.name);
    } else if (product.quantity < 5) {
      lowStockItems.push({
        name: product.name,
        quantity: product.quantity,
      });
    }
  });

  return { lowStockItems, outOfStockItems };
}
