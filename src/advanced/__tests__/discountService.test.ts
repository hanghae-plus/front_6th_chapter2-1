import { describe, expect, it, vi, beforeEach } from "vitest";
import { calculateIndividualDiscount, calculateBulkDiscount, calculateTuesdayDiscount, calculateTotalDiscount, calculateFinalPrice, type DiscountInfo } from "../services/discountService";
import { DISCOUNT_RATES, PRODUCT_IDS } from "../constants";
import type { Cart } from "../types";

describe("discountService", () => {
  const createMockCartItem = (quantity: number, productId: string = PRODUCT_IDS.KEYBOARD): Cart => {
    const productMap = {
      [PRODUCT_IDS.KEYBOARD]: {
        id: PRODUCT_IDS.KEYBOARD,
        name: "버그 없애는 키보드",
        price: 10000,
        originalPrice: 10000,
        quantity: 50,
        onSale: false,
        suggestSale: false,
      },
      [PRODUCT_IDS.MOUSE]: {
        id: PRODUCT_IDS.MOUSE,
        name: "생산성 폭발 마우스",
        price: 20000,
        originalPrice: 20000,
        quantity: 30,
        onSale: false,
        suggestSale: false,
      },
    };

    return {
      id: productId,
      quantity,
      product: productMap[productId as keyof typeof productMap],
    };
  };

  describe("calculateIndividualDiscount", () => {
    it("수량이 10개 미만일 때 할인이 적용되지 않아야 한다", () => {
      const cartItem = createMockCartItem(5);
      const discount = calculateIndividualDiscount(cartItem);
      expect(discount).toBe(0);
    });

    it("수량이 10개 이상일 때 개별 상품 할인이 적용되어야 한다", () => {
      const cartItem = createMockCartItem(15);
      const discount = calculateIndividualDiscount(cartItem);
      expect(discount).toBe(DISCOUNT_RATES.INDIVIDUAL[PRODUCT_IDS.KEYBOARD]);
    });

    it("다른 상품의 개별 할인율이 올바르게 적용되어야 한다", () => {
      const mouseCartItem = createMockCartItem(12, PRODUCT_IDS.MOUSE);
      const discount = calculateIndividualDiscount(mouseCartItem);
      expect(discount).toBe(DISCOUNT_RATES.INDIVIDUAL[PRODUCT_IDS.MOUSE]);
    });
  });

  describe("calculateBulkDiscount", () => {
    it("총 수량이 30개 미만일 때 대량구매 할인이 적용되지 않아야 한다", () => {
      const discount = calculateBulkDiscount(25);
      expect(discount).toBe(0);
    });

    it("총 수량이 30개 이상일 때 대량구매 할인이 적용되어야 한다", () => {
      const discount = calculateBulkDiscount(35);
      expect(discount).toBe(DISCOUNT_RATES.BULK_DISCOUNT);
    });

    it("정확히 30개일 때 대량구매 할인이 적용되어야 한다", () => {
      const discount = calculateBulkDiscount(30);
      expect(discount).toBe(DISCOUNT_RATES.BULK_DISCOUNT);
    });
  });

  describe("calculateTuesdayDiscount", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("화요일이 아닐 때 false를 반환해야 한다", () => {
      // 월요일로 설정
      vi.setSystemTime(new Date("2024-01-01"));
      const isTuesday = calculateTuesdayDiscount();
      expect(isTuesday).toBe(false);
    });

    it("화요일일 때 true를 반환해야 한다", () => {
      // 화요일로 설정
      vi.setSystemTime(new Date("2024-01-02"));
      const isTuesday = calculateTuesdayDiscount();
      expect(isTuesday).toBe(true);
    });
  });

  describe("calculateTotalDiscount", () => {
    it("30개 미만 구매 시 개별 상품 할인만 적용되어야 한다", () => {
      const cartItems = [createMockCartItem(12, PRODUCT_IDS.KEYBOARD), createMockCartItem(15, PRODUCT_IDS.MOUSE)];
      const subtotal = 420000; // 12 * 10000 + 15 * 20000

      const discounts = calculateTotalDiscount(cartItems, subtotal);

      // 개별 상품 할인만 있어야 함
      const individualDiscounts = discounts.filter(d => d.type === "individual");
      const bulkDiscounts = discounts.filter(d => d.type === "bulk");

      expect(individualDiscounts).toHaveLength(2);
      expect(bulkDiscounts).toHaveLength(0);

      // 키보드 할인 확인 (10% * 12개 * 10000원 = 12000원)
      const keyboardDiscount = individualDiscounts.find(d => d.description.includes("키보드"));
      expect(keyboardDiscount?.savedAmount).toBe(12000);

      // 마우스 할인 확인 (15% * 15개 * 20000원 = 45000원)
      const mouseDiscount = individualDiscounts.find(d => d.description.includes("마우스"));
      expect(mouseDiscount?.savedAmount).toBe(45000);
    });

    it("30개 이상 구매 시 대량구매 할인만 적용되어야 한다", () => {
      const cartItems = [createMockCartItem(20, PRODUCT_IDS.KEYBOARD), createMockCartItem(15, PRODUCT_IDS.MOUSE)];
      const subtotal = 500000; // 20 * 10000 + 15 * 20000

      const discounts = calculateTotalDiscount(cartItems, subtotal);

      // 대량구매 할인만 있어야 함
      const individualDiscounts = discounts.filter(d => d.type === "individual");
      const bulkDiscounts = discounts.filter(d => d.type === "bulk");

      expect(individualDiscounts).toHaveLength(0);
      expect(bulkDiscounts).toHaveLength(1);

      // 대량구매 할인 확인 (25% * 500000원 = 125000원)
      const bulkDiscount = bulkDiscounts[0];
      expect(bulkDiscount.savedAmount).toBe(125000);
      expect(bulkDiscount.percentage).toBe(DISCOUNT_RATES.BULK_DISCOUNT);
    });

    it("화요일에는 추가 할인이 적용되어야 한다", () => {
      vi.setSystemTime(new Date("2024-01-02")); // 화요일

      const cartItems = [createMockCartItem(5, PRODUCT_IDS.KEYBOARD)];
      const subtotal = 50000;

      const discounts = calculateTotalDiscount(cartItems, subtotal);

      const tuesdayDiscounts = discounts.filter(d => d.type === "tuesday");
      expect(tuesdayDiscounts).toHaveLength(1);

      const tuesdayDiscount = tuesdayDiscounts[0];
      expect(tuesdayDiscount.percentage).toBe(DISCOUNT_RATES.TUESDAY_DISCOUNT);
      expect(tuesdayDiscount.savedAmount).toBe(5000); // 10% * 50000원
    });

    it("30개 이상 구매 시 대량구매 할인과 화요일 할인이 모두 적용되어야 한다", () => {
      vi.setSystemTime(new Date("2024-01-02")); // 화요일

      const cartItems = [createMockCartItem(20, PRODUCT_IDS.KEYBOARD), createMockCartItem(15, PRODUCT_IDS.MOUSE)];
      const subtotal = 500000;

      const discounts = calculateTotalDiscount(cartItems, subtotal);

      const bulkDiscounts = discounts.filter(d => d.type === "bulk");
      const tuesdayDiscounts = discounts.filter(d => d.type === "tuesday");
      const individualDiscounts = discounts.filter(d => d.type === "individual");

      expect(bulkDiscounts).toHaveLength(1);
      expect(tuesdayDiscounts).toHaveLength(1);
      expect(individualDiscounts).toHaveLength(0);

      // 대량구매 할인: 25% * 500000 = 125000원
      expect(bulkDiscounts[0].savedAmount).toBe(125000);
      // 화요일 할인: 10% * 500000 = 50000원
      expect(tuesdayDiscounts[0].savedAmount).toBe(50000);
    });

    it("할인이 적용되지 않는 경우 빈 배열을 반환해야 한다", () => {
      // 화요일이 아닌 날로 설정
      vi.setSystemTime(new Date("2024-01-01")); // 월요일

      const cartItems = [createMockCartItem(5, PRODUCT_IDS.KEYBOARD)];
      const subtotal = 50000;

      const discounts = calculateTotalDiscount(cartItems, subtotal);

      expect(discounts).toHaveLength(0);
    });
  });

  describe("calculateFinalPrice", () => {
    it("할인이 없을 때 원가가 그대로 반환되어야 한다", () => {
      const subtotal = 100000;
      const discounts: DiscountInfo[] = [];

      const finalPrice = calculateFinalPrice(subtotal, discounts);
      expect(finalPrice).toBe(subtotal);
    });

    it("단일 할인이 올바르게 적용되어야 한다", () => {
      const subtotal = 100000;
      const discounts: DiscountInfo[] = [
        {
          type: "bulk",
          percentage: 25,
          description: "대량구매 할인",
          savedAmount: 25000,
        },
      ];

      const finalPrice = calculateFinalPrice(subtotal, discounts);
      expect(finalPrice).toBe(75000); // 100000 * (1 - 25/100)
    });

    it("여러 할인이 누적되어 적용되어야 한다", () => {
      const subtotal = 100000;
      const discounts: DiscountInfo[] = [
        {
          type: "bulk",
          percentage: 25,
          description: "대량구매 할인",
          savedAmount: 25000,
        },
        {
          type: "tuesday",
          percentage: 10,
          description: "화요일 할인",
          savedAmount: 10000,
        },
      ];

      const finalPrice = calculateFinalPrice(subtotal, discounts);
      expect(finalPrice).toBe(65000); // 100000 * (1 - (25+10)/100)
    });
  });

  describe("할인 우선순위 테스트", () => {
    it("대량구매 할인이 개별 상품 할인보다 우선되어야 한다", () => {
      const cartItems = [
        createMockCartItem(15, PRODUCT_IDS.KEYBOARD), // 10개 이상으로 개별 할인 대상
        createMockCartItem(20, PRODUCT_IDS.MOUSE), // 10개 이상으로 개별 할인 대상
      ];
      const subtotal = 450000; // 총 35개로 대량구매 할인 대상

      const discounts = calculateTotalDiscount(cartItems, subtotal);

      // 대량구매 할인만 적용되어야 함
      const bulkDiscounts = discounts.filter(d => d.type === "bulk");
      const individualDiscounts = discounts.filter(d => d.type === "individual");

      expect(bulkDiscounts).toHaveLength(1);
      expect(individualDiscounts).toHaveLength(0);

      // 대량구매 할인 금액 확인
      expect(bulkDiscounts[0].savedAmount).toBe(112500); // 25% * 450000
    });

    it("30개 미만일 때는 개별 상품 할인이 적용되어야 한다", () => {
      const cartItems = [createMockCartItem(12, PRODUCT_IDS.KEYBOARD), createMockCartItem(15, PRODUCT_IDS.MOUSE)];
      const subtotal = 420000; // 총 27개로 대량구매 할인 미대상

      const discounts = calculateTotalDiscount(cartItems, subtotal);

      // 개별 상품 할인만 적용되어야 함
      const bulkDiscounts = discounts.filter(d => d.type === "bulk");
      const individualDiscounts = discounts.filter(d => d.type === "individual");

      expect(bulkDiscounts).toHaveLength(0);
      expect(individualDiscounts).toHaveLength(2);

      // 키보드 할인 확인
      const keyboardDiscount = individualDiscounts.find(d => d.description.includes("키보드"));
      expect(keyboardDiscount?.savedAmount).toBe(12000); // 10% * 12 * 10000

      // 마우스 할인 확인
      const mouseDiscount = individualDiscounts.find(d => d.description.includes("마우스"));
      expect(mouseDiscount?.savedAmount).toBe(45000); // 15% * 15 * 20000
    });
  });
});
