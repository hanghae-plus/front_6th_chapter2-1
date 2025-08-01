import { updateProductOptions, updateStockInfo } from "../../components/ProductSelector.js";
import { updateCartItemPrice } from "../../components/CartItem.js";
import { PRODUCT_OPTIONS_UPDATED, PRODUCT_STOCK_UPDATED, PRODUCT_PRICES_UPDATED, PRODUCT_REFRESH_REQUESTED, STOCK_UPDATE_REQUESTED } from "../../constants/events.js";
import { QUANTITY_THRESHOLDS } from "../../constants/index.js";

// 재고 부족 메시지 생성
function generateStockWarningMessage(productList) {
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

// Product 관련 이벤트 리스너
export class ProductEventListeners {
  constructor(uiEventBus, productService, discountService) {
    this.uiEventBus = uiEventBus;
    this.productService = productService;
    this.discountService = discountService;
    this.initProductEventListeners();
  }

  initProductEventListeners() {
    // 상품 옵션 업데이트 이벤트
    this.uiEventBus.on(PRODUCT_OPTIONS_UPDATED, data => {
      if (data.success) {
        this.renderProductOptions(data.products, data.discountInfos);
      }
    });

    // 상품 재고 업데이트 이벤트
    this.uiEventBus.on(PRODUCT_STOCK_UPDATED, data => {
      if (data.success) {
        this.renderStockInfo(data.products, data.stockMessage);
      }
    });

    // 가격 정보 업데이트 이벤트
    this.uiEventBus.on(PRODUCT_PRICES_UPDATED, data => {
      if (data.success) {
        this.renderPricesInCart(data.itemsToUpdate);
      }
    });

    // 상품 데이터 직접 조회가 필요한 경우를 위한 이벤트
    this.uiEventBus.on(PRODUCT_REFRESH_REQUESTED, () => {
      const originalProducts = this.productService.getProducts();
      // 할인 정보가 적용된 상품 데이터 사용
      const productsWithDiscounts = this.discountService.getProductsWithCurrentDiscounts(originalProducts);

      this.uiEventBus.emit(PRODUCT_OPTIONS_UPDATED, {
        products: productsWithDiscounts,
        success: true,
      });
    });

    // 재고 정보 업데이트 요청 이벤트
    this.uiEventBus.on(STOCK_UPDATE_REQUESTED, () => {
      const products = this.productService.getProducts();
      const stockMessage = generateStockWarningMessage(products);

      this.uiEventBus.emit(PRODUCT_STOCK_UPDATED, {
        products,
        stockMessage,
        success: true,
      });
    });
  }

  renderProductOptions(products, discountInfos) {
    // ProductSelector 컴포넌트 업데이트
    updateProductOptions(products, discountInfos);
    updateStockInfo(products);
  }

  renderStockInfo(products, stockMessage) {
    // 재고 정보 업데이트
    updateStockInfo(products);

    // 재고 메시지 표시
    const stockInfo = document.querySelector("#stock-status");
    if (stockInfo) {
      stockInfo.textContent = stockMessage || generateStockWarningMessage(products);
    }
  }

  renderPricesInCart(itemsToUpdate) {
    // 장바구니 내 가격 업데이트
    itemsToUpdate.forEach(({ cartItem, product }) => {
      updateCartItemPrice(cartItem, product);
    });
  }
}
