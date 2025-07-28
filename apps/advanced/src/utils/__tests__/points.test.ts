/**
 * 포인트 관련 유틸리티 함수 테스트
 */

import { describe, expect, it } from "vitest";
import { PointsPolicy } from "../../types/promotion.types";
import {
  calculateBasePoints,
  calculateBulkBonus,
  calculateSetBonus,
  calculateTotalPoints,
  calculateTotalPointsEarned,
  calculateTuesdayPoints,
  formatPointsMessage,
} from "../points";

describe("Points Utils", () => {
  describe("calculateBasePoints", () => {
    it("should calculate correct base points", () => {
      const points = calculateBasePoints(10000);
      expect(points).toBe(10); // 0.1% of 10000
    });

    it("should handle zero amount", () => {
      const points = calculateBasePoints(0);
      expect(points).toBe(0);
    });
  });

  describe("calculateTuesdayPoints", () => {
    it("should double points on Tuesday", () => {
      const tuesday = new Date("2024-01-02"); // 화요일
      const points = calculateTuesdayPoints(10, tuesday);
      expect(points).toBe(20); // 2배
    });

    it("should return original points on non-Tuesday", () => {
      const monday = new Date("2024-01-01"); // 월요일
      const points = calculateTuesdayPoints(10, monday);
      expect(points).toBe(10);
    });
  });

  describe("calculateSetBonus", () => {
    it("should return full set bonus when all items are present", () => {
      const cartItems = [
        { id: "p1", q: 1 }, // 키보드
        { id: "p2", q: 1 }, // 마우스
        { id: "p3", q: 1 }, // 모니터암
      ];

      const bonus = calculateSetBonus(cartItems);

      expect(bonus.points).toBe(100);
      expect(bonus.type).toBe("FULL_SET");
      expect(bonus.description).toBe("풀세트 구매 +100p");
    });

    it("should return keyboard-mouse set bonus when keyboard and mouse are present", () => {
      const cartItems = [
        { id: "p1", q: 1 }, // 키보드
        { id: "p2", q: 1 }, // 마우스
      ];

      const bonus = calculateSetBonus(cartItems);

      expect(bonus.points).toBe(50);
      expect(bonus.type).toBe("KEYBOARD_MOUSE_SET");
      expect(bonus.description).toBe("키보드+마우스 세트 +50p");
    });

    it("should return no bonus when no set is complete", () => {
      const cartItems = [
        { id: "p1", q: 1 }, // 키보드만
      ];

      const bonus = calculateSetBonus(cartItems);

      expect(bonus.points).toBe(0);
      expect(bonus.type).toBe("NONE");
      expect(bonus.description).toBe("");
    });
  });

  describe("calculateBulkBonus", () => {
    it("should return level 3 bonus for 30+ items", () => {
      const bonus = calculateBulkBonus(30);

      expect(bonus.points).toBe(100);
      expect(bonus.threshold).toBe(30);
      expect(bonus.description).toBe("대량구매(30개+) +100p");
    });

    it("should return level 2 bonus for 20+ items", () => {
      const bonus = calculateBulkBonus(25);

      expect(bonus.points).toBe(50);
      expect(bonus.threshold).toBe(20);
      expect(bonus.description).toBe("대량구매(20개+) +50p");
    });

    it("should return level 1 bonus for 10+ items", () => {
      const bonus = calculateBulkBonus(15);

      expect(bonus.points).toBe(20);
      expect(bonus.threshold).toBe(10);
      expect(bonus.description).toBe("대량구매(10개+) +20p");
    });

    it("should return no bonus for less than 10 items", () => {
      const bonus = calculateBulkBonus(5);

      expect(bonus.points).toBe(0);
      expect(bonus.threshold).toBe(0);
      expect(bonus.description).toBe("");
    });
  });

  describe("calculateTotalPoints", () => {
    it("should calculate total points with all bonuses", () => {
      const cartItems = [
        { id: "p1", q: 1 }, // 키보드
        { id: "p2", q: 1 }, // 마우스
        { id: "p3", q: 1 }, // 모니터암
      ];

      const result = calculateTotalPoints(
        10000,
        cartItems,
        30,
        new Date("2024-01-02"),
      ); // 화요일

      expect(result.basePoints).toBe(10);
      expect(result.finalPoints).toBeGreaterThan(10); // 기본 + 보너스들
      expect(result.details).toContain("화요일 2배");
      expect(result.details).toContain("풀세트 구매 +100p");
      expect(result.details).toContain("대량구매(30개+) +100p");
    });

    it("should calculate points without Tuesday bonus on non-Tuesday", () => {
      const cartItems = [{ id: "p1", q: 1 }];

      const result = calculateTotalPoints(
        10000,
        cartItems,
        5,
        new Date("2024-01-01"),
      ); // 월요일

      expect(result.basePoints).toBe(10);
      expect(result.finalPoints).toBe(10); // 기본만
      expect(result.details).toContain("기본: 10p");
    });
  });

  describe("formatPointsMessage", () => {
    it("should format message with values", () => {
      const template = "대량구매({threshold}개+) +{points}p";
      const values = { threshold: 30, points: 100 };

      const message = formatPointsMessage(template, values);

      expect(message).toBe("대량구매(30개+) +100p");
    });

    it("should handle multiple replacements", () => {
      const template = "기본: {points}p + 보너스: {bonus}p";
      const values = { points: 10, bonus: 50 };

      const message = formatPointsMessage(template, values);

      expect(message).toBe("기본: 10p + 보너스: 50p");
    });
  });

  describe("calculateTotalPointsEarned", () => {
    it("should calculate total points from multiple policies", () => {
      const policies: PointsPolicy[] = [
        {
          id: "base",
          earnRate: 0.001,
          minPurchase: 0,
          description: "Base points",
        },
        {
          id: "bonus",
          earnRate: 0.002,
          minPurchase: 10000,
          description: "Bonus points",
        },
      ];

      const totalPoints = calculateTotalPointsEarned(20000, policies);

      expect(totalPoints).toBe(60); // 20 + 40
    });

    it("should respect minimum purchase requirement", () => {
      const policies: PointsPolicy[] = [
        {
          id: "bonus",
          earnRate: 0.002,
          minPurchase: 20000,
          description: "Bonus points",
        },
      ];

      const totalPoints = calculateTotalPointsEarned(10000, policies);

      expect(totalPoints).toBe(0);
    });

    it("should respect maximum points limit", () => {
      const policies: PointsPolicy[] = [
        {
          id: "bonus",
          earnRate: 0.1,
          minPurchase: 0,
          maxPoints: 100,
          description: "Bonus points",
        },
      ];

      const totalPoints = calculateTotalPointsEarned(10000, policies);

      expect(totalPoints).toBe(100); // Capped at 100
    });
  });
});
