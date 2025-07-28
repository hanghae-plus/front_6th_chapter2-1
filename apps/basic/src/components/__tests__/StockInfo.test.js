/**
 * @fileoverview StockInfo 컴포넌트 단위 테스트
 * Vitest 및 Given-When-Then 구조를 사용한 테스트
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { StockInfo } from '../StockInfo.js';

describe('StockInfo 컴포넌트', () => {
  let mockProducts;

  beforeEach(() => {
    // Given: 기본 테스트 데이터 설정
    mockProducts = [
      { id: 'p1', name: '정상 상품', q: 50 },
      { id: 'p2', name: '재고 부족 상품', q: 3 },
      { id: 'p3', name: '품절 상품', q: 0 },
      { id: 'p4', name: '또 다른 정상 상품', q: 20 },
      { id: 'p5', name: '또 다른 재고 부족 상품', q: 2 }
    ];
  });

  describe('render() 메서드', () => {
    it('정상적인 상품 데이터로 완전한 재고 정보를 렌더링해야 한다', () => {
      // Given: 완전한 상품 데이터

      // When: render 메서드 호출
      const result = StockInfo.render(mockProducts);

      // Then: 올바른 재고 정보 구조가 생성되어야 함
      expect(result).toContain('stock-info-container');
      expect(result).toContain('stock-summary');
      expect(result).toContain('stock-list');
      expect(result).toContain('재고 부족 상품');
      expect(result).toContain('품절 상품');
    });

    it('빈 상품 배열에 대해 빈 상태 메시지를 표시해야 한다', () => {
      // Given: 빈 상품 배열

      // When: 빈 배열로 render 호출
      const result = StockInfo.render([]);

      // Then: 빈 상태 메시지가 표시되어야 함
      expect(result).toContain('stock-info-empty');
      expect(result).toContain('재고 정보 없음');
      expect(result).toContain('📦');
    });

    it('옵션을 통해 표시 내용을 제어할 수 있어야 한다', () => {
      // Given: 경고만 표시하는 옵션
      const options = {
        showWarningsOnly: true,
        showSummary: false,
        highlightCritical: true
      };

      // When: 옵션과 함께 render 호출
      const result = StockInfo.render(mockProducts, options);

      // Then: 옵션이 적용되어야 함
      expect(result).not.toContain('stock-summary');
      expect(result).toContain('stock-list');
      expect(result).toContain('재고 부족 상품');
      expect(result).toContain('품절 상품');
      expect(result).not.toContain('정상 상품'); // 경고가 아닌 상품은 표시 안 됨
    });
  });

  describe('analyzeStock() 메서드', () => {
    it('상품 재고를 올바르게 분석해야 한다', () => {
      // Given: 다양한 재고 상태의 상품들

      // When: 재고 분석
      const result = StockInfo.analyzeStock(mockProducts);

      // Then: 올바른 분석 결과가 나와야 함
      expect(result).toHaveProperty('products');
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('summary');

      expect(result.items).toHaveLength(5);
      expect(
        result.items.filter(item => item.urgencyLevel === 'critical')
      ).toHaveLength(1); // 품절
      expect(
        result.items.filter(item => item.urgencyLevel === 'warning')
      ).toHaveLength(2); // 재고 부족
      expect(
        result.items.filter(item => item.urgencyLevel === 'normal')
      ).toHaveLength(2); // 정상
    });

    it('빈 배열에 대해 안전하게 처리해야 한다', () => {
      // Given: 빈 상품 배열

      // When: 빈 배열 분석
      const result = StockInfo.analyzeStock([]);

      // Then: 기본값이 반환되어야 함
      expect(result.items).toEqual([]);
      expect(result.summary.totalProducts).toBe(0);
    });
  });

  describe('calculateSummary() 메서드', () => {
    it('재고 요약 정보를 정확히 계산해야 한다', () => {
      // Given: 분석된 아이템 데이터
      const items = [
        { urgencyLevel: 'normal' },
        { urgencyLevel: 'warning' },
        { urgencyLevel: 'warning' },
        { urgencyLevel: 'critical' },
        { urgencyLevel: 'normal' }
      ];

      // When: 요약 정보 계산
      const result = StockInfo.calculateSummary(mockProducts, items);

      // Then: 올바른 요약이 계산되어야 함
      expect(result.totalProducts).toBe(5);
      expect(result.warningCount).toBe(2);
      expect(result.criticalCount).toBe(1);
      expect(result.healthScore).toBe(40); // (2/5) * 100 = 40%
      expect(result.overallStatus).toBe('critical'); // criticalCount > 0
    });

    it('모든 상품이 정상일 때 건강한 상태로 표시해야 한다', () => {
      // Given: 모든 정상 상품들
      const healthyProducts = [
        { id: 'p1', name: '상품1', q: 50 },
        { id: 'p2', name: '상품2', q: 30 }
      ];
      const healthyItems = [
        { urgencyLevel: 'normal' },
        { urgencyLevel: 'normal' }
      ];

      // When: 요약 정보 계산
      const result = StockInfo.calculateSummary(healthyProducts, healthyItems);

      // Then: 건강한 상태여야 함
      expect(result.healthScore).toBe(100);
      expect(result.overallStatus).toBe('healthy');
      expect(result.warningCount).toBe(0);
      expect(result.criticalCount).toBe(0);
    });
  });

  describe('generateStockList() 메서드', () => {
    it('재고 아이템들을 올바른 HTML로 변환해야 한다', () => {
      // Given: 재고 아이템 데이터
      const items = [
        { productName: '정상 상품', quantity: 50, urgencyLevel: 'normal' },
        { productName: '재고 부족 상품', quantity: 3, urgencyLevel: 'warning' },
        { productName: '품절 상품', quantity: 0, urgencyLevel: 'critical' }
      ];

      // When: 재고 목록 생성
      const result = StockInfo.generateStockList(items);

      // Then: 올바른 HTML이 생성되어야 함
      expect(result).toContain('stock-list');
      expect(result).toContain('정상 상품');
      expect(result).toContain('재고 부족 상품');
      expect(result).toContain('품절 상품');
      expect(result).toContain('50개');
      expect(result).toContain('3개');
      expect(result).toContain('품절');
    });

    it('빈 아이템 배열에 대해 빈 메시지를 표시해야 한다', () => {
      // Given: 빈 아이템 배열

      // When: 빈 배열로 목록 생성
      const result = StockInfo.generateStockList([]);

      // Then: 빈 메시지가 표시되어야 함
      expect(result).toContain('stock-list-empty');
      expect(result).toContain('표시할 재고 정보가 없습니다');
    });
  });

  describe('generateStockItem() 메서드', () => {
    it('정상 재고 아이템을 올바르게 생성해야 한다', () => {
      // Given: 정상 재고 아이템
      const item = {
        productName: '정상 상품',
        quantity: 50,
        urgencyLevel: 'normal'
      };

      // When: 아이템 생성
      const result = StockInfo.generateStockItem(item);

      // Then: 정상 스타일이 적용되어야 함
      expect(result).toContain('stock-item');
      expect(result).toContain('정상 상품');
      expect(result).toContain('50개');
      expect(result).toContain('✅');
      expect(result).toContain('text-gray-600');
    });

    it('재고 부족 아이템을 경고 스타일로 생성해야 한다', () => {
      // Given: 재고 부족 아이템
      const item = {
        productName: '재고 부족 상품',
        quantity: 3,
        urgencyLevel: 'warning'
      };

      // When: 아이템 생성
      const result = StockInfo.generateStockItem(item);

      // Then: 경고 스타일이 적용되어야 함
      expect(result).toContain('재고 부족 상품');
      expect(result).toContain('3개');
      expect(result).toContain('⚠️');
      expect(result).toContain('text-orange-600');
    });

    it('품절 아이템을 위험 스타일로 생성해야 한다', () => {
      // Given: 품절 아이템
      const item = {
        productName: '품절 상품',
        quantity: 0,
        urgencyLevel: 'critical'
      };
      const options = { highlightCritical: true };

      // When: 아이템 생성
      const result = StockInfo.generateStockItem(item, options);

      // Then: 위험 스타일과 강조가 적용되어야 함
      expect(result).toContain('품절 상품');
      expect(result).toContain('품절');
      expect(result).toContain('🚨');
      expect(result).toContain('text-red-600');
      expect(result).toContain('bg-red-50'); // 강조 배경
    });
  });

  describe('generateStockSummary() 메서드', () => {
    it('건강한 상태의 요약을 올바르게 생성해야 한다', () => {
      // Given: 건강한 상태 요약
      const summary = {
        totalProducts: 5,
        warningCount: 0,
        criticalCount: 0,
        healthScore: 100,
        overallStatus: 'healthy'
      };

      // When: 요약 생성
      const result = StockInfo.generateStockSummary(summary);

      // Then: 건강한 상태 표시가 나와야 함
      expect(result).toContain('stock-summary');
      expect(result).toContain('bg-green-50');
      expect(result).toContain('✅');
      expect(result).toContain('재고 상태 양호');
      expect(result).toContain('100%');
      expect(result).toContain('bg-green-500'); // 건강한 게이지 바
      expect(result).toContain('width: 100%');
    });

    it('위험 상태의 요약을 올바르게 생성해야 한다', () => {
      // Given: 위험 상태 요약
      const summary = {
        totalProducts: 5,
        warningCount: 1,
        criticalCount: 2,
        healthScore: 40,
        overallStatus: 'critical'
      };

      // When: 요약 생성
      const result = StockInfo.generateStockSummary(summary);

      // Then: 위험 상태 표시가 나와야 함
      expect(result).toContain('bg-red-50');
      expect(result).toContain('🚨');
      expect(result).toContain('긴급 재고 보충 필요');
      expect(result).toContain('40%');
      expect(result).toContain('bg-red-500'); // 위험 게이지 바
      expect(result).toContain('🚨 2개'); // 위험 상품 수
      expect(result).toContain('⚠️ 1개'); // 경고 상품 수
    });
  });

  describe('generateSimpleStockText() 메서드', () => {
    it('기존 StockCalculator와 호환되는 텍스트를 생성해야 한다', () => {
      // Given: 재고 부족과 품절이 있는 상품들

      // When: 간단한 재고 텍스트 생성
      const result = StockInfo.generateSimpleStockText(mockProducts);

      // Then: StockCalculator 스타일의 텍스트가 나와야 함
      expect(typeof result).toBe('string');
      expect(result).toContain('재고 부족 상품');
      expect(result).toContain('품절 상품');
    });

    it('정상 상품만 있을 때 빈 문자열을 반환해야 한다', () => {
      // Given: 모든 정상 재고 상품들
      const healthyProducts = [
        { id: 'p1', name: '상품1', q: 50 },
        { id: 'p2', name: '상품2', q: 30 }
      ];

      // When: 간단한 재고 텍스트 생성
      const result = StockInfo.generateSimpleStockText(healthyProducts);

      // Then: 빈 문자열이 반환되어야 함
      expect(result).toBe('');
    });

    it('잘못된 입력에 대해 안전하게 처리해야 한다', () => {
      // Given: 잘못된 입력들

      // When & Then: 에러 없이 처리되어야 함
      expect(StockInfo.generateSimpleStockText(null)).toBe('');
      expect(StockInfo.generateSimpleStockText(undefined)).toBe('');
      expect(StockInfo.generateSimpleStockText('invalid')).toBe('');
    });
  });

  describe('updateStockInfoElement() 메서드', () => {
    it('DOM 요소의 텍스트를 올바르게 업데이트해야 한다', () => {
      // Given: 모의 DOM 요소
      const mockElement = {
        textContent: ''
      };

      // When: DOM 요소 업데이트
      StockInfo.updateStockInfoElement(mockProducts, mockElement);

      // Then: 텍스트가 업데이트되어야 함
      expect(mockElement.textContent).toContain('재고 부족 상품');
      expect(mockElement.textContent).toContain('품절 상품');
    });

    it('DOM 요소가 없을 때 에러 없이 처리해야 한다', () => {
      // Given: null DOM 요소

      // When & Then: 에러 없이 처리되어야 함
      expect(() => {
        StockInfo.updateStockInfoElement(mockProducts, null);
      }).not.toThrow();
    });
  });

  describe('통합 시나리오 테스트', () => {
    it('전체 재고 분석부터 렌더링까지 완전히 동작해야 한다', () => {
      // Given: 복잡한 재고 상황
      const complexProducts = [
        { id: 'p1', name: '키보드', q: 100 },
        { id: 'p2', name: '마우스', q: 4 },
        { id: 'p3', name: '모니터', q: 0 },
        { id: 'p4', name: '스피커', q: 1 },
        { id: 'p5', name: '헤드폰', q: 25 }
      ];

      // When: 전체 렌더링
      const result = StockInfo.render(complexProducts, {
        showSummary: true,
        showStockLevels: true,
        highlightCritical: true
      });

      // Then: 모든 요소가 올바르게 포함되어야 함
      expect(result).toContain('stock-info-container');
      expect(result).toContain('stock-summary');
      expect(result).toContain('stock-list');

      // 재고 상태별 정보 확인
      expect(result).toContain('키보드'); // 정상
      expect(result).toContain('마우스'); // 재고 부족
      expect(result).toContain('모니터'); // 품절
      expect(result).toContain('스피커'); // 재고 부족
      expect(result).toContain('헤드폰'); // 정상

      // 아이콘 확인
      expect(result).toContain('✅'); // 정상 아이콘
      expect(result).toContain('⚠️'); // 경고 아이콘
      expect(result).toContain('🚨'); // 위험 아이콘
    });
  });
});
