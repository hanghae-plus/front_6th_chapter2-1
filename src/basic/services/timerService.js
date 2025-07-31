import { uiEventBus } from "../core/eventBus.js";
import { discountService } from "./discountService.js";

export class TimerService {
  constructor(productService, discountService) {
    this.productService = productService;
    this.discountService = discountService;
    this.lightningSaleTimer = null;
    this.suggestSaleTimer = null;
  }

  // 번개세일 타이머 시작
  startLightningSaleTimer() {
    this.lightningSaleTimer = setInterval(() => {
      this.applyLightningSale();
    }, 3000); // 30초마다 실행
  }

  // 추천세일 타이머 시작
  startSuggestSaleTimer() {
    this.suggestSaleTimer = setInterval(() => {
      this.applySuggestSale();
    }, 5000); // 45초마다 실행
  }

  // 번개세일 적용 (ProductService의 비즈니스 로직 사용)
  applyLightningSale() {
    const result = this.productService.applyLightningSale();
    if (result.success) {
      console.log("⚡번개세일! " + result.product.name + "이(가) 20% 할인 중입니다!");
      this.updateUI();
      console.log(result.message);
    }
  }

  // 추천세일 적용 (ProductService의 비즈니스 로직 사용)
  applySuggestSale() {
    const lastSelectedProduct = this.getLastSelectedProduct();
    const result = this.productService.applySuggestSale(lastSelectedProduct?.id);

    if (result.success) {
      console.log("💝 " + result.product.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!");
      this.updateUI();
      console.log(result.message);
    }
  }

  // 마지막 선택된 상품 조회
  getLastSelectedProduct() {
    // 실제 구현에서는 선택된 상품을 추적하는 로직이 필요
    // 현재는 간단히 첫 번째 상품을 반환
    const products = this.productService.getProducts();
    return products.find(product => product.quantity > 0);
  }

  // UI 업데이트
  updateUI() {
    const originalProducts = this.productService.getProducts();
    const productsWithDiscounts = this.discountService.getProductsWithCurrentDiscounts(originalProducts);
    const discountInfos = this.calculateProductDiscountInfos(productsWithDiscounts);

    // 상품 옵션 업데이트 이벤트 발송
    uiEventBus.emit("product:options:updated", {
      products: productsWithDiscounts,
      discountInfos,
      success: true,
    });

    // 장바구니 가격 업데이트
    this.updateCartPrices();
  }

  // 장바구니 가격 업데이트
  updateCartPrices() {
    const cartItems = document.querySelectorAll(".cart-item");
    const itemsToUpdate = [];

    cartItems.forEach(cartItem => {
      const productId = cartItem.id; // cartItem.dataset.productId 대신 cartItem.id 사용
      const product = this.productService.getProductById(productId);

      if (product) {
        const discountInfo = {
          rate: this.discountService.calculateProductDiscountRate(product),
          status: this.discountService.getProductDiscountStatus(product),
        };

        itemsToUpdate.push({
          cartItem,
          product,
          discountInfo,
        });
      }
    });

    // 가격 업데이트 이벤트 발송
    uiEventBus.emit("product:prices:updated", {
      itemsToUpdate,
      success: true,
    });
  }

  // 할인 정보 계산
  calculateProductDiscountInfos(products) {
    return products.map(product => ({
      productId: product.id,
      rate: product.discountRate || this.discountService.calculateProductDiscountRate(product),
      status: product.discountStatus || this.discountService.getProductDiscountStatus(product),
    }));
  }

  // 타이머 정리
  cleanup() {
    if (this.lightningSaleTimer) {
      clearInterval(this.lightningSaleTimer);
    }
    if (this.suggestSaleTimer) {
      clearInterval(this.suggestSaleTimer);
    }
  }
}
