import { ProductStore } from "../store/productStore.js";
import { QUANTITY_THRESHOLDS, DISCOUNT_RATES } from "../constants/index.js";

// 상품 업데이트 유틸리티 함수들
const ProductUpdateHelper = {
  // 상품 가격 업데이트 헬퍼
  updateProductPrice(product, newPrice, saleFlags = {}) {
    return {
      ...product,
      price: newPrice,
      ...saleFlags,
    };
  },

  // 할인 가격 계산 헬퍼
  calculateDiscountedPrice(originalPrice, discountRate) {
    return Math.round(originalPrice * discountRate);
  },

  // 상품 상태 업데이트 헬퍼
  updateProductState(product, updates) {
    return {
      ...product,
      ...updates,
    };
  },
};

// 상품 조회 관련 헬퍼
const ProductQueryHelper = {
  // 상품 검증
  validateProduct(products, productId) {
    const product = products.find(item => item.id === productId);
    return product && product.quantity > 0;
  },

  // 랜덤 상품 선택
  selectRandomProduct(products) {
    const availableProducts = products.filter(product => product.quantity > 0);
    if (availableProducts.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableProducts.length);
    return availableProducts[randomIndex];
  },

  // 추천 상품 찾기
  findSuggestionProduct(products, selectedProductId) {
    const availableProducts = products.filter(product => product.quantity > 0);
    return availableProducts.find(product => product.id !== selectedProductId && !product.suggestSale);
  },

  // 재고 부족 상품 조회
  getLowStockProducts(products, stockThreshold) {
    return products.filter(product => product.quantity < stockThreshold && product.quantity > 0);
  },

  // 구매 가능한 상품 조회
  getAvailableProducts(products) {
    return products.filter(product => product.quantity > 0);
  },

  // 할인 상품 조회
  getSaleProducts(products) {
    return products.filter(product => product.onSale || product.suggestSale);
  },

  // 상품 ID로 조회
  getProductById(products, productId) {
    return products.find(product => product.id === productId);
  },
};

// 재고 관리 헬퍼
const StockHelper = {
  // 재고 업데이트
  updateStock(products, productId, quantity) {
    return products.map(product => (product.id === productId ? { ...product, quantity: Math.max(0, product.quantity + quantity) } : product));
  },

  // 재고 확인
  hasStock(products, productId, requiredQuantity = 1) {
    const product = products.find(item => item.id === productId);
    return product && product.quantity >= requiredQuantity;
  },

  // 전체 재고 계산
  calculateTotalStock(products) {
    return products.reduce((total, product) => total + product.quantity, 0);
  },

  // 재고 경고 메시지 생성
  generateStockWarningMessage(products) {
    const lowStockProducts = products.filter(product => product.quantity < QUANTITY_THRESHOLDS.LOW_STOCK_WARNING && product.quantity > 0);

    if (lowStockProducts.length === 0) {
      return "모든 상품이 충분한 재고를 보유하고 있습니다.";
    }

    const productNames = lowStockProducts.map(product => product.name).join(", ");
    return `⚠️ 재고 부족: ${productNames}`;
  },
};

// 할인 관리 헬퍼
const SaleHelper = {
  // 번개세일 적용
  applyLightningSale(products, randomProduct) {
    if (!randomProduct || randomProduct.onSale) return { success: false };

    const discountedPrice = ProductUpdateHelper.calculateDiscountedPrice(randomProduct.originalPrice, DISCOUNT_RATES.LIGHTNING_SALE);

    const updatedProducts = products.map(product => (product.id === randomProduct.id ? ProductUpdateHelper.updateProductPrice(product, discountedPrice, { onSale: true }) : product));

    return {
      success: true,
      product: ProductUpdateHelper.updateProductPrice(randomProduct, discountedPrice, { onSale: true }),
      message: `⚡번개세일! ${randomProduct.name}이(가) 20% 할인 중입니다!`,
      updatedProducts,
    };
  },

  // 추천세일 적용
  applySuggestSale(products, suggestionProduct) {
    if (!suggestionProduct) return { success: false };

    const discountedPrice = ProductUpdateHelper.calculateDiscountedPrice(suggestionProduct.price, DISCOUNT_RATES.SUGGEST_SALE);

    const updatedProducts = products.map(product => (product.id === suggestionProduct.id ? ProductUpdateHelper.updateProductPrice(product, discountedPrice, { suggestSale: true }) : product));

    return {
      success: true,
      product: ProductUpdateHelper.updateProductPrice(suggestionProduct, discountedPrice, { suggestSale: true }),
      message: `💝 ${suggestionProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
      updatedProducts,
    };
  },

  // 가격 초기화
  resetPrice(products, productId) {
    return products.map(product =>
      product.id === productId
        ? ProductUpdateHelper.updateProductState(product, {
            price: product.originalPrice,
            onSale: false,
            suggestSale: false,
          })
        : product
    );
  },

  // 모든 할인 초기화
  resetAllSales(products) {
    return products.map(product =>
      ProductUpdateHelper.updateProductState(product, {
        price: product.originalPrice,
        onSale: false,
        suggestSale: false,
      })
    );
  },

  // 가격 업데이트
  updatePrice(products, productId, newPrice) {
    return products.map(product => (product.id === productId ? ProductUpdateHelper.updateProductPrice(product, newPrice) : product));
  },
};

// 상품 관련 비즈니스 로직 서비스
export class ProductService {
  constructor() {
    this.productStore = new ProductStore();
  }

  // 헬퍼 객체들에 대한 접근자
  getQueryHelper() {
    return ProductQueryHelper;
  }

  getStockHelper() {
    return StockHelper;
  }

  getSaleHelper() {
    return SaleHelper;
  }

  // 상품 검증
  validateProduct(productId) {
    const { products } = this.productStore.getState();
    return ProductQueryHelper.validateProduct(products, productId);
  }

  // 랜덤 상품 선택
  selectRandomProduct() {
    const { products } = this.productStore.getState();
    return ProductQueryHelper.selectRandomProduct(products);
  }

  // 추천 상품 찾기
  findSuggestionProduct(selectedProductId) {
    const { products } = this.productStore.getState();
    return ProductQueryHelper.findSuggestionProduct(products, selectedProductId);
  }

  // 번개세일 적용
  applyLightningSale() {
    const randomProduct = this.selectRandomProduct();
    const { products } = this.productStore.getState();

    const result = SaleHelper.applyLightningSale(products, randomProduct);

    if (result.success) {
      this.productStore.setState({ products: result.updatedProducts });
    }

    return result;
  }

  // 추천세일 적용
  applySuggestSale(selectedProductId) {
    const suggestionProduct = this.findSuggestionProduct(selectedProductId);
    const { products } = this.productStore.getState();

    const result = SaleHelper.applySuggestSale(products, suggestionProduct);

    if (result.success) {
      this.productStore.setState({ products: result.updatedProducts });
    }

    return result;
  }

  // 재고 경고 메시지 생성
  generateStockWarningMessage() {
    const { products } = this.productStore.getState();
    return StockHelper.generateStockWarningMessage(products);
  }

  // 전체 재고 계산
  calculateTotalStock() {
    const { products } = this.productStore.getState();
    return StockHelper.calculateTotalStock(products);
  }

  // Store 메서드들에 대한 간단한 접근자
  getProducts() {
    const { products } = this.productStore.getState();
    return [...products]; // 불변성을 위해 복사본 반환
  }

  getProductById(productId) {
    const { products } = this.productStore.getState();
    return ProductQueryHelper.getProductById(products, productId);
  }

  getAvailableProducts() {
    const { products } = this.productStore.getState();
    return ProductQueryHelper.getAvailableProducts(products);
  }

  getSaleProducts() {
    const { products } = this.productStore.getState();
    return ProductQueryHelper.getSaleProducts(products);
  }

  updateStock(productId, quantity) {
    const { products } = this.productStore.getState();
    const updatedProducts = StockHelper.updateStock(products, productId, quantity);
    this.productStore.setState({ products: updatedProducts });
    return true;
  }

  hasStock(productId, requiredQuantity = 1) {
    const { products } = this.productStore.getState();
    return StockHelper.hasStock(products, productId, requiredQuantity);
  }

  // 원래 가격으로 복원
  resetPrice(productId) {
    const { products } = this.productStore.getState();
    const updatedProducts = SaleHelper.resetPrice(products, productId);
    this.productStore.setState({ products: updatedProducts });
    return true;
  }

  // 모든 할인 초기화
  resetAllSales() {
    const { products } = this.productStore.getState();
    const updatedProducts = SaleHelper.resetAllSales(products);
    this.productStore.setState({ products: updatedProducts });
  }

  // 재고 부족 상품 조회
  getLowStockProducts(stockThreshold) {
    const { products } = this.productStore.getState();
    return StockHelper.getLowStockProducts(products, stockThreshold);
  }

  // 가격 업데이트
  updatePrice(productId, newPrice) {
    const { products } = this.productStore.getState();
    const updatedProducts = SaleHelper.updatePrice(products, productId, newPrice);
    this.productStore.setState({ products: updatedProducts });
    return true;
  }

  // 상품 상태 반환
  getState() {
    return this.productStore.getState();
  }
}
