import { cartManager } from '../domain/cart';
import productManager from '../domain/product';
import { PRODUCT_FIVE, PRODUCT_FOUR, PRODUCT_ONE, PRODUCT_THREE, PRODUCT_TWO } from '../main.basic';

export const calculateCartSummary = () => {
  return cartManager.getItems().reduce(
    (result, { productId, quantity: cartQuantity }) => {
      const product = productManager.getProductById(productId);
      const price = product.discountValue * cartQuantity;

      let discountRate = 0;
      if (cartQuantity >= 10) {
        switch (productId) {
          case PRODUCT_ONE:
            discountRate = 0.1;
            break;
          case PRODUCT_TWO:
            discountRate = 0.15;
            break;
          case PRODUCT_THREE:
            discountRate = 0.2;
            break;
          case PRODUCT_FOUR:
            discountRate = 0.05;
            break;
          case PRODUCT_FIVE:
            discountRate = 0.25;
            break;
        }
      }

      if (discountRate > 0) {
        result.itemDiscounts.push({
          name: product.name,
          discount: discountRate * 100,
        });
      }

      result.subTotal += price;
      result.discountedTotal += price * (1 - discountRate);

      return result;
    },
    { subTotal: 0, discountedTotal: 0, itemDiscounts: [] }
  );
};
