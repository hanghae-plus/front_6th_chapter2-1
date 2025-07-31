import { LOW_STOCK_THRESHOLD } from '../constants';
import type { Product } from '../types';

/**
 * 재고 상태를 가져옵니다.
 * @param {number} quantity - 재고 수량
 * @returns {Object} 재고 상태 정보
 */
export function getStockStatus(quantity: number) {
  if (quantity === 0) {
    return {
      status: 'out_of_stock',
      text: '품절',
      isSelectable: false,
    };
  }
  if (quantity < LOW_STOCK_THRESHOLD) {
    return {
      status: 'low_stock',
      text: `${quantity}개 남음`,
      isSelectable: true,
    };
  }

  return {
    status: 'in_stock',
    text: `${quantity}개`,
    isSelectable: true,
  };
}

/**
 * 재고가 부족한 상품들을 찾습니다.
 * @param {Product[]} products - 상품 목록
 * @returns {Product[]} 재고 부족 상품 목록
 */
export function getLowStockProducts(products: Product[]): Product[] {
  return products.filter(
    (product) => product.quantity > 0 && product.quantity < LOW_STOCK_THRESHOLD
  );
}

/**
 * 재고 경고 메시지를 생성합니다.
 * @param {Product[]} lowStockProducts - 재고 부족 상품 목록
 * @returns {string} 경고 메시지
 */
export function generateStockWarningMessage(lowStockProducts: Product[]): string {
  if (lowStockProducts.length === 0) {
    return '';
  }

  const warnings = lowStockProducts.map((product) => {
    const stockStatus = getStockStatus(product.quantity);
    return `${product.name}: ${stockStatus.text}`;
  });

  return warnings.join('\n');
}

/**
 * 상품의 재고 수량을 업데이트합니다.
 * @param {Product[]} products - 상품 목록
 * @param {string} productId - 상품 ID
 * @param {number} change - 변경량 (음수: 감소, 양수: 증가)
 */
export function updateStockQuantity(products: Product[], productId: string, change: number): void {
  const product = findProductById(products, productId);
  if (product) {
    product.quantity = Math.max(0, product.quantity + change);
  }
}

/**
 * 상품의 재고가 충분한지 확인합니다.
 * @param {Product} product - 상품 정보
 * @param {number} requestedQuantity - 요청 수량
 * @returns {boolean} 재고 충분 여부
 */
export function hasEnoughStock(product: Product, requestedQuantity: number): boolean {
  return product.quantity >= requestedQuantity;
}

/**
 * 상품이 선택 가능한지 확인합니다.
 * @param {Product} product - 상품 정보
 * @returns {boolean} 선택 가능 여부
 */
export function isProductSelectable(product: Product): boolean {
  return product.quantity > 0;
}

/**
 * 상품 ID로 상품을 찾는 헬퍼 함수
 * @param {Product[]} products - 상품 목록
 * @param {string} productId - 상품 ID
 * @returns {Product | undefined} 찾은 상품 또는 undefined
 */
function findProductById(products: Product[], productId: string): Product | undefined {
  return products.find((product) => product.id === productId);
}
