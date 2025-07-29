import { updateProductOptions, updateStockInfo } from "../../components/ProductSelector.js";
import { PRODUCT_LIST } from "../../data/product.js";
import { discountService } from "../../services/discountService.js";

/**
 * Product 관련 이벤트 리스너
 * 상품 관련 이벤트만 처리하는 전용 클래스
 */
export class ProductEventListeners {
  constructor(uiEventBus) {
    this.uiEventBus = uiEventBus;
    this.initProductEventListeners();
  }

  initProductEventListeners() {
    // 상품 옵션 업데이트 이벤트
    this.uiEventBus.on("product:options:updated", () => {
      this.onUpdateSelectOptions();
    });
  }

  onUpdateSelectOptions() {
    // ProductSelector 컴포넌트 업데이트
    updateProductOptions(PRODUCT_LIST, this.calculateProductDiscountInfos(PRODUCT_LIST));
    updateStockInfo(PRODUCT_LIST);
  }

  calculateProductDiscountInfos(products) {
    return products.map(product => ({
      productId: product.id,
      rate: discountService.calculateProductDiscountRate(product),
      status: discountService.getProductDiscountStatus(product),
    }));
  }
}
