import { QUANTITY_THRESHOLDS, PRODUCT_IDS } from "../constants/index.js";

export function findProductById(productId, productList) {
  return productList.find(product => product.id === productId) || null;
}

export function calculateItemDiscount(productId, quantity) {
  const discountMap = {
    [PRODUCT_IDS.KEYBOARD]: 0.1, // 키보드
    [PRODUCT_IDS.MOUSE]: 0.15, // 마우스
    [PRODUCT_IDS.MONITOR_ARM]: 0.2, // 모니터암
    [PRODUCT_IDS.LAPTOP_POUCH]: 0.05, // 노트북 파우치
    [PRODUCT_IDS.SPEAKER]: 0.25, // 스피커
  };

  return quantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT ? discountMap[productId] || 0 : 0;
}
