import { ITEM_DISCOUNT } from "../../constants/discount.constant";
import { PRODUCT_IDS } from "../../constants/product.constant";

/**
 * 아이템 할인 계산
 * @param {string} productId - 상품 ID
 * @param {number} quantity - 수량
 * @param {number} discountThreshold - 할인 임계값
 * @returns {number} 할인율
 */
export const calculateItemDiscount = (
  productId,
  quantity,
  discountThreshold = ITEM_DISCOUNT.THRESHOLD
) => {
  // 수량이 할인 임계값보다 작으면 기본 할인율 반환
  if (quantity < discountThreshold) return ITEM_DISCOUNT.RATES.default;

  // 상품 ID별 할인율 반환
  switch (productId) {
    case PRODUCT_IDS.p1:
      return ITEM_DISCOUNT.RATES.p1;
    case PRODUCT_IDS.p2:
      return ITEM_DISCOUNT.RATES.p2;
    case PRODUCT_IDS.p3:
      return ITEM_DISCOUNT.RATES.p3;
    case PRODUCT_IDS.p4:
      return ITEM_DISCOUNT.RATES.p4;
    case PRODUCT_IDS.p5:
      return ITEM_DISCOUNT.RATES.p5;
    default:
      return ITEM_DISCOUNT.RATES.default;
  }
};
