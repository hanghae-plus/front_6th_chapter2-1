import { generateStockWarningMessage } from "../utils/stockUtils.js";
import { uiEventBus } from "../core/eventBus.js";

// 재고 정보 업데이트 핸들러
export function handleStockUpdate(productService) {
  // 비즈니스 로직: 재고 정보 계산
  const products = productService.getProducts();
  const stockMessage = generateStockWarningMessage(products);

  // 이벤트 발송 (DOM 조작 없음)
  uiEventBus.emit("product:stock:updated", {
    products,
    stockMessage,
    success: true,
  });
}
