import { cartManager } from '../domain/cart';
import productManager, { LIGHTNING_DISCOUNT, OUT_OF_STOCK, SUGGEST_DISCOUNT } from '../domain/product';

export const applyLightningSale = () => {
  const randomIndex = Math.floor(Math.random() * productManager.getProductCount());
  const randomProduct = productManager.getProductAt(randomIndex);

  if (randomProduct.quantity > OUT_OF_STOCK && !randomProduct.onSale) {
    randomProduct.discountValue = Math.round(randomProduct.originalVal * (1 - LIGHTNING_DISCOUNT));
    randomProduct.onSale = true;

    return {
      message: `⚡번개세일! ${randomProduct.name}이(가) 20% 할인 중입니다!`,
      product: randomProduct,
    };
  }

  return null;
};

export const applySuggestSale = () => {
  if (cartManager.getLastAddedItem()) {
    const suggestProduct = productManager
      .getProducts()
      .find((product) => product.id !== cartManager.getLastAddedItem() && product.quantity > OUT_OF_STOCK);

    if (!suggestProduct) return null;

    suggestProduct.discountValue = Math.round(suggestProduct.discountValue * (1 - SUGGEST_DISCOUNT));
    suggestProduct.suggestSale = true;

    return {
      message: `💝  ${suggestProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
      product: suggestProduct,
    };
  }

  return null;
};
