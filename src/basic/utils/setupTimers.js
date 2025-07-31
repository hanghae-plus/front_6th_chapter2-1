import { applyLightningSale, applySuggestionSale, getProducts } from '../services/productService';

export function setupTimers(updateUI) {
  let lastSelectedProductIdForSuggestion = null;

  // 번개 세일 타이머
  setTimeout(() => {
    setInterval(() => {
      const products = getProducts();
      const availableProducts = products.filter((p) => p.q > 0 && !p.onSale);
      if (availableProducts.length > 0) {
        const luckyIdx = Math.floor(Math.random() * availableProducts.length);
        const luckyItem = availableProducts[luckyIdx];
        const updatedProduct = applyLightningSale(luckyItem.id);
        if (updatedProduct) {
          alert('⚡번개세일! ' + updatedProduct.name + '이(가) 20% 할인 중입니다!');
          updateUI();
        }
      }
    }, 30000);
  }, Math.random() * 10000); // 0~10초 랜덤 지연

  // 추천 할인 타이머
  setTimeout(() => {
    setInterval(() => {
      if (lastSelectedProductIdForSuggestion) {
        const products = getProducts();
        const availableProducts = products.filter(
          (p) => p.id !== lastSelectedProductIdForSuggestion && p.q > 0 && !p.suggestSale
        );
        if (availableProducts.length > 0) {
          const suggestIdx = Math.floor(Math.random() * availableProducts.length);
          const suggestItem = availableProducts[suggestIdx];
          const updatedProduct = applySuggestionSale(suggestItem.id);
          if (updatedProduct) {
            alert('💝 ' + updatedProduct.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
            updateUI();
          }
        }
      }
    }, 60000);
  }, Math.random() * 20000); // 0~20초 랜덤 지연

  // 외부에서 추천 대상 ID를 업데이트하도록 함수 반환
  return function updateLastSelectedProductId() {
    lastSelectedProductIdForSuggestion = document.getElementById('product-select').value;
  };
}
