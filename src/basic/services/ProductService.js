import { Product, initialProducts } from "../models/Product.js";
import { DISCOUNT_POLICIES, EVENT_INTERVALS } from "../constants.js";

export class ProductService {
  constructor() {
    this.products = [...initialProducts];
    this.lastSelectedProductId = null;
  }

  // 모든 상품 가져오기
  getProducts() {
    return this.products;
  }

  // 상품 ID로 상품 찾기
  getProductById(productId) {
    return this.products.find((product) => product.id === productId);
  }

  // 재고 있는 상품만 가져오기
  getAvailableProducts() {
    return this.products.filter((product) => !product.isOutOfStock());
  }

  // 재고 부족 상품 가져오기
  getLowStockProducts() {
    return this.products.filter((product) => product.isLowStock());
  }

  // 품절 상품 가져오기
  getOutOfStockProducts() {
    return this.products.filter((product) => product.isOutOfStock());
  }

  // 총 재고 수량 계산
  getTotalStock() {
    return this.products.reduce((total, product) => total + product.stock, 0);
  }

  // 마지막 선택된 상품 설정
  setLastSelectedProduct(productId) {
    this.lastSelectedProductId = productId;
  }

  // 마지막 선택된 상품 가져오기
  getLastSelectedProduct() {
    return this.lastSelectedProductId;
  }

  // 번개세일 적용
  applyLightningSale() {
    const availableProducts = this.getAvailableProducts();
    if (availableProducts.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableProducts.length);
    const luckyProduct = availableProducts[randomIndex];

    if (!luckyProduct.onSale) {
      luckyProduct.applyDiscount(
        DISCOUNT_POLICIES.LIGHTNING_SALE.DISCOUNT_RATE
      );
      luckyProduct.onSale = true;
      return luckyProduct;
    }

    return null;
  }

  // 추천 할인 적용
  applySuggestedSale() {
    if (!this.lastSelectedProductId) return null;

    const availableProducts = this.getAvailableProducts();
    const suggestProduct = availableProducts.find(
      (product) =>
        product.id !== this.lastSelectedProductId && !product.suggestSale
    );

    if (suggestProduct) {
      suggestProduct.applyDiscount(
        DISCOUNT_POLICIES.SUGGESTED_SALE.DISCOUNT_RATE
      );
      suggestProduct.suggestSale = true;
      return suggestProduct;
    }

    return null;
  }

  // 할인 상태 업데이트
  updateSaleStatus() {
    this.products.forEach((product) => {
      if (product.onSale && product.suggestSale) {
        // 번개세일 + 추천할인이 모두 적용된 경우
        const combinedDiscount =
          DISCOUNT_POLICIES.LIGHTNING_SALE.DISCOUNT_RATE +
          DISCOUNT_POLICIES.SUGGESTED_SALE.DISCOUNT_RATE;
        product.applyDiscount(combinedDiscount);
      }
    });
  }

  // 상품 가격 업데이트 (할인 적용 후)
  updateProductPrices() {
    this.products.forEach((product) => {
      if (product.onSale && product.suggestSale) {
        // 25% 할인 (번개세일 20% + 추천할인 5%)
        product.price = Math.round((product.originalPrice * 75) / 100);
      } else if (product.onSale) {
        // 번개세일 20% 할인
        product.price = Math.round((product.originalPrice * 80) / 100);
      } else if (product.suggestSale) {
        // 추천할인 5% 할인
        product.price = Math.round((product.originalPrice * 95) / 100);
      } else {
        // 할인 없음
        product.price = product.originalPrice;
      }
    });
  }

  // 재고 정보 메시지 생성
  getStockInfoMessage() {
    const lowStockProducts = this.getLowStockProducts();
    const outOfStockProducts = this.getOutOfStockProducts();

    let message = "";

    lowStockProducts.forEach((product) => {
      message += `${product.name}: 재고 부족 (${product.stock}개 남음)\n`;
    });

    outOfStockProducts.forEach((product) => {
      message += `${product.name}: 품절\n`;
    });

    return message;
  }

  // 상품 옵션 텍스트 생성
  getProductOptionText(product) {
    let text = product.name;
    let className = "";

    if (product.isOutOfStock()) {
      text += ` - ${product.price}원 (품절)`;
      if (product.onSale) text += " ⚡SALE";
      if (product.suggestSale) text += " 💝추천";
      className = "text-gray-400";
    } else {
      if (product.onSale && product.suggestSale) {
        text = `⚡💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (25% SUPER SALE!)`;
        className = "text-purple-600 font-bold";
      } else if (product.onSale) {
        text = `⚡${product.name} - ${product.originalPrice}원 → ${product.price}원 (20% SALE!)`;
        className = "text-red-500 font-bold";
      } else if (product.suggestSale) {
        text = `💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (5% 추천할인!)`;
        className = "text-blue-500 font-bold";
      } else {
        text += ` - ${product.price}원`;
        if (product.onSale) text += " ⚡SALE";
        if (product.suggestSale) text += " 💝추천";
      }
    }

    return { text, className };
  }
}
