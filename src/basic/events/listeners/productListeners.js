import { updateProductOptions, updateStockInfo } from "../../components/ProductSelector.js";
import { updateCartItemPrice } from "../../components/CartItem.js";
import { discountService } from "../../services/discountService.js";
import { generateStockWarningMessage } from "../../utils/stockUtils.js";

/**
 * Product 관련 이벤트 리스너
 * 상품 관련 이벤트만 처리하는 전용 클래스
 */
export class ProductEventListeners {
  constructor(uiEventBus, productService) {
    this.uiEventBus = uiEventBus;
    this.productService = productService;
    this.initProductEventListeners();
  }

  initProductEventListeners() {
    // 상품 옵션 업데이트 이벤트
    this.uiEventBus.on("product:options:updated", data => {
      console.log("Product options updated:", data);
      if (data.success) {
        this.updateProductOptions(data.products, data.discountInfos);
      }
    });

    // 상품 재고 업데이트 이벤트
    this.uiEventBus.on("product:stock:updated", data => {
      if (data.success) {
        this.updateStockInfo(data.products, data.stockMessage);
      }
    });

    // 가격 정보 업데이트 이벤트
    this.uiEventBus.on("product:prices:updated", data => {
      console.log("Product prices updated:", data);
      if (data.success) {
        this.updatePricesInCart(data.itemsToUpdate);
      }
    });

    // 상품 데이터 직접 조회가 필요한 경우를 위한 이벤트
    this.uiEventBus.on("product:refresh:requested", () => {
      const products = this.productService.getProducts();
      const discountInfos = this.calculateProductDiscountInfos(products);

      this.uiEventBus.emit("product:options:updated", {
        products,
        discountInfos,
        success: true,
      });
    });
  }

  updateProductOptions(products, discountInfos) {
    // ProductSelector 컴포넌트 업데이트
    updateProductOptions(products, discountInfos);
    updateStockInfo(products);
  }

  updateStockInfo(products, stockMessage) {
    // 재고 정보 업데이트
    updateStockInfo(products);

    // 재고 메시지 표시
    const stockInfo = document.querySelector("#stock-status");
    if (stockInfo) {
      stockInfo.textContent = stockMessage || generateStockWarningMessage(products);
    }
  }

  updatePricesInCart(itemsToUpdate) {
    // 장바구니 내 가격 업데이트
    itemsToUpdate.forEach(({ element, product, discountInfo }) => {
      updateCartItemPrice(element, product, discountInfo);
    });
  }

  calculateProductDiscountInfos(products) {
    return products.map(product => ({
      productId: product.id,
      rate: discountService.calculateProductDiscountRate(product),
      status: discountService.getProductDiscountStatus(product),
    }));
  }
}
