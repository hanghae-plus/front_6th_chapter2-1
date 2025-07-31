import { MESSAGE } from '../constants/constants';
import { findProductById } from '../libs/findProductById';

export const changeQuantity = (state, productId, delta) => {
  const { cartState, productState } = state;
  const product = findProductById(productState, productId);

  if (!product) return;

  if (delta > 0 && product.quantity <= 0) {
    alert(MESSAGE.NO_STOCK);
    return;
  }

  let cartItem = cartState.find((item) => item.id === productId);

  // 새로 추가
  if (!cartItem && delta > 0) {
    cartItem = { id: productId, count: 1 };

    cartState.push(cartItem);
    product.quantity -= 1;
    return;
  }

  if (!cartItem) return;

  // 제거
  if (cartItem.count === 1 && delta < 0) {
    const idx = cartState.findIndex((item) => item.id === productId);
    if (idx !== -1) cartState.splice(idx, 1);
    return;
  }

  // 정상 증감
  cartItem.count += delta;
  product.quantity -= delta;
};

export const removeFromCart = (state, productId) => {
  const { cartState, productState } = state;
  const cartIdx = cartState.findIndex((item) => item.id === productId);

  if (cartIdx === -1) return;

  const cartItem = cartState[cartIdx];
  const product = findProductById(productState, productId);

  product.quantity += cartItem.count;
  cartState.splice(cartIdx, 1);
};
