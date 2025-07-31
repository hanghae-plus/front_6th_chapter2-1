import { SUGGEST_DELAY_RANGE, SUGGEST_SALE_DISCOUNT, SUGGEST_SALE_INTERVAL } from '../constants';
import type { Product } from '../types';

// 타이머 상태를 관리하는 객체
const timerState = {
  suggestSaleInterval: null as ReturnType<typeof setTimeout> | null,
  suggestSaleTimeout: null as ReturnType<typeof setTimeout> | null,
};

/**
 * 추천할 상품을 찾습니다.
 * @param {Product[]} products - 상품 목록
 * @param {string} selectedProductId - 선택된 상품 ID
 * @returns {Product|null} 추천할 상품 또는 null
 */
function findSuggestProduct(products: Product[], selectedProductId: string): Product | null {
  return (
    products.find(
      (product) => product.id !== selectedProductId && product.q > 0 && !product.suggestSale
    ) || null
  );
}

/**
 * 추천할인을 적용합니다.
 * @param {Product} product - 상품 정보
 */
function applySuggestSale(product: Product) {
  product.val = Math.round((product.val * (100 - SUGGEST_SALE_DISCOUNT)) / 100);
  product.suggestSale = true;
}

/**
 * 추천할인을 트리거합니다.
 * @param {Product[]} products - 상품 목록
 * @param {string|null} selectedProduct - 선택된 상품 ID
 * @param {Function} updateProducts - 상품 업데이트 함수
 */
function triggerSuggestSale(
  products: Product[],
  selectedProduct: string | null,
  updateProducts: (products: Product[]) => void
) {
  if (selectedProduct) {
    const suggest = findSuggestProduct(products, selectedProduct);

    if (suggest) {
      alert(
        `💝 ${suggest.name} 은(는) 어떠세요? 지금 구매하시면 ${SUGGEST_SALE_DISCOUNT}% 추가 할인!`
      );

      applySuggestSale(suggest);
      updateProducts([...products]);
    }
  }
}

/**
 * 추천할인 타이머를 시작합니다.
 * @param {Product[]} products - 상품 목록
 * @param {string|null} selectedProduct - 선택된 상품 ID
 * @param {Function} updateProducts - 상품 업데이트 함수
 */
export function startSuggestSaleTimer(
  products: Product[],
  selectedProduct: string | null,
  updateProducts: (products: Product[]) => void
) {
  const delay = Math.random() * SUGGEST_DELAY_RANGE;

  timerState.suggestSaleTimeout = setTimeout(() => {
    timerState.suggestSaleInterval = setInterval(() => {
      triggerSuggestSale(products, selectedProduct, updateProducts);
    }, SUGGEST_SALE_INTERVAL);
  }, delay);
}

/**
 * 추천할인 타이머를 중지합니다.
 */
export function stopSuggestSaleTimer() {
  if (timerState.suggestSaleTimeout) {
    clearTimeout(timerState.suggestSaleTimeout);
    timerState.suggestSaleTimeout = null;
  }

  if (timerState.suggestSaleInterval) {
    clearInterval(timerState.suggestSaleInterval);
    timerState.suggestSaleInterval = null;
  }
}

/**
 * 추천할인 상태를 초기화합니다.
 * @param {Product[]} products - 상품 목록
 */
export function resetSuggestSale(products: Product[]) {
  products.forEach((product) => {
    if (product.suggestSale) {
      product.val = product.originalVal;
      product.suggestSale = false;
    }
  });
}

/**
 * 추천할인 서비스를 생성합니다.
 * @param {Product[]} products - 상품 목록
 * @param {string|null} selectedProduct - 선택된 상품 ID
 * @param {Function} updateProducts - 상품 업데이트 함수
 * @returns {Object} 추천할인 서비스 객체
 */
export function createSuggestSaleService(
  products: Product[],
  selectedProduct: string | null,
  updateProducts: (products: Product[]) => void
) {
  return {
    startSuggestSaleTimer: () => startSuggestSaleTimer(products, selectedProduct, updateProducts),
    stopSuggestSaleTimer,
    resetSuggestSale: () => resetSuggestSale(products),
  };
}
