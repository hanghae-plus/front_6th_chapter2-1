import { findProductById } from '../libs/findProductById';
import { createCartProduct } from '../components/CartProduct';

export const renderCartProductList = (state) => {
  const { cartState, productState } = state;

  const container = document.getElementById('cart-items');
  container.innerHTML = ''; // 기존 초기화

  cartState.forEach((item) => {
    // { id: , count: }
    const product = findProductById(productState, item.id);
    const productItem = createCartProduct(product, item.count); // HTML 요소 반환
    container.appendChild(productItem);
  });
};
