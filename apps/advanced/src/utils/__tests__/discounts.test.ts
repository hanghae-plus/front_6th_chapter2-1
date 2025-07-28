/**
 * 할인 관련 유틸리티 함수 테스트
 */

import { describe, expect, it } from "vitest";
import { DiscountPolicy } from "../../types/promotion.types";
import {
  calculateBulkDiscount,
  calculateFinalDiscount,
  calculateIndividualDiscount,
  calculateTotalDiscount,
  calculateTuesdayDiscount,
  formatDiscountForUI,
  getProductDiscountRate,
} from "../discounts";

describe("Discount Utils", () => {
  describe("getProductDiscountRate", () => {
    it("should return correct discount rate for valid product", () => {
      const rate = getProductDiscountRate("p1");
      expect(rate).toBe(0.1); // 키보드 할인율
    });

    it("should return 0 for invalid product", () => {
      const rate = getProductDiscountRate("invalid-id");
      expect(rate).toBe(0);
    });
  });

  describe("calculateIndividualDiscount", () => {
    it("should return discount rate when quantity meets threshold", () => {
      const discount = calculateIndividualDiscount("p1", 10);
      expect(discount).toBe(0.1);
    });

    it("should return 0 when quantity is below threshold", () => {
      const discount = calculateIndividualDiscount("p1", 5);
      expect(discount).toBe(0);
    });
  });

  describe("calculateBulkDiscount", () => {
    it("should return bulk discount rate when quantity meets threshold", () => {
      const discount = calculateBulkDiscount(30);
      expect(discount).toBe(0.25);
    });

    it("should return 0 when quantity is below threshold", () => {
      const discount = calculateBulkDiscount(20);
      expect(discount).toBe(0);
    });
  });

  describe("calculateTuesdayDiscount", () => {
    it("should return Tuesday discount rate on Tuesday", () => {
      const tuesday = new Date("2024-01-02"); // 화요일
      const discount = calculateTuesdayDiscount(tuesday);
      expect(discount).toBe(0.1);
    });

    it("should return 0 on non-Tuesday", () => {
      const monday = new Date("2024-01-01"); // 월요일
      const discount = calculateTuesdayDiscount(monday);
      expect(discount).toBe(0);
    });
  });

  describe("calculateFinalDiscount", () => {
    it("should calculate bulk discount when quantity is sufficient", () => {
      const discountInfo = calculateFinalDiscount({
        productId: "p1",
        quantity: 5,
        totalQuantity: 30,
        date: new Date("2024-01-01"), // 월요일
      });

      expect(discountInfo.rate).toBe(0.25);
      expect(discountInfo.type).toBe("bulk");
      expect(discountInfo.description).toBe("대량구매 할인 (30개 이상)");
    });

    it("should calculate individual discount when quantity is sufficient", () => {
      const discountInfo = calculateFinalDiscount({
        productId: "p1",
        quantity: 10,
        totalQuantity: 15,
        date: new Date("2024-01-01"), // 월요일
      });

      expect(discountInfo.rate).toBe(0.1);
      expect(discountInfo.type).toBe("individual");
    });

    it("should apply Tuesday discount on Tuesday", () => {
      const discountInfo = calculateFinalDiscount({
        productId: "p1",
        quantity: 5,
        totalQuantity: 15,
        date: new Date("2024-01-02"), // 화요일
      });

      expect(discountInfo.tuesdayDiscount).toBe(0.1);
      expect(discountInfo.isSpecial).toBe(true);
    });
  });

  describe("formatDiscountForUI", () => {
    it("should format discount info for UI display", () => {
      const discountInfo = {
        rate: 0.15,
        type: "individual",
        description: "키보드 개별 할인",
        baseDiscount: 0.1,
        tuesdayDiscount: 0.05,
        isBulkOverride: false,
      };

      const uiInfo = formatDiscountForUI(discountInfo);

      expect(uiInfo.percentage).toBe(15);
      expect(uiInfo.displayText).toBe("키보드 개별 할인");
      expect(uiInfo.type).toBe("individual");
      expect(uiInfo.isSpecial).toBe(true);
    });
  });

  describe("calculateTotalDiscount", () => {
    it("should calculate total discount from multiple policies", () => {
      const policies: DiscountPolicy[] = [
        {
          id: "test1",
          type: "percentage",
          value: 10,
          minAmount: 0,
          description: "Test discount 1",
        },
        {
          id: "test2",
          type: "fixed",
          value: 1000,
          minAmount: 0,
          description: "Test discount 2",
        },
      ];

      const totalDiscount = calculateTotalDiscount(10000, policies);
      expect(totalDiscount).toBe(2000); // 10% + 1000원
    });

    it("should respect minimum amount requirement", () => {
      const policies: DiscountPolicy[] = [
        {
          id: "test",
          type: "percentage",
          value: 10,
          minAmount: 20000,
          description: "Test discount",
        },
      ];

      const totalDiscount = calculateTotalDiscount(10000, policies);
      expect(totalDiscount).toBe(0);
    });

    it("should respect maximum discount limit", () => {
      const policies: DiscountPolicy[] = [
        {
          id: "test",
          type: "percentage",
          value: 50,
          minAmount: 0,
          maxDiscount: 1000,
          description: "Test discount",
        },
      ];

      const totalDiscount = calculateTotalDiscount(10000, policies);
      expect(totalDiscount).toBe(1000); // Capped at 1000
    });
  });
});
