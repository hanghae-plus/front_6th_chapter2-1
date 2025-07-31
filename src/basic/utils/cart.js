import {
  PRODUCT_ONE,
  PRODUCT_TWO,
  PRODUCT_THREE,
  PRODUCT_FOUR,
  PRODUCT_FIVE,
  TEN_PERCENT,
  FIFTEEN_PERCENT,
  TWENTY_PERCENT,
  FIVE_PERCENT,
  TWENTY_FIVE_PERCENT,
  DISCOUNT_STANDARD_COUNT,
  VOLUME_ORDER_COUNT,
} from '../constants/enum';

// 가격·수량 계산 및 할인 정보 추출
function getCartSummary(cartItemList, productStore) {
  let itemCount = 0,
    subTotal = 0,
    totalAmount = 0;
  const itemDiscounts = [];

  cartItemList.forEach((cartItem) => {
    const product = productStore.getProductById(cartItem.id);
    const quantity = parseInt(cartItem.querySelector('.quantity-number').textContent);
    const itemTotal = product.value * quantity;
    let discount = 0;

    itemCount += quantity;
    subTotal += itemTotal;

    if (quantity >= DISCOUNT_STANDARD_COUNT) {
      if (product.id === PRODUCT_ONE) discount = TEN_PERCENT;
      else if (product.id === PRODUCT_TWO) discount = FIFTEEN_PERCENT;
      else if (product.id === PRODUCT_THREE) discount = TWENTY_PERCENT;
      else if (product.id === PRODUCT_FOUR) discount = FIVE_PERCENT;
      else if (product.id === PRODUCT_FIVE) discount = TWENTY_FIVE_PERCENT;
      if (discount > 0) itemDiscounts.push({ name: product.name, discount: discount * 100 });
    }

    totalAmount += itemTotal * (1 - discount);
  });

  return { itemCount, subTotal, totalAmount, itemDiscounts };
}

// 대량 할인 적용
function applyVolumeDiscount({ subTotal, totalAmount, itemCount }) {
  let discountRate = 0;
  let finalAmount = totalAmount;

  if (itemCount >= VOLUME_ORDER_COUNT) {
    finalAmount = (subTotal * 75) / 100;
    discountRate = TWENTY_FIVE_PERCENT;
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  return { finalAmount, discountRate };
}

// 화요일 할인 적용
function applyTuesdayDiscount({ finalAmount, originalTotal, isTuesday }) {
  let discountRate = 0;

  if (isTuesday && finalAmount > 0) {
    finalAmount = (finalAmount * 90) / 100;
    discountRate = 1 - finalAmount / originalTotal;
  }

  return { finalAmount, discountRate };
}

// 대량/화요일 할인 적용 및 화요일 배너 표시
function applyAdditionalDiscounts({ subTotal, totalAmount, itemCount, isTuesday }) {
  const originalTotal = subTotal;

  const volumeResult = applyVolumeDiscount({ subTotal, totalAmount, itemCount });
  const tuesdayResult = applyTuesdayDiscount({
    finalAmount: volumeResult.finalAmount,
    originalTotal,
    isTuesday,
  });

  return {
    finalAmount: tuesdayResult.finalAmount,
    discountRate: tuesdayResult.discountRate || volumeResult.discountRate,
    originalTotal,
  };
}

export { getCartSummary, applyVolumeDiscount, applyTuesdayDiscount, applyAdditionalDiscounts };
