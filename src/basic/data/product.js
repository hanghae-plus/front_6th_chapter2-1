import { PRODUCT_LIST } from './constants.js';

// 상품 관련 상수
const PRODUCT_CONSTANTS = {
  MIN_STOCK_THRESHOLD: 5,        // 재고 부족 기준 (5개 미만)
  LIGHTNING_SALE_DISCOUNT: 0.2,  // 번개세일 할인율 (20%)
  SUGGESTED_SALE_DISCOUNT: 0.05, // 추천할인 할인율 (5%)
  MIN_STOCK: 0                   // 최소 재고 (0개)
};

// 글로벌 상태 변수
let productList = [...PRODUCT_LIST]; // 상품 목록 (재고 변화 가능)

// 상품 목록 초기화 (깊은 복사)
export const initializeProduct = () => {
  productList = PRODUCT_LIST.map(product => ({ ...product }));
  console.log('Product initialized');
};

// 상품 목록 조회
export const getProductList = () => productList;

// ID로 상품 조회
export const getProductById = (productId) => {
  return productList.find(product => product.id === productId);
};

// 상품 재고 업데이트
export const updateProductStock = (productId, changeAmount) => {
  const product = getProductById(productId);
  if (product) {
    product.stock -= changeAmount; // changeAmount가 양수면 재고 감소, 음수면 재고 증가
    if (product.stock < PRODUCT_CONSTANTS.MIN_STOCK) product.stock = PRODUCT_CONSTANTS.MIN_STOCK; // 재고는 0 미만이 될 수 없음
  }
};

// 상품 재고 복원
export const restoreProductStock = (productId, amount) => {
  const product = getProductById(productId);
  if (product) {
    product.stock += amount;
  }
};

// 전체 재고 계산
export const calculateTotalStock = () => {
  return productList.reduce((total, product) => total + product.stock, 0);
};

// 재고 부족 상품 조회 (5개 미만)
export const getLowStockItems = () => {
  return productList.filter(product => 
    product.stock > PRODUCT_CONSTANTS.MIN_STOCK && 
    product.stock < PRODUCT_CONSTANTS.MIN_STOCK_THRESHOLD
  );
};

// 상품 할인 상태 업데이트
export const updateProductSaleStatus = (productId, isOnSale, isSuggestedSale) => {
  const product = getProductById(productId);
  if (product) {
    product.isOnSale = isOnSale;
    product.isSuggestedSale = isSuggestedSale;
    
    // 할인이 해제되면 원래 가격으로 복원
    if (!isOnSale && !isSuggestedSale) {
      product.price = product.originalPrice;
    }
  }
};

// 모든 상품 가격 초기화
export const resetProductPrices = () => {
  productList.forEach(product => {
    product.price = product.originalPrice;
    product.isOnSale = false;
    product.isSuggestedSale = false;
  });
};

// 번개세일 시작 (20% 할인)
export const startLightningSale = () => {
  const availableProducts = productList.filter(product => 
    product.stock > PRODUCT_CONSTANTS.MIN_STOCK && 
    !product.isOnSale && 
    !product.isSuggestedSale
  );
  
  if (availableProducts.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * availableProducts.length);
  const selectedProduct = availableProducts[randomIndex];
  
  // 20% 할인 적용
  selectedProduct.price = Math.round(selectedProduct.originalPrice * (1 - PRODUCT_CONSTANTS.LIGHTNING_SALE_DISCOUNT));
  selectedProduct.isOnSale = true;
  
  return selectedProduct;
};

// 추천할인 시작 (5% 할인)
export const startSuggestedSale = (excludeProductId) => {
  const availableProducts = productList.filter(product => 
    product.stock > PRODUCT_CONSTANTS.MIN_STOCK && 
    product.id !== excludeProductId && 
    !product.isOnSale && 
    !product.isSuggestedSale
  );
  
  if (availableProducts.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * availableProducts.length);
  const selectedProduct = availableProducts[randomIndex];
  
  // 5% 할인 적용
  selectedProduct.price = Math.round(selectedProduct.price * (1 - PRODUCT_CONSTANTS.SUGGESTED_SALE_DISCOUNT));
  selectedProduct.isSuggestedSale = true;
  
  return selectedProduct;
}; 