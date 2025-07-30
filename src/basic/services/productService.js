import { ProductStore } from "../store/productStore.js";
import { QUANTITY_THRESHOLDS } from "../constants/index.js";
import { discountService } from "./discountService.js";

// 상품 관련 비즈니스 로직 서비스
export class ProductService {
  constructor() {
    this.productStore = new ProductStore();
  }

  // 상품 검증 (비즈니스 로직)
  validateProduct(productId) {
    const product = this.productStore.getProductById(productId);
    return product && product.quantity > 0;
  }

  // 랜덤 상품 선택 (비즈니스 로직)
  selectRandomProduct() {
    const availableProducts = this.productStore.getAvailableProducts();
    if (availableProducts.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableProducts.length);
    return availableProducts[randomIndex];
  }

  // 추천 상품 찾기 (비즈니스 로직)
  findSuggestionProduct(lastSelectedProductId) {
    const availableProducts = this.productStore.getAvailableProducts();
    return availableProducts.find(product => product.id !== lastSelectedProductId && !product.suggestSale);
  }

  // 번개세일 적용 (비즈니스 로직)
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

  // 추천세일 적용 (비즈니스 로직)
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

  // 재고 경고 메시지 생성 (비즈니스 로직)
  generateStockWarningMessage() {
    const lowStockProducts = this.productStore.getLowStockProducts(QUANTITY_THRESHOLDS.LOW_STOCK_WARNING);

    if (lowStockProducts.length === 0) {
      return "모든 상품이 충분한 재고를 보유하고 있습니다.";
    }

    const productNames = lowStockProducts.map(product => product.name).join(", ");
    return `⚠️ 재고 부족: ${productNames}`;
  }

  // 전체 재고 계산 (비즈니스 로직)
  calculateTotalStock() {
    return this.productStore.getTotalStock();
  }

  // 할인 정보 계산
  calculateProductDiscountInfos(products) {
    return products.map(product => ({
      productId: product.id,
      rate: discountService.calculateProductDiscountRate(product),
      status: discountService.getProductDiscountStatus(product),
    }));
  }

  // Store 메서드들에 대한 간단한 접근자 (필요한 경우만)
  getProducts() {
    return this.productStore.getProducts();
  }

  getProductById(productId) {
    return this.productStore.getProductById(productId);
  }

  getAvailableProducts() {
    return this.productStore.getAvailableProducts();
  }

  getSaleProducts() {
    return this.productStore.getSaleProducts();
  }

  updateStock(productId, quantity) {
    return this.productStore.updateStock(productId, quantity);
  }

  hasStock(productId, requiredQuantity = 1) {
    return this.productStore.hasStock(productId, requiredQuantity);
  }
}
