import { QUANTITY_THRESHOLDS } from "../constants/index.js";

export function findProductById(productId, productList) {
  return productList.find(product => product.id === productId) || null;
}

export function calculateItemDiscount(productId, quantity) {
  const discountMap = {
    p1: 0.1, // 키보드
    p2: 0.15, // 마우스
    p3: 0.2, // 모니터암
    p4: 0.05, // 노트북 파우치
    p5: 0.25, // 스피커
  };

  return quantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT ? discountMap[productId] || 0 : 0;
}
