/**
 * AddToCartButton 컴포넌트
 * 장바구니에 상품을 추가하는 버튼을 렌더링합니다.
 * @returns {string} 장바구니 추가 버튼 HTML
 */
export function AddToCartButton() {
  return /* HTML */ `
    <button
      id="add-to-cart"
      class="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      Add to Cart
    </button>
  `;
}
