import { productIds } from "../../store/product";

export const calculateItemDiscount = (
  productId,
  quantity,
  discountThreshold = 10
) => {
  if (quantity < discountThreshold) return 0;
  switch (productId) {
    case productIds.p1:
      return 0.1;
    case productIds.p2:
      return 0.15;
    case productIds.p3:
      return 0.2;
    case productIds.p4:
      return 0.05;
    case productIds.p5:
      return 0.25;
    default:
      return 0;
  }
};
