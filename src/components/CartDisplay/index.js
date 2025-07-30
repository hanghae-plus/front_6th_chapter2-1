import { createCartItem } from './CartItem';
import {
  handleQuantityChange,
  handleRemoveItem,
} from '../../handlers/cartHandlers.js';

export function createCartDisplay() {
  const container = document.createElement('div');
  container.id = 'cart-items';

  // CartDisplay에 addItem 메서드 추가
  container.addItem = function (product) {
    const newItem = createCartItem(product);
    container.appendChild(newItem);
    return newItem;
  };

  // CartDisplay에 setupEventListeners 메서드 추가
  container.setupEventListeners = function () {
    container.addEventListener('click', function (event) {
      const tgt = event.target;
      if (
        tgt.classList.contains('quantity-change') ||
        tgt.classList.contains('remove-item')
      ) {
        const prodId = tgt.dataset.productId;

        if (tgt.classList.contains('quantity-change')) {
          const qtyChange = parseInt(tgt.dataset.change);
          handleQuantityChange(prodId, qtyChange);
        } else if (tgt.classList.contains('remove-item')) {
          handleRemoveItem(prodId);
        }
      }
    });
  };

  return container;
}
