import {
  PRODUCT_IDS,
  PRODUCT_NAMES,
  PRODUCT_PRICES,
  INITIAL_STOCK,
  DISCOUNT_THRESHOLDS,
  DISCOUNT_RATES,
} from '../../constants/index.js';

/**
 * 상품 관련 비즈니스 로직을 담당하는 함수들
 */

/**
 * 상품 목록
 */
export function initializeProducts() {
  return [
    {
      id: PRODUCT_IDS.KEYBOARD,
      name: PRODUCT_NAMES[PRODUCT_IDS.KEYBOARD],
      price: PRODUCT_PRICES[PRODUCT_IDS.KEYBOARD],
      originalPrice: PRODUCT_PRICES[PRODUCT_IDS.KEYBOARD],
      quantity: INITIAL_STOCK[PRODUCT_IDS.KEYBOARD],
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.MOUSE,
      name: PRODUCT_NAMES[PRODUCT_IDS.MOUSE],
      price: PRODUCT_PRICES[PRODUCT_IDS.MOUSE],
      originalPrice: PRODUCT_PRICES[PRODUCT_IDS.MOUSE],
      quantity: INITIAL_STOCK[PRODUCT_IDS.MOUSE],
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.MONITOR_ARM,
      name: PRODUCT_NAMES[PRODUCT_IDS.MONITOR_ARM],
      price: PRODUCT_PRICES[PRODUCT_IDS.MONITOR_ARM],
      originalPrice: PRODUCT_PRICES[PRODUCT_IDS.MONITOR_ARM],
      quantity: INITIAL_STOCK[PRODUCT_IDS.MONITOR_ARM],
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.LAPTOP_CASE,
      name: PRODUCT_NAMES[PRODUCT_IDS.LAPTOP_CASE],
      price: PRODUCT_PRICES[PRODUCT_IDS.LAPTOP_CASE],
      originalPrice: PRODUCT_PRICES[PRODUCT_IDS.LAPTOP_CASE],
      quantity: INITIAL_STOCK[PRODUCT_IDS.LAPTOP_CASE],
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.SPEAKER,
      name: PRODUCT_NAMES[PRODUCT_IDS.SPEAKER],
      price: PRODUCT_PRICES[PRODUCT_IDS.SPEAKER],
      originalPrice: PRODUCT_PRICES[PRODUCT_IDS.SPEAKER],
      quantity: INITIAL_STOCK[PRODUCT_IDS.SPEAKER],
      onSale: false,
      suggestSale: false,
    },
  ];
}

/**
 * 상품 ID로 상품 조회
 */
export function getProductById(products, productId) {
  return products.find((product) => product.id === productId);
}

/**
 * 모든 상품 조회
 */
export function getAllProducts(products) {
  return [...products];
}

/**
 * 상품 재고 감소
 */
export function decreaseStock(products, productId, quantity = 1) {
  const product = getProductById(products, productId);
  if (product && product.quantity >= quantity) {
    const updatedProducts = products.map((p) =>
      p.id === productId ? { ...p, quantity: p.quantity - quantity } : p,
    );
    return { success: true, products: updatedProducts };
  }
  return { success: false, products };
}

/**
 * 상품 재고 증가
 */
export function increaseStock(products, productId, quantity = 1) {
  const product = getProductById(products, productId);
  if (product) {
    const updatedProducts = products.map((p) =>
      p.id === productId ? { ...p, quantity: p.quantity + quantity } : p,
    );
    return { success: true, products: updatedProducts };
  }
  return { success: false, products };
}

/**
 * 상품 할인 적용
 */
export function applySale(products, productId, discountRate) {
  const product = getProductById(products, productId);
  if (product) {
    const updatedProducts = products.map((p) =>
      p.id === productId
        ? {
            ...p,
            price: Math.round(p.originalPrice * (1 - discountRate)),
            onSale: true,
          }
        : p,
    );
    return { success: true, products: updatedProducts };
  }
  return { success: false, products };
}

/**
 * 상품 추천 할인 적용
 */
export function applySuggestSale(products, productId, discountRate) {
  const product = getProductById(products, productId);
  if (product) {
    const updatedProducts = products.map((p) =>
      p.id === productId
        ? {
            ...p,
            price: Math.round(p.price * (1 - discountRate)),
            suggestSale: true,
          }
        : p,
    );
    return { success: true, products: updatedProducts };
  }
  return { success: false, products };
}

/**
 * 상품 할인 초기화
 */
export function resetSale(products, productId) {
  const product = getProductById(products, productId);
  if (product) {
    const updatedProducts = products.map((p) =>
      p.id === productId
        ? {
            ...p,
            price: p.originalPrice,
            onSale: false,
            suggestSale: false,
          }
        : p,
    );
    return { success: true, products: updatedProducts };
  }
  return { success: false, products };
}

/**
 * 재고 부족 상품 조회
 */
export function getLowStockProducts(products) {
  return products.filter(
    (product) => product.quantity < DISCOUNT_THRESHOLDS.INDIVIDUAL_ITEM && product.quantity > 0,
  );
}

/**
 * 품절 상품 조회
 */
export function getOutOfStockProducts(products) {
  return products.filter((product) => product.quantity === 0);
}

/**
 * 총 재고 수량 계산
 */
export function getTotalStock(products) {
  return products.reduce((total, product) => total + product.quantity, 0);
}

/**
 * 개별 상품 할인율 계산
 */
export function calculateItemDiscount(productId, quantity) {
  if (quantity < DISCOUNT_THRESHOLDS.INDIVIDUAL_ITEM) {
    return 0;
  }

  const discountMap = {
    [PRODUCT_IDS.KEYBOARD]: DISCOUNT_RATES.KEYBOARD,
    [PRODUCT_IDS.MOUSE]: DISCOUNT_RATES.MOUSE,
    [PRODUCT_IDS.MONITOR_ARM]: DISCOUNT_RATES.MONITOR_ARM,
    [PRODUCT_IDS.LAPTOP_CASE]: DISCOUNT_RATES.LAPTOP_CASE,
    [PRODUCT_IDS.SPEAKER]: DISCOUNT_RATES.SPEAKER,
  };

  return discountMap[productId] || 0;
}

/**
 * 상품 가격 업데이트
 */
export function updateProductPrice(products, productId, newPrice) {
  return products.map((p) => (p.id === productId ? { ...p, price: newPrice } : p));
}

/**
 * 상품 상태 업데이트
 */
export function updateProductState(products, productId, updates) {
  return products.map((p) => (p.id === productId ? { ...p, ...updates } : p));
}
