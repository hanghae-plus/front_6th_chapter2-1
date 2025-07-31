import { DiscountStore } from "../store/discountStore.js";
import { DISCOUNT_RATES, QUANTITY_THRESHOLDS } from "../constants/index.js";
import { findProductById, calculateItemDiscount } from "../utils/productUtils.js";
import { calcTotalDiscount } from "../utils/discountUtils.js";

export class DiscountService {
  constructor() {
    this.discountStore = new DiscountStore();
  }

  // 장바구니 아이템에서 수량을 추출합니다.
  // DOM 요소와 데이터 객체를 구분하여 처리합니다.
  extractQuantity(cartItem) {
    if (cartItem.querySelector) {
      // DOM 요소인 경우
      const quantityElement = cartItem.querySelector(".quantity-number");
      return parseInt(quantityElement.textContent) || 0;
    } else {
      // 데이터 객체인 경우
      return cartItem.quantity || 1;
    }
  }

  // 개별 상품 할인을 계산합니다.
  calculateIndividualDiscounts(cartItems, productList) {
    const individualDiscounts = [];

    cartItems.forEach(cartItem => {
      const product = findProductById(cartItem.id, productList);
      if (!product) return;

      // 수량 추출 (타입 체크 로직 분리)
      const quantity = this.extractQuantity(cartItem);
      const discountRate = calculateItemDiscount(cartItem.id, quantity);

      if (discountRate > 0) {
        individualDiscounts.push({
          productId: cartItem.id,
          productName: product.name,
          quantity,
          rate: discountRate,
          amount: product.price * quantity * discountRate,
        });
      }
    });

    this.discountStore.setState({ individualDiscounts });
    return individualDiscounts;
  }

  // 대량구매 할인을 계산합니다.
  calculateBulkDiscount(totalQuantity) {
    let bulkDiscountRate = 0;
    let bulkDiscountApplied = false;

    if (totalQuantity >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
      bulkDiscountRate = DISCOUNT_RATES.BULK_PURCHASE;
      bulkDiscountApplied = true;
    }

    this.discountStore.setState({ bulkDiscountRate, bulkDiscountApplied });
    return { rate: bulkDiscountRate, applied: bulkDiscountApplied };
  }

  // 화요일 특별 할인을 계산합니다.
  calculateTuesdayDiscount() {
    const today = new Date().getDay();
    const isTuesday = today === 2;
    const tuesdayDiscountRate = isTuesday ? DISCOUNT_RATES.TUESDAY_SPECIAL : 0;
    const tuesdayDiscountApplied = isTuesday;

    this.discountStore.setState({ tuesdayDiscountRate, tuesdayDiscountApplied });
    return { rate: tuesdayDiscountRate, applied: tuesdayDiscountApplied };
  }

  // 모든 할인을 적용하여 최종 금액을 계산합니다.
  applyAllDiscounts(cartItems, productList) {
    // 1. 개별 상품 할인 계산
    const itemCalculations = cartItems
      .map(cartItem => {
        const currentItem = findProductById(cartItem.id, productList);
        if (!currentItem) return null;

        const quantity = this.extractQuantity(cartItem);
        const itemTotal = currentItem.price * quantity;
        const discountRate = calculateItemDiscount(currentItem.id, quantity);

        return {
          itemTotal,
          quantity,
          discountRate,
          productName: currentItem.name,
          hasDiscount: discountRate > 0,
        };
      })
      .filter(Boolean);

    // 2. 총계 계산
    const subtotal = itemCalculations.reduce((sum, calc) => sum + calc.itemTotal, 0);
    const itemCount = itemCalculations.reduce((sum, calc) => sum + calc.quantity, 0);
    const itemDiscounts = itemCalculations.filter(calc => calc.hasDiscount).map(calc => ({ name: calc.productName, discount: calc.discountRate * 100 }));

    // 3. 개별 할인 적용된 총액 계산
    let totalAmount = itemCalculations.reduce((sum, calc) => {
      return sum + calc.itemTotal * (1 - calc.discountRate);
    }, 0);

    // 4. 대량구매 할인 적용
    const originalTotal = subtotal;
    let bulkDiscountRate = 0;
    let bulkDiscountApplied = false;

    if (itemCount >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
      bulkDiscountRate = DISCOUNT_RATES.BULK_PURCHASE;
      bulkDiscountApplied = true;
      totalAmount = subtotal * bulkDiscountRate;
    }

    // 5. 화요일 할인 적용
    const today = new Date();
    const isTuesday = today.getDay() === 2;
    let tuesdayDiscountRate = 0;
    let tuesdayDiscountApplied = false;

    if (isTuesday && totalAmount > 0) {
      tuesdayDiscountRate = DISCOUNT_RATES.TUESDAY_SPECIAL;
      tuesdayDiscountApplied = true;
      totalAmount = totalAmount * tuesdayDiscountRate;
    }

    // 6. 할인 집계 유틸 함수로 집계
    const { totalDiscountRate, discountTypes, hasAnyDiscount } = calcTotalDiscount(itemDiscounts, bulkDiscountRate, bulkDiscountApplied, tuesdayDiscountRate, tuesdayDiscountApplied);

    // 7. 불변성을 유지하며 상태 업데이트
    this.discountStore.setState({
      individualDiscounts: itemDiscounts,
      bulkDiscountRate,
      bulkDiscountApplied,
      tuesdayDiscountRate,
      tuesdayDiscountApplied,
      totalDiscountRate,
      totalSavedAmount: originalTotal - totalAmount,
      hasAnyDiscount,
      discountTypes,
    });

    return {
      originalAmount: subtotal,
      finalAmount: totalAmount,
      savedAmount: originalTotal - totalAmount,
      individualDiscounts: itemDiscounts,
      bulkDiscount: {
        rate: bulkDiscountRate,
        applied: bulkDiscountApplied,
      },
      tuesdayDiscount: {
        rate: tuesdayDiscountRate,
        applied: tuesdayDiscountApplied,
      },
    };
  }

  // 할인 적용 전 장바구니 상품들의 총 금액을 계산합니다.
  // 각 상품의 (가격 × 수량)을 모두 더한 소계(Subtotal)를 반환합니다.
  calculateSubtotal(cartItems, productList) {
    return cartItems.reduce((sum, cartItem) => {
      const product = findProductById(cartItem.id, productList);
      if (!product) return sum;

      // 수량 추출
      const quantity = this.extractQuantity(cartItem);

      return sum + product.price * quantity;
    }, 0);
  }

  // 상품의 할인율을 계산합니다.
  calculateProductDiscountRate(product) {
    if (!product) return 0;

    const originalPrice = product.originalPrice || product.price;
    const currentPrice = product.price;

    if (originalPrice === currentPrice) return 0;

    return (originalPrice - currentPrice) / originalPrice;
  }

  // 상품의 할인 상태를 확인합니다.
  getProductDiscountStatus(product) {
    if (!product) return null;

    const discountRate = this.calculateProductDiscountRate(product);

    if (discountRate === 0) return null;

    if (product.onSale && product.suggestSale) {
      return "SUPER SALE";
    } else if (product.onSale) {
      return "SALE";
    } else if (product.suggestSale) {
      return "추천할인";
    }

    return "할인";
  }

  // 할인 상태를 구독합니다.
  subscribeToChanges(callback) {
    return this.discountStore.subscribe(callback);
  }

  // 현재 할인 상태를 반환합니다.
  getDiscountState() {
    return this.discountStore.getState();
  }

  // 할인을 초기화합니다.
  resetDiscounts() {
    this.discountStore.setState({
      individualDiscounts: [],
      bulkDiscountRate: 0,
      bulkDiscountApplied: false,
      tuesdayDiscountRate: 0,
      tuesdayDiscountApplied: false,
      totalDiscountRate: 0,
      totalSavedAmount: 0,
      hasAnyDiscount: false,
      discountTypes: [],
    });
  }

  // 현재 할인 상태가 적용된 상품 목록을 반환합니다.
  getProductsWithCurrentDiscounts(products) {
    return products.map(product => {
      const discountRate = this.calculateProductDiscountRate(product);
      const discountStatus = this.getProductDiscountStatus(product);

      // 원본 가격 정보 보존
      const originalPrice = product.originalPrice || product.price;

      return {
        ...product,
        originalPrice,
        price: product.price, // 현재 할인된 가격
        discountRate,
        discountStatus,
      };
    });
  }
}
