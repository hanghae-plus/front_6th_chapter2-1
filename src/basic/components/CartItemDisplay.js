// 카트 아이템의 가격/이름 표시를 상품 상태에 따라 반환하는 컴포넌트 함수 (UI string)
import { formatPrice } from '../utils/format.js';

/**
 * 카트 아이템의 가격/이름 표시를 상품 상태에 따라 반환 (UI string)
 * @param {Object} props
 * @param {Object} props.product - 상품 정보 객체
 * @returns {{ name: string, price: string }}
 */
export function CartItemDisplay({ product }) {
  let priceHtml = '';
  let nameText = '';
  if (product.onSale && product.suggestSale) {
    priceHtml = `<span class="line-through text-gray-400">${formatPrice(product.originalVal)}</span> <span class="text-purple-600">${formatPrice(product.val)}</span>`;
    nameText = `⚡💝${product.name}`;
  } else if (product.onSale) {
    priceHtml = `<span class="line-through text-gray-400">${formatPrice(product.originalVal)}</span> <span class="text-red-500">${formatPrice(product.val)}</span>`;
    nameText = `⚡${product.name}`;
  } else if (product.suggestSale) {
    priceHtml = `<span class="line-through text-gray-400">${formatPrice(product.originalVal)}</span> <span class="text-blue-500">${formatPrice(product.val)}</span>`;
    nameText = `💝${product.name}`;
  } else {
    priceHtml = formatPrice(product.val);
    nameText = product.name;
  }
  return { name: nameText, price: priceHtml };
}
