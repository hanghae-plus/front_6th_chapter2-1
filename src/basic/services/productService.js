import { ProductStore } from "../store/productStore.js";
import { QUANTITY_THRESHOLDS, DISCOUNT_RATES } from "../constants/index.js";
import { discountService } from "./discountService.js";

// 상품 관련 비즈니스 로직 서비스
export class ProductService {
  constructor() {
    this.productStore = new ProductStore();
  }

  // 상품 검증 (비즈니스 로직)
  validateProduct(productId) {
    const { products } = this.productStore.getState();
    const product = products.find(p => p.id === productId);
    return product && product.quantity > 0;
  }

  // 랜덤 상품 선택 (비즈니스 로직)
  selectRandomProduct() {
    const { products } = this.productStore.getState();
    const availableProducts = products.filter(product => product.quantity > 0);
    if (availableProducts.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableProducts.length);
    return availableProducts[randomIndex];
  }

  // 추천 상품 찾기 (비즈니스 로직)
  findSuggestionProduct(lastSelectedProductId) {
    const { products } = this.productStore.getState();
    const availableProducts = products.filter(product => product.quantity > 0);
    return availableProducts.find(product => product.id !== lastSelectedProductId && !product.suggestSale);
  }

  // 번개세일 적용 (비즈니스 로직)
  applyLightningSale() {
    const randomProduct = this.selectRandomProduct();
    if (randomProduct && !randomProduct.onSale) {
      const { products } = this.productStore.getState();
      const updatedProducts = products.map(product =>
        product.id === randomProduct.id
          ? {
              ...product,
              price: Math.round(product.originalPrice * DISCOUNT_RATES.LIGHTNING_SALE),
              onSale: true,
            }
          : product
      );

      this.productStore.setState({ products: updatedProducts });

      return {
        success: true,
        product: { ...randomProduct, price: Math.round(randomProduct.originalPrice * DISCOUNT_RATES.LIGHTNING_SALE), onSale: true },
        message: `⚡번개세일! ${randomProduct.name}이(가) 20% 할인 중입니다!`,
      };
    }
    return { success: false };
  }

  // 추천세일 적용 (비즈니스 로직)
  applySuggestSale(lastSelectedProductId) {
    const suggestionProduct = this.findSuggestionProduct(lastSelectedProductId);
    if (suggestionProduct) {
      const { products } = this.productStore.getState();
      const updatedProducts = products.map(product =>
        product.id === suggestionProduct.id
          ? {
              ...product,
              price: Math.round(product.price * DISCOUNT_RATES.SUGGEST_SALE),
              suggestSale: true,
            }
          : product
      );

      this.productStore.setState({ products: updatedProducts });

      return {
        success: true,
        product: { ...suggestionProduct, price: Math.round(suggestionProduct.price * DISCOUNT_RATES.SUGGEST_SALE), suggestSale: true },
        message: `💝 ${suggestionProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
      };
    }
    return { success: false };
  }

  // 재고 경고 메시지 생성 (비즈니스 로직)
  generateStockWarningMessage() {
    const { products } = this.productStore.getState();
    const lowStockProducts = products.filter(product => product.quantity < QUANTITY_THRESHOLDS.LOW_STOCK_WARNING && product.quantity > 0);

    if (lowStockProducts.length === 0) {
      return "모든 상품이 충분한 재고를 보유하고 있습니다.";
    }

    const productNames = lowStockProducts.map(product => product.name).join(", ");
    return `⚠️ 재고 부족: ${productNames}`;
  }

  // 전체 재고 계산 (비즈니스 로직)
  calculateTotalStock() {
    const { products } = this.productStore.getState();
    return products.reduce((total, product) => total + product.quantity, 0);
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
    const { products } = this.productStore.getState();
    return [...products]; // 불변성을 위해 복사본 반환
  }

  getProductById(productId) {
    const { products } = this.productStore.getState();
    return products.find(product => product.id === productId);
  }

  getAvailableProducts() {
    const { products } = this.productStore.getState();
    return products.filter(product => product.quantity > 0);
  }

  getSaleProducts() {
    const { products } = this.productStore.getState();
    return products.filter(product => product.onSale || product.suggestSale);
  }

  updateStock(productId, quantity) {
    const { products } = this.productStore.getState();
    const updatedProducts = products.map(product => (product.id === productId ? { ...product, quantity: Math.max(0, product.quantity + quantity) } : product));

    this.productStore.setState({ products: updatedProducts });
    return true;
  }

  hasStock(productId, requiredQuantity = 1) {
    const { products } = this.productStore.getState();
    const product = products.find(product => product.id === productId);
    return product && product.quantity >= requiredQuantity;
  }

  // 원래 가격으로 복원
  resetPrice(productId) {
    const { products } = this.productStore.getState();
    const updatedProducts = products.map(product =>
      product.id === productId
        ? {
            ...product,
            price: product.originalPrice,
            onSale: false,
            suggestSale: false,
          }
        : product
    );

    this.productStore.setState({ products: updatedProducts });
    return true;
  }

  // 모든 할인 초기화
  resetAllSales() {
    const { products } = this.productStore.getState();
    const updatedProducts = products.map(product => ({
      ...product,
      price: product.originalPrice,
      onSale: false,
      suggestSale: false,
    }));

    this.productStore.setState({ products: updatedProducts });
  }

  // 재고 부족 상품 조회
  getLowStockProducts(threshold) {
    const { products } = this.productStore.getState();
    return products.filter(product => product.quantity < threshold && product.quantity > 0);
  }

  // 가격 업데이트
  updatePrice(productId, newPrice) {
    const { products } = this.productStore.getState();
    const updatedProducts = products.map(product => (product.id === productId ? { ...product, price: newPrice } : product));

    this.productStore.setState({ products: updatedProducts });
    return true;
  }

  // 상품 상태 반환
  getState() {
    return this.productStore.getState();
  }
}
