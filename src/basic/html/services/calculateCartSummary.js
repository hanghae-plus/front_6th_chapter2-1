import { isTodayTuesday } from '../../utils/isTodayTuesday';
import { findProductById } from '../../utils/findProductById';
import { getQuantityDiscountRate } from '../../utils/getQuantityDiscountRate';
import { getCartQuantityDiscountRate } from '../../utils/getCartQuantityDiscountRate';

// 가격 및 할인율 계산
export const calculateCartSummary = (state) => {
  const { cartState, productState } = state;

  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;
  let totalProductCount = 0;
  const discountedProductList = [];

  for (let i = 0; i < cartState.length; i++) {
    const cartItem = cartState[i];
    const product = findProductById(productState, cartItem.id);

    const orderCount = cartItem.count
    const itemPrice = product.changedPrice * orderCount;

    // 기본 총 가격 계산
    totalBeforeDiscount += itemPrice;
    totalProductCount += orderCount;

    // 개별 할인 - 아이템 당 10개 이상 구매
    const itemDiscountRate = getQuantityDiscountRate(product.id, orderCount);
    if (itemDiscountRate > 0) {
      discountedProductList.push({ name: product.name, discount: itemDiscountRate * 100 });
    }

    const discountedItemPrice = itemPrice * (1 - itemDiscountRate);
    totalAfterDiscount += discountedItemPrice;
  }

  // 대량 구매 할인 - 총 30개 이상 구매 (기존 할인에서 덮어씀)
  const cartDiscountRate = getCartQuantityDiscountRate(totalProductCount);
  if (cartDiscountRate > 0) {
    totalAfterDiscount = totalBeforeDiscount * (1 - cartDiscountRate);
    discountedProductList.length = 0;
  }

  // 화요일 할인 - 10% 추가 할인
  if (isTodayTuesday()) {
    totalAfterDiscount *= 0.9;
  }

  // 최종 할인율 계산
  const totalDiscountedRate = totalBeforeDiscount > 0 ? 1 - totalAfterDiscount / totalBeforeDiscount : 0;

  return {
    totalProductCount, // 총 상품 수
    totalBeforeDiscount, // 할인 전 총 가격
    totalAfterDiscount, // 할인 후 총 가격
    totalDiscountedRate, // 총 할인율
    discountedProductList, // 개별 할인된 상품 목록
  };
};
