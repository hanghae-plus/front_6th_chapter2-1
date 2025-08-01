/** 상품 선택 드롭다운 생성 */
export function ProductSelect() {
  const productSelect = document.createElement('select');
  productSelect.id = 'product-select';
  productSelect.className =
    'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';
  return productSelect;
}
