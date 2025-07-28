import { PRODUCT_1, PRODUCT_2, PRODUCT_3, PRODUCT_4, PRODUCT_5 } from '../main.basic';

// 10개 이상 구매 시 할인율 적용
export const getQuantityDiscountRate = (productId, quantity) => {
  if (quantity < 10) return 0;

  const discountRate = {
    [PRODUCT_1]: 0.1,
    [PRODUCT_2]: 0.15,
    [PRODUCT_3]: 0.2,
    [PRODUCT_4]: 0.05,
    [PRODUCT_5]: 0.25,
  };

  return discountRate[productId] || 0;
};
