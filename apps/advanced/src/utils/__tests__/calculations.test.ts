/**
 * 계산 유틸리티 함수 테스트
 */

import { describe, expect, it } from 'vitest';
import { CartItem } from '../../types/cart.types';
import { Product } from '../../types/product.types';
import {
  calculateCartTotals,
  calculateDiscount,
  calculateFinalAmount,
  calculateItemDiscount,
  calculateItemPoints,
  calculateItemSubtotal,
  calculatePoints,
  calculateShippingCost,
  calculateTax
} from '../calculations';

describe('Calculation Utils', () => {
  const mockProduct: Product = {
    id: 'p1',
    name: 'Test Product',
    price: 10000,
    stock: 10,
    category: 'electronics',
    description: 'Test product'
  };

  const mockCartItem: CartItem = {
    product: mockProduct,
    quantity: 2,
    subtotal: 20000,
    discount: 10,
    points: 20
  };

  describe('calculateItemSubtotal', () => {
    it('should calculate correct subtotal', () => {
      const subtotal = calculateItemSubtotal(mockCartItem);
      expect(subtotal).toBe(20000);
    });

    it('should handle zero quantity', () => {
      const itemWithZeroQuantity = { ...mockCartItem, quantity: 0 };
      const subtotal = calculateItemSubtotal(itemWithZeroQuantity);
      expect(subtotal).toBe(0);
    });
  });

  describe('calculateItemDiscount', () => {
    it('should calculate correct discount amount', () => {
      const discount = calculateItemDiscount(mockCartItem);
      expect(discount).toBe(2000); // 10% of 20000
    });

    it('should handle zero discount rate', () => {
      const itemWithZeroDiscount = { ...mockCartItem, discount: 0 };
      const discount = calculateItemDiscount(itemWithZeroDiscount);
      expect(discount).toBe(0);
    });
  });

  describe('calculateItemPoints', () => {
    it('should calculate correct points', () => {
      const points = calculateItemPoints(mockCartItem);
      expect(points).toBe(20); // 0.1% of 20000
    });

    it('should handle zero quantity', () => {
      const itemWithZeroQuantity = { ...mockCartItem, quantity: 0 };
      const points = calculateItemPoints(itemWithZeroQuantity);
      expect(points).toBe(0);
    });
  });

  describe('calculateCartTotals', () => {
    it('should calculate correct cart totals', () => {
      const items: CartItem[] = [
        mockCartItem,
        {
          ...mockCartItem,
          product: { ...mockProduct, id: 'p2', price: 5000 },
          quantity: 1,
          discount: 5,
          points: 5
        }
      ];

      const totals = calculateCartTotals(items);
      expect(totals.subtotal).toBe(25000);
      expect(totals.discount).toBe(2250); // 2000 + 250 (5% of 5000)
      expect(totals.total).toBe(22750);
      expect(totals.points).toBe(25); // 20 + 5
      expect(totals.itemCount).toBe(3);
    });

    it('should handle empty cart', () => {
      const totals = calculateCartTotals([]);
      expect(totals.subtotal).toBe(0);
      expect(totals.discount).toBe(0);
      expect(totals.total).toBe(0);
      expect(totals.points).toBe(0);
      expect(totals.itemCount).toBe(0);
    });
  });

  describe('calculateDiscount', () => {
    it('should calculate correct discount for percentage policy', () => {
      const policies = [
        {
          id: 'test',
          type: 'percentage' as const,
          value: 10,
          minAmount: 0,
          description: 'Test discount'
        }
      ];

      const discount = calculateDiscount(10000, policies);
      expect(discount).toBe(1000); // 10% of 10000
    });

    it('should calculate correct discount for fixed policy', () => {
      const policies = [
        {
          id: 'test',
          type: 'fixed' as const,
          value: 1000,
          minAmount: 0,
          description: 'Test discount'
        }
      ];

      const discount = calculateDiscount(10000, policies);
      expect(discount).toBe(1000);
    });

    it('should respect minimum amount requirement', () => {
      const policies = [
        {
          id: 'test',
          type: 'percentage' as const,
          value: 10,
          minAmount: 20000,
          description: 'Test discount'
        }
      ];

      const discount = calculateDiscount(10000, policies);
      expect(discount).toBe(0);
    });

    it('should respect maximum discount limit', () => {
      const policies = [
        {
          id: 'test',
          type: 'percentage' as const,
          value: 50,
          minAmount: 0,
          maxDiscount: 1000,
          description: 'Test discount'
        }
      ];

      const discount = calculateDiscount(10000, policies);
      expect(discount).toBe(1000); // Capped at 1000
    });
  });

  describe('calculatePoints', () => {
    it('should calculate correct points', () => {
      const policies = [
        {
          id: 'test',
          earnRate: 0.001,
          minPurchase: 0,
          description: 'Test points'
        }
      ];

      const points = calculatePoints(10000, policies);
      expect(points).toBe(10); // 0.1% of 10000
    });

    it('should respect minimum purchase requirement', () => {
      const policies = [
        {
          id: 'test',
          earnRate: 0.001,
          minPurchase: 20000,
          description: 'Test points'
        }
      ];

      const points = calculatePoints(10000, policies);
      expect(points).toBe(0);
    });

    it('should respect maximum points limit', () => {
      const policies = [
        {
          id: 'test',
          earnRate: 0.1,
          minPurchase: 0,
          maxPoints: 100,
          description: 'Test points'
        }
      ];

      const points = calculatePoints(10000, policies);
      expect(points).toBe(100); // Capped at 100
    });
  });

  describe('calculateTax', () => {
    it('should calculate correct tax', () => {
      const tax = calculateTax(10000, 0.1);
      expect(tax).toBe(1000); // 10% of 10000
    });

    it('should use default tax rate', () => {
      const tax = calculateTax(10000);
      expect(tax).toBe(1000); // Default 10%
    });
  });

  describe('calculateShippingCost', () => {
    it('should return zero for free shipping threshold', () => {
      const shipping = calculateShippingCost(60000, 50000, 3000);
      expect(shipping).toBe(0);
    });

    it('should return shipping cost for below threshold', () => {
      const shipping = calculateShippingCost(30000, 50000, 3000);
      expect(shipping).toBe(3000);
    });

    it('should use default values', () => {
      const shipping = calculateShippingCost(30000);
      expect(shipping).toBe(3000);
    });
  });

  describe('calculateFinalAmount', () => {
    it('should calculate correct final amount', () => {
      const finalAmount = calculateFinalAmount(10000, 1000, 500, 300);
      expect(finalAmount).toBe(9800); // 10000 - 1000 + 500 + 300
    });

    it('should handle zero values', () => {
      const finalAmount = calculateFinalAmount(10000);
      expect(finalAmount).toBe(10000);
    });
  });
});
