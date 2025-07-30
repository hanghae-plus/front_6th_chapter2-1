import { ITEM_DISCOUNT } from "../../constants/discount.constant";
import { productIds } from "../../constants/product.constant";

export const calculateItemDiscount = (
  productId,
  quantity,
  discountThreshold = ITEM_DISCOUNT.THRESHOLD
) => {
  if (quantity < discountThreshold) return ITEM_DISCOUNT.RATES.default;
  switch (productId) {
    case productIds.p1:
      return ITEM_DISCOUNT.RATES.p1;
    case productIds.p2:
      return ITEM_DISCOUNT.RATES.p2;
    case productIds.p3:
      return ITEM_DISCOUNT.RATES.p3;
    case productIds.p4:
      return ITEM_DISCOUNT.RATES.p4;
    case productIds.p5:
      return ITEM_DISCOUNT.RATES.p5;
    default:
      return ITEM_DISCOUNT.RATES.default;
  }
};
