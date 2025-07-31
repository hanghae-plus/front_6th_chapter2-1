import { stateManager } from './state.js';

export function setupEventListeners(app) {
  const { addBtn, cartDisp, productSelect } = app;

  addBtn.addEventListener('click', () => {
    const selectedProductId = productSelect.value;
    stateManager.addItemToCart(selectedProductId);
  });

  cartDisp.addEventListener('click', (event) => {
    const target = event.target;
    const productId = target.dataset.productId;

    if (!productId) return;

    if (target.classList.contains('quantity-change')) {
      const change = parseInt(target.dataset.change);
      stateManager.updateQuantity(productId, change);
    } else if (target.classList.contains('remove-item')) {
      stateManager.removeItemFromCart(productId);
    }
  });
}
