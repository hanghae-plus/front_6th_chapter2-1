import { Product, CartItem } from './types';

/**
 * 상품 ID로 상품을 찾는 유틸 함수
 */
export const findProductById = (products: Product[], productId: string): Product | undefined => {
  return products.find(product => product.id === productId);
};

/**
 * 상품 ID로 상품을 찾는 유틸 함수 (CartItem에서 productId 사용)
 */
export const findProductByCartItem = (products: Product[], item: CartItem): Product | undefined => {
  return products.find(product => product.id === item.productId);
};

/**
 * 전체 재고 수량을 계산하는 유틸 함수
 */
export const calculateTotalStock = (products: Product[]): number => {
  return products.reduce((sum, product) => sum + product.quantity, 0);
};

/**
 * 전체 장바구니 아이템 수량을 계산하는 유틸 함수
 */
export const calculateTotalCartQuantity = (cartItems: CartItem[]): number => {
  return cartItems.reduce((sum, item) => sum + item.quantity, 0);
};

/**
 * 재고 부족 상품들을 필터링하는 유틸 함수
 */
export const getLowStockProducts = (products: Product[], threshold: number = 5): Product[] => {
  return products.filter(product => product.quantity < threshold && product.quantity > 0);
};

/**
 * 품절 상품들을 필터링하는 유틸 함수
 */
export const getOutOfStockProducts = (products: Product[]): Product[] => {
  return products.filter(product => product.quantity === 0);
};

/**
 * 번개세일 가능한 상품들을 필터링하는 유틸 함수
 */
export const getAvailableForLightningSale = (products: Product[]): Product[] => {
  return products.filter(product => product.quantity > 0 && !product.hasLightningDiscount);
};

/**
 * 추천할인 가능한 상품들을 필터링하는 유틸 함수
 */
export const getAvailableForRecommendationSale = (
  products: Product[], 
  currentProductId: string
): Product[] => {
  return products.filter(product => 
    product.id !== currentProductId && 
    product.quantity > 0 && 
    !product.hasRecommendationDiscount
  );
};

/**
 * 상품 이름과 수량만 추출하는 유틸 함수
 */
export const extractProductInfo = (products: Product[]): Array<{ name: string; quantity: number }> => {
  return products.map(product => ({ 
    name: product.name, 
    quantity: product.quantity 
  }));
};

/**
 * 재고 상태 메시지를 생성하는 유틸 함수
 */
export const generateStockStatusMessage = (products: Product[]): string => {
  const lowStockProducts = getLowStockProducts(products);
  const outOfStockProducts = getOutOfStockProducts(products);
  
  const messages = [
    ...lowStockProducts.map(product => `${product.name}: 재고 부족 (${product.quantity}개 남음)`),
    ...outOfStockProducts.map(product => `${product.name}: 품절`)
  ];
  
  return messages.join('\n');
};

/**
 * 화요일인지 확인하는 유틸 함수
 */
export const isTuesday = (): boolean => {
  return new Date().getDay() === 2;
};

/**
 * 대량구매 할인 적용 가능한지 확인하는 유틸 함수
 */
export const isBulkPurchaseEligible = (cartItems: CartItem[]): boolean => {
  return calculateTotalCartQuantity(cartItems) >= 30;
};

/**
 * 개별 상품 할인 적용 가능한지 확인하는 유틸 함수
 */
export const isIndividualDiscountEligible = (quantity: number): boolean => {
  return quantity >= 10;
}; 