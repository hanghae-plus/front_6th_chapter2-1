/**
 * 상품 선택기 컴포넌트
 * 사용자가 상품을 선택할 수 있는 드롭다운을 생성합니다.
 */
export function createProductSelector() {
  const productSelector = document.createElement('select');
  productSelector.id = 'product-select';
  productSelector.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';
  return productSelector;
}
