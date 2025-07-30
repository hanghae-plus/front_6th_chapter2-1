import { findProductById } from "../../utils/findProductById";

export const changeQuantity = (state, productId, delta) => {
  const { cartState, productState } = state;
  const product = findProductById(productState, productId);

  const cartItem = cartState.find(item => item.id === productId);

  if (!product || !cartItem) return;

  if (delta < 0 && cartItem.count === 1) {
    cartState.splice(cartIdx, 1);
    return;
  }

  if (delta > 0 && product.quantity <= 0) {
    alert('재고가 부족합니다.');
    return;
  }

  cartItem.count += delta;
  product.quantity -= delta;
};

export const removeFromCart = (state, productId) => {
  const { cartState, productState } = state;
  const cartIdx = cartState.findIndex(item => item.id === productId);

  if (cartIdx === -1) return;

  const cartItem = cartState[cartIdx];
  const product = findProductById(productState, productId);

  product.quantity += cartItem.count;
  cartState.splice(cartIdx, 1);
};