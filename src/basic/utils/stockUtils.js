import { QUANTITY_THRESHOLDS } from "../constants/index.js";

export function generateStockWarningMessage(productList) {
  return productList
    .filter(item => item.quantity < QUANTITY_THRESHOLDS.LOW_STOCK_WARNING)
    .map(item => {
      if (item.quantity > 0) {
        return `${item.name}: 재고 부족 (${item.quantity}개 남음)`;
      } else {
        return `${item.name}: 품절`;
      }
    })
    .join("\n");
}
