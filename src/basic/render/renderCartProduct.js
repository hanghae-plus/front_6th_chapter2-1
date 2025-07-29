import { findProductById } from '../utils/findProductById';

export const renderCartProduct = ({ cartItems, productList }) => {
  for (let i = 0; i < cartItems.length; i++) {
    // 아이디로 상품 찾기
    const item = cartItems[i];
    const product = findProductById(productList, item.id);

    if (product) {
      // 업데이트할 가격, 이름
      const priceDiv = item.querySelector('.text-lg');
      const nameDiv = item.querySelector('h3');

      if (product.onSale && product.suggestSale) {
        // 세일 추천 상품
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalPrice.toLocaleString() +
          '</span> <span class="text-purple-600">₩' +
          product.changedPrice.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡💝' + product.name;
      } else if (product.onSale) {
        // 세일 상품
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalPrice.toLocaleString() +
          '</span> <span class="text-red-500">₩' +
          product.changedPrice.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡' + product.name;
      } else if (product.suggestSale) {
        // 추천 상품
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalPrice.toLocaleString() +
          '</span> <span class="text-blue-500">₩' +
          product.changedPrice.toLocaleString() +
          '</span>';
        nameDiv.textContent = '💝' + product.name;
      } else {
        // 일반 상품
        priceDiv.textContent = '₩' + product.changedPrice.toLocaleString();
        nameDiv.textContent = product.name;
      }
    }
  }
};
