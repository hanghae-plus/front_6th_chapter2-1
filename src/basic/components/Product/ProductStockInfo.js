import { getProducts } from '../../services/productService';

export const ProductStockInfo = () => {
  const stockInfoDiv = document.createElement('div');
  stockInfoDiv.id = 'stock-status';
  stockInfoDiv.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

  const updateStockInfo = () => {
    let infoMsg = '';
    const products = getProducts(); // 최신 상품 목록 가져오기
    products.forEach((item) => {
      // 재고 부족 또는 품절 상품 정보 추가
      if (item.q < 5) {
        infoMsg += `${item.name}: ${item.q > 0 ? `재고 부족 (${item.q}개 남음)` : '품절'}\n`;
      }
    });
    stockInfoDiv.textContent = infoMsg;
  };

  updateStockInfo(); // 초기 재고 정보 업데이트
  return { element: stockInfoDiv, updateStockInfo }; // DOM 요소와 업데이트 함수 반환
};
