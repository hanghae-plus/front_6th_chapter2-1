/**
 * ProductSelector 컴포넌트
 * 상품 선택 드롭다운을 렌더링합니다.
 * @returns {string} 상품 선택 드롭다운 HTML
 */
export function ProductSelector() {
  return /* HTML */ `
    <select
      id="product-select"
      class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
    ></select>
  `;
}
