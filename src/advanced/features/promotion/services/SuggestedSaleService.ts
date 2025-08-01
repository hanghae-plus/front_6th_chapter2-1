import { DISCOUNT_RATES, TIMER_DELAYS } from '../../../shared/constants';
import type { Product } from '../../../shared/types';

export function findSuggestedSaleTarget(
  products: Product[],
  lastSelectedProductId: string | null
): Product | null {
  if (!lastSelectedProductId) return null;

  const targetProduct = products.find(
    (product) =>
      product.id === lastSelectedProductId &&
      product.stock > 0 &&
      !product.isSuggestedSale
  );

  return targetProduct || null;
}

export function applySuggestedSale(product: Product) {
  return {
    product,
    message: `💝 ${product.name}을 위한 특별 할인이 진행중입니다!`,
    discountRate: DISCOUNT_RATES.SUGGEST,
  };
}

export function removeSuggestedSale(product: Product) {
  return {
    product,
    message: `추천 할인이 종료되었습니다: ${product.name}`,
  };
}

export function createSuggestedSaleManager(
  getProducts: () => Product[],
  getLastSelectedProductId: () => string | null,
  onApplySale: (productId: string) => void,
  onRemoveSale: (productId: string) => void,
  onUpdate?: () => void
) {
  let intervalId: NodeJS.Timeout | null = null;
  let currentSaleProductId: string | null = null;

  const runSuggestedSaleCycle = () => {
    // 기존 세일 해제
    if (currentSaleProductId) {
      onRemoveSale(currentSaleProductId);
      currentSaleProductId = null;
    }

    // 새로운 추천 세일 적용
    const products = getProducts();
    const lastSelectedId = getLastSelectedProductId();
    const target = findSuggestedSaleTarget(products, lastSelectedId);

    if (target) {
      onApplySale(target.id);
      currentSaleProductId = target.id;

      const saleInfo = applySuggestedSale(target);
      alert(saleInfo.message);
    }

    onUpdate?.();
  };

  const start = () => {
    if (intervalId) return;

    intervalId = setInterval(() => {
      runSuggestedSaleCycle();
    }, TIMER_DELAYS.SUGGEST.INTERVAL);
  };

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    if (currentSaleProductId) {
      onRemoveSale(currentSaleProductId);
      currentSaleProductId = null;
      onUpdate?.();
    }
  };

  return { start, stop };
}
