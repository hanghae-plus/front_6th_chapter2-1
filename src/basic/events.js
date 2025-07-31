import { state } from './state.js';

export function setupEventListeners(app) {
  const {
    addBtn,
    cartDisp,
    productSelect,
    onUpdateSelectOptions,
    handleCalculateCartStuff,
  } = app;

  addBtn.addEventListener('click', function () {
    const selItem = productSelect.value;
    const hasItem = state.products.some((p) => p.id === selItem);

    if (!selItem || !hasItem) {
      return;
    }

    const itemToAdd = state.products.find((p) => p.id === selItem);

    if (itemToAdd && itemToAdd.q > 0) {
      const itemInCart = state.cart.find((item) => item.productId === itemToAdd.id);
      if (itemInCart) {
        if (itemToAdd.q > 0) {
          itemInCart.quantity++;
          itemToAdd.q--;
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        state.cart.push({ productId: itemToAdd.id, quantity: 1 });
        itemToAdd.q--;
      }
      handleCalculateCartStuff();
      state.lastSelected = selItem;
    }
  });

  cartDisp.addEventListener('click', function (event) {
    const tgt = event.target;
    if (
      tgt.classList.contains('quantity-change') ||
      tgt.classList.contains('remove-item')
    ) {
      const prodId = tgt.dataset.productId;
      const itemInCart = state.cart.find((item) => item.productId === prodId);
      if (!itemInCart) return;

      if (tgt.classList.contains('quantity-change')) {
        const qtyChange = parseInt(tgt.dataset.change);
        const newQty = itemInCart.quantity + qtyChange;

        if (newQty > 0 && prod.q >= qtyChange) {
          itemInCart.quantity = newQty;
          prod.q -= qtyChange;
        } else if (newQty <= 0) {
          prod.q += itemInCart.quantity;
          state.cart = state.cart.filter((item) => item.productId !== prodId);
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (tgt.classList.contains('remove-item')) {
        prod.q += itemInCart.quantity;
        state.cart = state.cart.filter((item) => item.productId !== prodId);
      }

      handleCalculateCartStuff();
      onUpdateSelectOptions();
    }
  });
}
