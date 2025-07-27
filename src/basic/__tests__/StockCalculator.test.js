/**
 * StockCalculator 단위 테스트
 * 모든 재고 관리 로직의 정확성을 검증합니다.
 */

import { describe, expect, it } from 'vitest';
import { STOCK_STATUS, StockCalculator } from '../calculations/StockCalculator.js';

describe('StockCalculator', () => {
  // 테스트용 상품 데이터
  const mockProducts = [
    { id: 'p1', name: '무선 키보드', q: 15, val: 100000 }, // 정상 재고
    { id: 'p2', name: '무선 마우스', q: 3, val: 50000 }, // 재고 부족
    { id: 'p3', name: '모니터암', q: 0, val: 80000 }, // 품절
    { id: 'p4', name: '헤드폰', q: 1, val: 200000 }, // 위험 수준
    { id: 'p5', name: '웹캠', q: 10, val: 70000 }, // 정상 재고
  ];

  describe('checkStockAvailability', () => {
    it('재고가 충분한 경우 구매 가능', () => {
      const result = StockCalculator.checkStockAvailability('p1', 5, mockProducts);

      expect(result.available).toBe(true);
      expect(result.maxQuantity).toBe(15);
      expect(result.status).toBe(STOCK_STATUS.IN_STOCK);
      expect(result.message).toContain('구매 가능');
    });

    it('재고가 부족한 경우 대안 수량 제안', () => {
      const result = StockCalculator.checkStockAvailability('p2', 5, mockProducts);

      expect(result.available).toBe(false);
      expect(result.maxQuantity).toBe(3);
      expect(result.status).toBe(STOCK_STATUS.LOW_STOCK);
      expect(result.message).toContain('최대 3개까지 구매 가능');
    });

    it('품절 상품은 구매 불가', () => {
      const result = StockCalculator.checkStockAvailability('p3', 1, mockProducts);

      expect(result.available).toBe(false);
      expect(result.maxQuantity).toBe(0);
      expect(result.status).toBe(STOCK_STATUS.OUT_OF_STOCK);
      expect(result.message).toContain('품절된 상품');
    });

    it('존재하지 않는 상품 ID', () => {
      const result = StockCalculator.checkStockAvailability('invalid', 1, mockProducts);

      expect(result.available).toBe(false);
      expect(result.message).toContain('상품을 찾을 수 없습니다');
    });
  });

  describe('getStockStatus', () => {
    it('정상 재고 상태 (5개 이상)', () => {
      const result = StockCalculator.getStockStatus(mockProducts[0]); // 15개

      expect(result.status).toBe(STOCK_STATUS.IN_STOCK);
      expect(result.quantity).toBe(15);
      expect(result.message).toContain('정상 재고');
    });

    it('재고 부족 상태 (1-4개)', () => {
      const result = StockCalculator.getStockStatus(mockProducts[1]); // 3개

      expect(result.status).toBe(STOCK_STATUS.LOW_STOCK);
      expect(result.quantity).toBe(3);
      expect(result.message).toContain('재고 부족');
    });

    it('품절 상태 (0개)', () => {
      const result = StockCalculator.getStockStatus(mockProducts[2]); // 0개

      expect(result.status).toBe(STOCK_STATUS.OUT_OF_STOCK);
      expect(result.quantity).toBe(0);
      expect(result.message).toContain('품절');
    });
  });

  describe('isLowStock', () => {
    it('정상 재고 (기본 임계값 5개 이상)', () => {
      const result = StockCalculator.isLowStock(10);

      expect(result.isLow).toBe(false);
      expect(result.remaining).toBe(10);
      expect(result.level).toBe('normal');
    });

    it('재고 부족 (5개 미만)', () => {
      const result = StockCalculator.isLowStock(3);

      expect(result.isLow).toBe(true);
      expect(result.remaining).toBe(3);
      expect(result.level).toBe('low');
    });

    it('위험 수준 (1개 이하)', () => {
      const result = StockCalculator.isLowStock(1);

      expect(result.isLow).toBe(true);
      expect(result.remaining).toBe(1);
      expect(result.level).toBe('critical');
    });

    it('품절 (0개)', () => {
      const result = StockCalculator.isLowStock(0);

      expect(result.isLow).toBe(true);
      expect(result.remaining).toBe(0);
      expect(result.level).toBe('out_of_stock');
    });

    it('사용자 정의 임계값', () => {
      const result = StockCalculator.isLowStock(7, 10); // 임계값 10

      expect(result.isLow).toBe(true);
      expect(result.level).toBe('low');
    });
  });

  describe('getStockSummary', () => {
    it('전체 재고 통계 계산', () => {
      const result = StockCalculator.getStockSummary(mockProducts);

      expect(result.totalStock).toBe(29); // 15+3+0+1+10
      expect(result.inStock).toBe(2); // p1, p5
      expect(result.lowStock).toBe(2); // p2, p4
      expect(result.outOfStock).toBe(1); // p3
      expect(result.totalProducts).toBe(5);
      expect(result.criticalLevel).toBe(true); // 29 < 30
    });

    it('빈 상품 목록', () => {
      const result = StockCalculator.getStockSummary([]);

      expect(result.totalStock).toBe(0);
      expect(result.totalProducts).toBe(0);
      expect(result.criticalLevel).toBe(true);
    });

    it('재고가 충분한 경우 (30개 이상)', () => {
      const richProducts = [
        { id: 'p1', name: '상품1', q: 20, val: 100000 },
        { id: 'p2', name: '상품2', q: 15, val: 50000 },
      ];

      const result = StockCalculator.getStockSummary(richProducts);

      expect(result.totalStock).toBe(35);
      expect(result.criticalLevel).toBe(false); // 35 >= 30
    });
  });

  describe('generateStockWarnings', () => {
    it('재고 부족 상품들의 경고 메시지 생성', () => {
      const result = StockCalculator.generateStockWarnings(mockProducts);

      expect(result.warnings).toHaveLength(3); // p2, p3, p4
      expect(result.warningCount).toBe(3);

      // 품절 상품 확인
      const outOfStockWarning = result.warnings.find(w => w.productName === '모니터암');
      expect(outOfStockWarning.status).toBe(STOCK_STATUS.OUT_OF_STOCK);
      expect(outOfStockWarning.message).toContain('품절');

      // 재고 부족 상품 확인
      const lowStockWarning = result.warnings.find(w => w.productName === '무선 마우스');
      expect(lowStockWarning.status).toBe(STOCK_STATUS.LOW_STOCK);
      expect(lowStockWarning.message).toContain('재고 부족 (3개 남음)');

      // 요약 메시지 확인
      expect(result.summary).toContain('무선 마우스: 재고 부족');
      expect(result.summary).toContain('모니터암: 품절');
    });

    it('모든 재고가 정상인 경우', () => {
      const normalProducts = [
        { id: 'p1', name: '상품1', q: 10, val: 100000 },
        { id: 'p2', name: '상품2', q: 15, val: 50000 },
      ];

      const result = StockCalculator.generateStockWarnings(normalProducts);

      expect(result.warnings).toHaveLength(0);
      expect(result.warningCount).toBe(0);
      expect(result.summary).toBe('');
    });
  });

  describe('updateStock', () => {
    it('정상적인 재고 업데이트', () => {
      const result = StockCalculator.updateStock('p1', 5, mockProducts);

      expect(result.success).toBe(true);
      expect(result.newStock).toBe(10); // 15 - 5
      expect(result.error).toBeUndefined();
    });

    it('재고 부족으로 업데이트 실패', () => {
      const result = StockCalculator.updateStock('p2', 5, mockProducts);

      expect(result.success).toBe(false);
      expect(result.newStock).toBe(3); // 현재 재고 유지
      expect(result.error).toContain('재고 부족');
    });

    it('품절 상품 업데이트 시도', () => {
      const result = StockCalculator.updateStock('p3', 1, mockProducts);

      expect(result.success).toBe(false);
      expect(result.newStock).toBe(0);
      expect(result.error).toContain('재고 부족');
    });

    it('존재하지 않는 상품', () => {
      const result = StockCalculator.updateStock('invalid', 1, mockProducts);

      expect(result.success).toBe(false);
      expect(result.error).toContain('상품을 찾을 수 없습니다');
    });

    it('유효하지 않은 수량', () => {
      const result = StockCalculator.updateStock('p1', 0, mockProducts);

      expect(result.success).toBe(false);
      expect(result.error).toContain('유효하지 않은 업데이트 요청');
    });
  });
});
