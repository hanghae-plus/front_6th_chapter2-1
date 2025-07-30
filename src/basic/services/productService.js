import { ProductStore } from "../store/productStore.js";
import { QUANTITY_THRESHOLDS } from "../constants/index.js";
import { discountService } from "./discountService.js";

// 상품 관련된 서비스
export class ProductService {
  constructor() {
    this.productStore = new ProductStore();
  }

  // 상품 검증
  validateProduct(productId) {
    const product = this.productStore.getProductById(productId);
    return product && product.quantity > 0;
  }

  // 재고 확인
  checkStock(productId, requiredQuantity = 1) {
    return this.productStore.hasStock(productId, requiredQuantity);
  }

  // 재고 차감
  decreaseStock(productId, quantity = 1) {
    return this.productStore.updateStock(productId, -quantity);
  }

  // 재고 증가
  increaseStock(productId, quantity = 1) {
    return this.productStore.updateStock(productId, quantity);
  }

  // 랜덤 상품 선택 (재고 있는 상품 중에서)
  selectRandomProduct() {
    const availableProducts = this.productStore.getAvailableProducts();
    if (availableProducts.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableProducts.length);
    return availableProducts[randomIndex];
  }

  // 추천 상품 찾기 (마지막 선택 상품 제외)
  findSuggestionProduct(lastSelectedProductId) {
    const availableProducts = this.productStore.getAvailableProducts();
    return availableProducts.find(product => product.id !== lastSelectedProductId && !product.suggestSale);
  }

  // 번개세일 적용
  applyLightningSale() {
    const randomProduct = this.selectRandomProduct();
    if (randomProduct && !randomProduct.onSale) {
      const success = this.productStore.applyLightningSale(randomProduct.id);
      if (success) {
        return {
          success: true,
          product: randomProduct,
          message: `⚡번개세일! ${randomProduct.name}이(가) 20% 할인 중입니다!`,
        };
      }
    }
    return { success: false };
  }

  // 추천세일 적용
  applySuggestSale(lastSelectedProductId) {
    const suggestionProduct = this.findSuggestionProduct(lastSelectedProductId);
    if (suggestionProduct) {
      const success = this.productStore.applySuggestSale(suggestionProduct.id);
      if (success) {
        return {
          success: true,
          product: suggestionProduct,
          message: `💝 ${suggestionProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
        };
      }
    }
    return { success: false };
  }

  // 재고 경고 메시지 생성
  generateStockWarningMessage() {
    const lowStockProducts = this.productStore.getLowStockProducts(QUANTITY_THRESHOLDS.LOW_STOCK_WARNING);

    if (lowStockProducts.length === 0) {
      return "모든 상품이 충분한 재고를 보유하고 있습니다.";
    }

    const productNames = lowStockProducts.map(product => product.name).join(", ");
    return `⚠️ 재고 부족: ${productNames}`;
  }

  // 전체 재고 계산
  calculateTotalStock() {
    return this.productStore.getTotalStock();
  }

  // 상품 목록 조회
  getProducts() {
    return this.productStore.getProducts();
  }

  // 특정 상품 조회
  getProductById(productId) {
    return this.productStore.getProductById(productId);
  }

  // 할인 중인 상품 조회
  getSaleProducts() {
    return this.productStore.getSaleProducts();
  }

  // 초기화 메서드
  async initializeUI() {
    const products = this.getProducts();
    const discountInfos = this.calculateProductDiscountInfos(products);

    // 이벤트 발송
    const { uiEventBus } = await import("../core/eventBus.js");
    uiEventBus.emit("product:options:updated", {
      products,
      discountInfos,
      success: true,
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
