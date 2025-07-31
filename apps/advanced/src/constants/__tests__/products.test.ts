/**
 * Products 상수 테스트
 */

import { describe, expect, it } from "vitest";
import {
  DISCOUNT_THRESHOLDS,
  PRODUCTS,
  PRODUCT_IDS,
  getAvailableProducts,
  getProductById,
  getProductList,
  getProductsByCategory,
} from "../products";

describe("Products Constants", () => {
  describe("PRODUCT_IDS", () => {
    it("should have all required product IDs", () => {
      expect(PRODUCT_IDS.KEYBOARD).toBe("p1");
      expect(PRODUCT_IDS.MOUSE).toBe("p2");
      expect(PRODUCT_IDS.MONITOR_ARM).toBe("p3");
      expect(PRODUCT_IDS.LAPTOP_POUCH).toBe("p4");
      expect(PRODUCT_IDS.LOFI_SPEAKER).toBe("p5");
    });
  });

  describe("DISCOUNT_THRESHOLDS", () => {
    it("should have valid threshold values", () => {
      expect(DISCOUNT_THRESHOLDS.INDIVIDUAL_DISCOUNT_MIN).toBe(10);
      expect(DISCOUNT_THRESHOLDS.BULK_DISCOUNT_MIN).toBe(30);
    });
  });

  describe("PRODUCTS", () => {
    it("should have correct number of products", () => {
      expect(PRODUCTS).toHaveLength(5);
    });

    it("should have valid product data", () => {
      PRODUCTS.forEach((product) => {
        expect(product.id).toBeTruthy();
        expect(product.name).toBeTruthy();
        expect(product.price).toBeGreaterThan(0);
        expect(product.stock).toBeGreaterThanOrEqual(0);
        expect(product.category).toBeTruthy();
      });
    });

    it("should have correct product IDs", () => {
      const expectedIds = Object.values(PRODUCT_IDS);
      const actualIds = PRODUCTS.map((p) => p.id);
      expect(actualIds).toEqual(expectedIds);
    });

    it("should have valid categories", () => {
      const categories = PRODUCTS.map((p) => p.category);
      expect(categories).toContain("electronics");
      expect(categories).toContain("accessories");
    });
  });

  describe("getProductList", () => {
    it("should return all products", () => {
      const productList = getProductList();
      expect(productList).toEqual(PRODUCTS);
    });
  });

  describe("getProductById", () => {
    it("should return correct product for valid ID", () => {
      const keyboard = getProductById("p1");
      expect(keyboard).toBeDefined();
      expect(keyboard?.name).toBe("버그 없애는 키보드");
    });

    it("should return undefined for invalid ID", () => {
      const invalidProduct = getProductById("invalid-id");
      expect(invalidProduct).toBeUndefined();
    });
  });

  describe("getProductsByCategory", () => {
    it("should return electronics products", () => {
      const electronics = getProductsByCategory("electronics");
      expect(electronics).toHaveLength(3);
      electronics.forEach((product) => {
        expect(product.category).toBe("electronics");
      });
    });

    it("should return accessories products", () => {
      const accessories = getProductsByCategory("accessories");
      expect(accessories).toHaveLength(2);
      accessories.forEach((product) => {
        expect(product.category).toBe("accessories");
      });
    });

    it("should return empty array for non-existent category", () => {
      const nonExistent = getProductsByCategory("non-existent");
      expect(nonExistent).toHaveLength(0);
    });
  });

  describe("getAvailableProducts", () => {
    it("should return only products with stock > 0", () => {
      const available = getAvailableProducts();
      available.forEach((product) => {
        expect(product.stock).toBeGreaterThan(0);
      });
    });

    it("should exclude out-of-stock products", () => {
      const available = getAvailableProducts();
      const outOfStock = available.find((p) => p.id === "p4"); // LAPTOP_POUCH
      expect(outOfStock).toBeUndefined();
    });
  });
});
