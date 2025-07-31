/**
 * 상품 선택 영역 생성 (드롭다운 + 추가 버튼 + 재고 정보)
 */
export function ProductSelector() {
  // 🛒 상품 선택 드롭다운
  const productSelect = document.createElement('select');
  productSelect.id = 'product-select';
  productSelect.className =
    'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  // ➕ 추가 버튼
  const addButton = document.createElement('button');
  addButton.id = 'add-to-cart';
  addButton.innerHTML = 'Add to Cart';
  addButton.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

  // 📊 재고 정보
  const stockInfo = document.createElement('div');
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

  return {
    productSelect,
    addButton,
    stockInfo,
  };
}
