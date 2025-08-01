import { DiscountStore } from "../store/discountStore.js";
import { DISCOUNT_RATES, QUANTITY_THRESHOLDS } from "../constants/index.js";
import { calculateItemDiscount } from "../utils/productUtils.js";
import { calcTotalDiscount } from "../utils/discountUtils.js";

// 할인 계산 헬퍼
const DiscountCalculationHelper = {
  // 장바구니 아이템에서 수량을 추출합니다.
  extractQuantity(cartItem) {
    if (cartItem.querySelector) {
      // DOM 요소인 경우
      const quantityElement = cartItem.querySelector(".quantity-number");
      return parseInt(quantityElement.textContent) || 0;
    } else {
      // 데이터 객체인 경우
      return cartItem.quantity || 1;
    }
  },

  // 개별 상품 할인 계산
  calculateItemDiscounts(cartItems, productList, extractQuantityFn) {
    return cartItems
      .map(cartItem => {
        const currentItem = productList.find(product => product.id === cartItem.id) || null;

        if (!currentItem) return null;

        const quantity = extractQuantityFn(cartItem);
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
  },

  // 총계 계산
  calculateTotals(itemCalculations) {
    const subtotal = itemCalculations.reduce((sum, calc) => sum + calc.itemTotal, 0);
    const itemCount = itemCalculations.reduce((sum, calc) => sum + calc.quantity, 0);
    const itemDiscounts = itemCalculations.filter(calc => calc.hasDiscount).map(calc => ({ name: calc.productName, discount: calc.discountRate * 100 }));

    return { subtotal, itemCount, itemDiscounts };
  },

  // 개별 할인 적용된 총액 계산
  applyIndividualDiscounts(itemCalculations) {
    return itemCalculations.reduce((sum, calc) => {
      return sum + calc.itemTotal * (1 - calc.discountRate);
    }, 0);
  },

  // 대량구매 할인 적용
  applyBulkDiscount(itemCount, totalAmount, subtotal) {
    let bulkDiscountRate = 0;
    let bulkDiscountApplied = false;
    let discountedAmount = totalAmount;

    if (itemCount >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
      bulkDiscountRate = DISCOUNT_RATES.BULK_PURCHASE;
      bulkDiscountApplied = true;
      discountedAmount = subtotal * bulkDiscountRate;
    }

    return {
      bulkDiscountRate,
      bulkDiscountApplied,
      discountedAmount,
    };
  },

  // 화요일 할인 적용
  applyTuesdayDiscount(totalAmount) {
    const today = new Date();
    const isTuesday = today.getDay() === 2;
    let tuesdayDiscountRate = 0;
    let tuesdayDiscountApplied = false;
    let discountedAmount = totalAmount;

    if (isTuesday && totalAmount > 0) {
      tuesdayDiscountRate = DISCOUNT_RATES.TUESDAY_SPECIAL;
      tuesdayDiscountApplied = true;
      discountedAmount = totalAmount * tuesdayDiscountRate;
    }

    return {
      tuesdayDiscountRate,
      tuesdayDiscountApplied,
      discountedAmount,
    };
  },
};

// 상품 할인 상태 헬퍼
const ProductDiscountHelper = {
  // 상품의 할인율을 계산합니다.
  calculateProductDiscountRate(product) {
    if (!product) return 0;

    const originalPrice = product.originalPrice || product.price;
    const currentPrice = product.price;

    if (originalPrice === currentPrice) return 0;

    return (originalPrice - currentPrice) / originalPrice;
  },

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
  },

  // 할인 상태가 적용된 상품 목록을 반환합니다.
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
  },
};

// 할인 결과 생성 헬퍼
const DiscountResultHelper = {
  // 할인 결과 객체 생성
  createDiscountResult(originalAmount, finalAmount, individualDiscounts, bulkDiscount, tuesdayDiscount) {
    return {
      originalAmount,
      finalAmount,
      savedAmount: originalAmount - finalAmount,
      individualDiscounts,
      bulkDiscount,
      tuesdayDiscount,
    };
  },

  // 할인 상태 객체 생성
  createDiscountState(itemDiscounts, bulkDiscount, tuesdayDiscount, originalTotal, totalAmount) {
    const { totalDiscountRate, discountTypes, hasAnyDiscount } = calcTotalDiscount(itemDiscounts, bulkDiscount.rate, bulkDiscount.applied, tuesdayDiscount.rate, tuesdayDiscount.applied);

    return {
      individualDiscounts: itemDiscounts,
      bulkDiscountRate: bulkDiscount.rate,
      bulkDiscountApplied: bulkDiscount.applied,
      tuesdayDiscountRate: tuesdayDiscount.rate,
      tuesdayDiscountApplied: tuesdayDiscount.applied,
      totalDiscountRate,
      totalSavedAmount: originalTotal - totalAmount,
      hasAnyDiscount,
      discountTypes,
    };
  },
};

export class DiscountService {
  constructor() {
    this.discountStore = new DiscountStore();
  }

  // 헬퍼 객체들에 대한 접근자
  getCalculationHelper() {
    return DiscountCalculationHelper;
  }

  getProductHelper() {
    return ProductDiscountHelper;
  }

  getResultHelper() {
    return DiscountResultHelper;
  }

  // 장바구니 아이템에서 수량을 추출합니다.
  // DOM 요소와 데이터 객체를 구분하여 처리합니다.
  extractQuantity(cartItem) {
    return DiscountCalculationHelper.extractQuantity(cartItem);
  }

  // 모든 할인을 적용하여 최종 금액을 계산합니다.
  applyAllDiscounts(cartItems, productList) {
    const calcHelper = this.getCalculationHelper();

    // 1. 개별 상품 할인 계산
    const itemCalculations = calcHelper.calculateItemDiscounts(cartItems, productList, DiscountCalculationHelper.extractQuantity);

    // 2. 총계 계산
    const { subtotal, itemCount, itemDiscounts } = calcHelper.calculateTotals(itemCalculations);

    // 3. 개별 할인 적용된 총액 계산
    let totalAmount = calcHelper.applyIndividualDiscounts(itemCalculations);

    // 4. 대량구매 할인 적용
    const originalTotal = subtotal;
    const bulkDiscount = calcHelper.applyBulkDiscount(itemCount, totalAmount, subtotal);
    totalAmount = bulkDiscount.discountedAmount;

    // 5. 화요일 할인 적용
    const tuesdayDiscount = calcHelper.applyTuesdayDiscount(totalAmount);
    totalAmount = tuesdayDiscount.discountedAmount;

    // 7. 불변성을 유지하며 상태 업데이트
    const discountState = this.getResultHelper().createDiscountState(
      itemDiscounts,
      {
        rate: bulkDiscount.bulkDiscountRate,
        applied: bulkDiscount.bulkDiscountApplied,
      },
      {
        rate: tuesdayDiscount.tuesdayDiscountRate,
        applied: tuesdayDiscount.tuesdayDiscountApplied,
      },
      originalTotal,
      totalAmount
    );
    this.discountStore.setState(discountState);

    return this.getResultHelper().createDiscountResult(
      subtotal,
      totalAmount,
      itemDiscounts,
      {
        rate: bulkDiscount.bulkDiscountRate,
        applied: bulkDiscount.bulkDiscountApplied,
      },
      {
        rate: tuesdayDiscount.tuesdayDiscountRate,
        applied: tuesdayDiscount.tuesdayDiscountApplied,
      }
    );
  }

  // 상품의 할인율을 계산합니다.
  calculateProductDiscountRate(product) {
    return this.getProductHelper().calculateProductDiscountRate(product);
  }

  // 상품의 할인 상태를 확인합니다.
  getProductDiscountStatus(product) {
    return this.getProductHelper().getProductDiscountStatus(product);
  }

  // 현재 할인 상태를 반환합니다.
  getDiscountState() {
    return this.discountStore.getState();
  }

  // 현재 할인 상태가 적용된 상품 목록을 반환합니다.
  getProductsWithCurrentDiscounts(products) {
    return this.getProductHelper().getProductsWithCurrentDiscounts(products);
  }
}
