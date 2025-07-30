import { discountService } from "../services/discountService.js";
import { uiEventBus } from "../core/eventBus.js";

// 할인 정보 계산 함수들
export function calculateProductDiscountInfo(product) {
  return {
    rate: discountService.calculateProductDiscountRate(product),
    status: discountService.getProductDiscountStatus(product),
  };
}

export function calculateProductDiscountInfos(products) {
  return products.map(product => ({
    productId: product.id,
    rate: discountService.calculateProductDiscountRate(product),
    status: discountService.getProductDiscountStatus(product),
  }));
}

// Product 옵션 업데이트 핸들러
export function handleProductOptionsUpdate(productService) {
  // 비즈니스 로직: 상품 데이터 가져오기
  const products = productService.getProducts();
  const discountInfos = calculateProductDiscountInfos(products);

  // 이벤트 발송 (DOM 조작 없음)
  uiEventBus.emit("product:options:updated", {
    products,
    discountInfos,
    success: true,
  });
}
