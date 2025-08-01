import { STOCK_THRESHOLDS } from "../../constants";
import { useProductData } from "../products/productData";

export const useStockManager = {
  /**
   * 재고 경고 메시지 생성
   * @returns {string} 재고 경고 메시지
   */
  generateStockWarningMessage(): string {
    const products = useProductData.getProducts();
    let warningMsg = "";

    products.forEach((item) => {
      if (item.q < STOCK_THRESHOLDS.LOW_STOCK_WARNING) {
        if (item.q > 0) {
          warningMsg += `${item.name}: 재고 부족 (${item.q}개 남음)\n`;
        } else {
          warningMsg += `${item.name}: 품절\n`;
        }
      }
    });

    return warningMsg;
  },

  /**
   * 재고 정보 UI 업데이트
   */
  updateStockInfoDisplay(): void {
    const warningMessage = this.generateStockWarningMessage();
    const stockInfoElement = document.getElementById("stock-status");
    if (stockInfoElement) {
      stockInfoElement.textContent = warningMessage;
    }
  },
};
