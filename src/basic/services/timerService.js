import { uiEventBus } from "../core/eventBus.js";
import { PRODUCT_OPTIONS_UPDATED, CART_PRICES_UPDATE_REQUESTED, PRODUCT_PRICES_UPDATED } from "../constants/events.js";
import { calculateProductDiscountInfos } from "../utils/discountUtils.js";

// 타이머 서비스
export class TimerService {
  constructor(productService, discountService, cartService) {
    this.productService = productService;
    this.discountService = discountService;
    this.cartService = cartService;
    this.lightningSaleTimer = null;
    this.suggestSaleTimer = null;
  }

  // 번개세일 타이머 시작
  startLightningSaleTimer() {
    const lightningDelay = Math.random() * 10000;
    setTimeout(() => {
      this.lightningSaleTimer = setInterval(() => {
        this.applyLightningSale();
      }, 30000);
    }, lightningDelay);
  }

  // 추천세일 타이머 시작
  startSuggestSaleTimer() {
    const suggestDelay = Math.random() * 20000;
    setTimeout(() => {
      this.suggestSaleTimer = setInterval(() => {
        this.applySuggestSale();
      }, 60000);
    }, suggestDelay);
  }

  // 번개세일 적용 (순수 비즈니스 로직)
  applyLightningSale() {
    const result = this.productService.applyLightningSale();
    if (result.success) {
      console.log("⚡번개세일! " + result.product.name + "이(가) 20% 할인 중입니다!");
      this.notifyUIUpdate(); // ✅ UI 업데이트를 이벤트로 분리
      console.log(result.message);
    }
  }

  // 추천세일 적용 (순수 비즈니스 로직)
  applySuggestSale() {
    const lastSelectedProduct = this.getLastSelectedProduct();
    const result = this.productService.applySuggestSale(lastSelectedProduct?.id);

    if (result.success) {
      console.log("💝 " + result.product.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!");
      this.notifyUIUpdate(); // ✅ UI 업데이트를 이벤트로 분리
      console.log(result.message);
    }
  }

  // UI 업데이트 알림 (이벤트 기반)
  notifyUIUpdate() {
    const originalProducts = this.productService.getProducts();
    const productsWithDiscounts = this.discountService.getProductsWithCurrentDiscounts(originalProducts);
    const discountInfos = calculateProductDiscountInfos(productsWithDiscounts, this.discountService);

    // 상품 옵션 업데이트 이벤트 발송
    uiEventBus.emit(PRODUCT_OPTIONS_UPDATED, {
      products: productsWithDiscounts,
      discountInfos,
      success: true,
    });

    // 장바구니 가격 업데이트 이벤트 발송
    uiEventBus.emit(CART_PRICES_UPDATE_REQUESTED, {
      success: true,
    });
  }

  // 장바구니 가격 업데이트 (순수 비즈니스 로직)
  updateCartPrices() {
    const cartState = this.cartService.getState();
    const { cartItems } = cartState;

    const itemsToUpdate = [];

    cartItems.forEach(cartItem => {
      const product = this.productService.getProductById(cartItem.id);

      if (product) {
        const discountInfo = {
          rate: this.discountService.calculateProductDiscountRate(product),
          status: this.discountService.getProductDiscountStatus(product),
        };

        itemsToUpdate.push({
          cartItemId: cartItem.id,
          product,
          discountInfo,
        });
      }
    });

    // 가격 업데이트 이벤트 발송
    uiEventBus.emit(PRODUCT_PRICES_UPDATED, {
      itemsToUpdate,
      success: true,
    });
  }

  // 마지막 선택된 상품 조회 (순수 비즈니스 로직)
  getLastSelectedProduct() {
    const products = this.productService.getProducts();
    return products.find(product => product.quantity > 0);
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
