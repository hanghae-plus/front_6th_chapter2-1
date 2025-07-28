import { findAvailableProductExcept } from '../../shared/utils/index.js';

// 프로모션 관리 서비스
export class PromotionService {
  constructor(productRepository) {
    this.productRepo = productRepository;
    this.activePromotions = {
      flashSale: { active: false, products: [], startTime: null },
      suggestSale: { active: false, targetProduct: null, startTime: null }
    };
  }

  // 번개세일 시작
  startFlashSale() {
    const products = this.productRepo.findAll();
    const availableProducts = products.filter(p => p.q > 0);
    
    if (availableProducts.length === 0) return false;

    // 랜덤하게 상품 선택 (최대 3개)
    const saleCount = Math.min(3, availableProducts.length);
    const saleProducts = [];
    
    for (let i = 0; i < saleCount; i++) {
      const randomIndex = Math.floor(Math.random() * availableProducts.length);
      const product = availableProducts.splice(randomIndex, 1)[0];
      product.onSale = true;
      product.applyDiscount(0.20); // 20% 할인
      saleProducts.push(product);
    }

    this.activePromotions.flashSale = {
      active: true,
      products: saleProducts,
      startTime: new Date()
    };

    return true;
  }

  // 번개세일 종료
  endFlashSale() {
    if (!this.activePromotions.flashSale.active) return;

    this.activePromotions.flashSale.products.forEach(product => {
      product.onSale = false;
      product.resetPrice();
    });

    this.activePromotions.flashSale = {
      active: false,
      products: [],
      startTime: null
    };
  }

  // 추천 세일 시작
  startSuggestSale(lastSelectedProductId) {
    if (!lastSelectedProductId) return false;

    const products = this.productRepo.findAll();
    const suggestProduct = findAvailableProductExcept(products, lastSelectedProductId);
    
    if (!suggestProduct) return false;

    suggestProduct.suggestSale = true;
    suggestProduct.applyDiscount(0.05); // 5% 할인

    this.activePromotions.suggestSale = {
      active: true,
      targetProduct: suggestProduct,
      startTime: new Date()
    };

    return true;
  }

  // 추천 세일 종료
  endSuggestSale() {
    if (!this.activePromotions.suggestSale.active) return;

    const product = this.activePromotions.suggestSale.targetProduct;
    if (product) {
      product.suggestSale = false;
      product.resetPrice();
    }

    this.activePromotions.suggestSale = {
      active: false,
      targetProduct: null,
      startTime: null
    };
  }

  // SUPER SALE 체크 (번개세일 + 추천세일 동시 적용)
  checkSuperSale() {
    return this.activePromotions.flashSale.active && 
           this.activePromotions.suggestSale.active;
  }

  // 프로모션 상태 조회
  getPromotionStatus() {
    return {
      flashSale: { ...this.activePromotions.flashSale },
      suggestSale: { ...this.activePromotions.suggestSale },
      superSale: this.checkSuperSale()
    };
  }

  // 자동 프로모션 타이머 설정
  setupPromotionTimers() {
    // 번개세일: 30초마다 시작, 30초 지속
    setInterval(() => {
      if (!this.activePromotions.flashSale.active) {
        this.startFlashSale();
        setTimeout(() => this.endFlashSale(), 30000);
      }
    }, 30000);

    // 추천세일: 60초마다 체크
    setInterval(() => {
      if (!this.activePromotions.suggestSale.active) {
        // 마지막 선택 상품이 있을 때만 실행 (실제 구현에서는 상태에서 가져옴)
        const lastSelected = this._getLastSelectedProduct();
        if (lastSelected) {
          this.startSuggestSale(lastSelected);
          setTimeout(() => this.endSuggestSale(), 20000);
        }
      }
    }, 60000);
  }

  // 마지막 선택 상품 조회 (실제로는 외부 상태에서 가져와야 함)
  _getLastSelectedProduct() {
    // 이 부분은 실제 구현에서 AppState나 다른 서비스에서 가져와야 함
    return null;
  }

  // 프로모션 정리
  cleanup() {
    this.endFlashSale();
    this.endSuggestSale();
  }
}