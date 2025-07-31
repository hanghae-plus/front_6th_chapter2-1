import { updateCartItemPrice } from '../components/cart/CartItem.js';
import { findProductById } from '../utils/productUtils.js';

export function createCartPriceUpdater(productList) {
  const updatePrice = (item) => {
    const product = findProductById(productList, item.id);
    if (product) updateCartItemPrice(item, product);
  };

  const updatePriceList = (items) => {
    items.forEach(updatePrice);
  };

  return { updatePriceList };
}
