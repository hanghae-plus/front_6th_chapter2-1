import { state } from './state.js';
import { renderCart } from './view.js';

export function setupEventListeners(app) {
  const {
    addBtn,
    cartDisp,
    productSelect,
    onUpdateSelectOptions,
    handleCalculateCartStuff,
  } = app;

  addBtn.addEventListener('click', () => {
    const productId = productSelect.value;
    const product = state.products.find((p) => p.id === productId);

    if (!product) {
      alert('유효한 상품을 선택해주세요.');
      return;
    }

    if (product.q <= 0) {
      alert('재고가 부족합니다.');
      return;
    }

    const itemInCart = state.cart.find((item) => item.productId === productId);

    if (itemInCart) {
      itemInCart.quantity++;
    } else {
      state.cart.push({ productId: productId, quantity: 1 });
    }
    product.q--;

    renderCart(cartDisp, state.cart, state.products);
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  });

  cartDisp.addEventListener('click', (event) => {
    const target = event.target.closest('.quantity-change, .remove-item');
    if (!target) return;

    const productId = target.dataset.productId;
    const itemInCart = state.cart.find((item) => item.productId === productId);
    const product = state.products.find((p) => p.id === productId);

    if (!itemInCart || !product) return;

    if (target.classList.contains('quantity-change')) {
      const change = parseInt(target.dataset.change, 10);
      if (change > 0) {
        if (product.q > 0) {
          itemInCart.quantity++;
          product.q--;
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        itemInCart.quantity--;
        product.q++;
        if (itemInCart.quantity === 0) {
          state.cart = state.cart.filter((item) => item.productId !== productId);
        }
      }
    } else if (target.classList.contains('remove-item')) {
      product.q += itemInCart.quantity;
      state.cart = state.cart.filter((item) => item.productId !== productId);
    }

    renderCart(cartDisp, state.cart, state.products);
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  });
}
