import { ITEM_DISCOUNT } from "../../constants/discount.constant";
import { PRODUCT_IDS } from "../../constants/product.constant";

export const calculateItemDiscount = (
  productId,
  quantity,
  discountThreshold = ITEM_DISCOUNT.THRESHOLD
) => {
  if (quantity < discountThreshold) return ITEM_DISCOUNT.RATES.default;
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
