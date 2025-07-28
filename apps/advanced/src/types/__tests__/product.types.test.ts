/**
 * Product 타입 테스트
 */

import { describe, expect, it } from "vitest";
import { PRODUCTS } from "../../constants/products";

describe("Product Types", () => {
  it("should have valid product structure", () => {
    PRODUCTS.forEach((product) => {
      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("name");
      expect(product).toHaveProperty("price");
      expect(product).toHaveProperty("stock");
      expect(product).toHaveProperty("category");
    });
  });

  it("should have unique product IDs", () => {
    const ids = PRODUCTS.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it("should have valid price values", () => {
    PRODUCTS.forEach((product) => {
      expect(product.price).toBeGreaterThan(0);
      expect(typeof product.price).toBe("number");
    });
  });

  it("should have valid stock values", () => {
    PRODUCTS.forEach((product) => {
      expect(product.stock).toBeGreaterThanOrEqual(0);
      expect(typeof product.stock).toBe("number");
    });
  });

  it("should have valid category values", () => {
    PRODUCTS.forEach((product) => {
      expect(product.category).toBeTruthy();
      expect(typeof product.category).toBe("string");
    });
  });

  it("should have valid discount rate values", () => {
    PRODUCTS.forEach((product) => {
      if (product.discountRate !== undefined) {
        expect(product.discountRate).toBeGreaterThanOrEqual(0);
        expect(product.discountRate).toBeLessThanOrEqual(1);
      }
    });
  });

  it("should have valid discount threshold values", () => {
    PRODUCTS.forEach((product) => {
      if (product.discountThreshold !== undefined) {
        expect(product.discountThreshold).toBeGreaterThan(0);
        expect(typeof product.discountThreshold).toBe("number");
      }
    });
  });
});
