import { DISCOUNT_RATES, TIMER_DELAYS } from '../../../shared/constants';
import type { Product } from '../../../shared/types';

export function findLightningSaleTarget(products: Product[]): Product | null {
  const availableProducts = products.filter(
    (product) => product.stock > 0 && !product.isOnSale
  );

  if (availableProducts.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * availableProducts.length);
  return availableProducts[randomIndex];
}

export function applyLightningSale(product: Product) {
  return {
    product,
    message: `⚡ 번개세일! ${product.name}이 ${DISCOUNT_RATES.LIGHTNING * 100}% 할인 중입니다!`,
    discountRate: DISCOUNT_RATES.LIGHTNING,
  };
}

export function removeLightningSale(product: Product) {
  return {
    product,
    message: `번개세일이 종료되었습니다: ${product.name}`,
  };
}

export function createLightningSaleManager(
  getProducts: () => Product[],
  onApplySale: (productId: string) => void,
  onRemoveSale: (productId: string) => void,
  onUpdate?: () => void
) {
  let intervalId: NodeJS.Timeout | null = null;
  let currentSaleProductId: string | null = null;

  const runLightningSaleCycle = () => {
    // 기존 세일 해제
    if (currentSaleProductId) {
      onRemoveSale(currentSaleProductId);
      currentSaleProductId = null;
    }

    // 새로운 세일 적용
    const products = getProducts();
    const target = findLightningSaleTarget(products);

    if (target) {
      onApplySale(target.id);
      currentSaleProductId = target.id;

      const saleInfo = applyLightningSale(target);
      alert(saleInfo.message);
    }

    onUpdate?.();
  };

  const start = () => {
    if (intervalId) return;

    intervalId = setInterval(() => {
      runLightningSaleCycle();
    }, TIMER_DELAYS.LIGHTNING.INTERVAL);
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
