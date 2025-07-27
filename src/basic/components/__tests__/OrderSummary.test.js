/**
 * @fileoverview OrderSummary 컴포넌트 단위 테스트
 * Vitest 및 Given-When-Then 구조를 사용한 테스트
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { OrderSummary } from '../OrderSummary.js';

describe('OrderSummary 컴포넌트', () => {
  let mockOrderData;
  let mockPricingData;
  let mockPointsData;

  beforeEach(() => {
    // Given: 기본 테스트 데이터 설정
    mockPricingData = {
      subtotal: 300000,
      finalAmount: 240000,
      totalSavings: 60000,
      discountRate: 0.2,
      discounts: {
        individual: [{ productName: '무선 키보드', discountRate: 0.1 }],
        bulk: { discountRate: 0 },
        tuesday: { discountAmount: 10000 },
        special: [],
      },
    };

    mockPointsData = {
      total: 350,
      breakdown: {
        base: { points: 100 },
        tuesday: { points: 200 },
        setBonus: { points: 50 },
      },
      messages: ['기본: 100p', '화요일 2배', '키보드+마우스 세트 +50p'],
    };

    mockOrderData = {
      pricing: mockPricingData,
      points: mockPointsData,
      items: [
        {
          id: 'p1',
          name: '무선 키보드',
          quantity: 2,
          unitPrice: 100000,
          totalPrice: 200000,
        },
        {
          id: 'p2',
          name: '무선 마우스',
          quantity: 1,
          unitPrice: 50000,
          totalPrice: 50000,
        },
      ],
      context: {
        isTuesday: true,
        hasSpecialDiscounts: false,
        itemCount: 3,
      },
    };
  });

  describe('render() 메서드', () => {
    it('정상적인 주문 데이터로 완전한 요약을 렌더링해야 한다', () => {
      // Given: 완전한 주문 데이터

      // When: render 메서드 호출
      const result = OrderSummary.render(mockOrderData);

      // Then: 올바른 HTML 구조가 생성되어야 함
      expect(result).toContain('order-summary');
      expect(result).toContain('무선 키보드 x 2');
      expect(result).toContain('무선 마우스 x 1');
      expect(result).toContain('₩300,000'); // 소계
      expect(result).toContain('₩200,000'); // 키보드 총 가격
      expect(result).toContain('적립 포인트');
      expect(result).toContain('350p');
    });

    it('빈 장바구니일 때 빈 상태 메시지를 표시해야 한다', () => {
      // Given: 빈 장바구니 데이터
      const emptyOrderData = {
        ...mockOrderData,
        items: [],
      };

      // When: 빈 데이터로 render 호출
      const result = OrderSummary.render(emptyOrderData);

      // Then: 빈 상태 메시지가 표시되어야 함
      expect(result).toContain('order-summary-empty');
      expect(result).toContain('장바구니가 비어있습니다');
    });

    it('필수 데이터가 없으면 에러를 발생시켜야 한다', () => {
      // Given: 잘못된 데이터

      // When & Then: 에러 발생 확인
      expect(() => OrderSummary.render(null)).toThrow(
        'OrderSummary.render: orderData와 pricing 정보는 필수입니다.'
      );
      expect(() => OrderSummary.render({})).toThrow(
        'OrderSummary.render: orderData와 pricing 정보는 필수입니다.'
      );
    });

    it('옵션을 통해 섹션 표시를 제어할 수 있어야 한다', () => {
      // Given: 표시 옵션들
      const options = {
        showDetailedBreakdown: false,
        highlightSavings: false,
        showPointsPreview: false,
      };

      // When: 옵션과 함께 render 호출
      const result = OrderSummary.render(mockOrderData, options);

      // Then: 해당 섹션들이 숨겨져야 함
      expect(result).not.toContain('items-breakdown');
      expect(result).not.toContain('savings-info');
      expect(result).not.toContain('points-info');
    });
  });

  describe('generateItemsBreakdown() 메서드', () => {
    it('장바구니 아이템들의 상세 내역을 생성해야 한다', () => {
      // Given: 장바구니 아이템들
      const items = mockOrderData.items;

      // When: 아이템 내역 생성
      const result = OrderSummary.generateItemsBreakdown(items);

      // Then: 모든 아이템이 표시되어야 함
      expect(result).toContain('items-breakdown');
      expect(result).toContain('무선 키보드 x 2');
      expect(result).toContain('무선 마우스 x 1');
      expect(result).toContain('₩200,000');
      expect(result).toContain('₩50,000');
      expect(result).toContain('border-t border-white/10');
    });

    it('빈 아이템 배열에 대해 빈 문자열을 반환해야 한다', () => {
      // Given: 빈 아이템 배열
      const emptyItems = [];

      // When: 빈 배열로 내역 생성
      const result = OrderSummary.generateItemsBreakdown(emptyItems);

      // Then: 빈 문자열 반환
      expect(result).toBe('');
    });

    it('잘못된 입력에 대해 빈 문자열을 반환해야 한다', () => {
      // Given: 잘못된 입력

      // When: 잘못된 입력으로 내역 생성
      const result = OrderSummary.generateItemsBreakdown(null);

      // Then: 빈 문자열 반환
      expect(result).toBe('');
    });
  });

  describe('generatePricingDetails() 메서드', () => {
    it('가격 상세 정보를 올바르게 생성해야 한다', () => {
      // Given: 가격 정보
      const pricing = mockPricingData;

      // When: 가격 상세 정보 생성
      const result = OrderSummary.generatePricingDetails(pricing);

      // Then: 가격 정보가 포함되어야 함
      expect(result).toContain('pricing-details');
      expect(result).toContain('Subtotal');
      expect(result).toContain('₩300,000');
      expect(result).toContain('Shipping');
      expect(result).toContain('Free');
    });

    it('null 가격 정보에 대해 빈 문자열을 반환해야 한다', () => {
      // Given: null 가격 정보

      // When: null로 가격 정보 생성
      const result = OrderSummary.generatePricingDetails(null);

      // Then: 빈 문자열 반환
      expect(result).toBe('');
    });
  });

  describe('generateDiscountItems() 메서드', () => {
    it('개별 상품 할인을 올바르게 표시해야 한다', () => {
      // Given: 개별 할인이 있는 할인 정보
      const discounts = {
        individual: [
          { productName: '무선 키보드', discountRate: 0.1 },
          { productName: '헤드폰', discountRate: 0.15 },
        ],
        bulk: { discountRate: 0 },
        tuesday: { discountAmount: 0 },
        special: [],
      };

      // When: 할인 항목 생성
      const result = OrderSummary.generateDiscountItems(discounts);

      // Then: 개별 할인들이 표시되어야 함
      expect(result).toContain('무선 키보드 (10개↑)');
      expect(result).toContain('헤드폰 (10개↑)');
      expect(result).toContain('-10%');
      expect(result).toContain('-15%');
      expect(result).toContain('text-green-400');
    });

    it('대량 구매 할인을 올바르게 표시해야 한다', () => {
      // Given: 대량 구매 할인이 있는 할인 정보
      const discounts = {
        individual: [],
        bulk: { discountRate: 0.25 },
        tuesday: { discountAmount: 0 },
        special: [],
      };

      // When: 할인 항목 생성
      const result = OrderSummary.generateDiscountItems(discounts);

      // Then: 대량 구매 할인이 표시되어야 함
      expect(result).toContain('🎉 대량구매 할인 (30개 이상)');
      expect(result).toContain('-25%');
    });

    it('특별 할인들을 올바르게 표시해야 한다', () => {
      // Given: 특별 할인이 있는 할인 정보
      const discounts = {
        individual: [],
        bulk: { discountRate: 0 },
        tuesday: { discountAmount: 0 },
        special: [
          { type: 'flash', description: '헤드폰 번개세일', rate: 0.2 },
          { type: 'recommend', description: '마우스 추천할인', rate: 0.15 },
          { type: 'combo', description: '콤보 할인', rate: 0.3 },
        ],
      };

      // When: 할인 항목 생성
      const result = OrderSummary.generateDiscountItems(discounts);

      // Then: 특별 할인들이 올바른 아이콘과 색상으로 표시되어야 함
      expect(result).toContain('⚡ 헤드폰 번개세일');
      expect(result).toContain('💝 마우스 추천할인');
      expect(result).toContain('⚡💝 콤보 할인');
      expect(result).toContain('text-red-400');
      expect(result).toContain('text-blue-400');
      expect(result).toContain('text-purple-600');
      expect(result).toContain('-20%');
      expect(result).toContain('-15%');
      expect(result).toContain('-30%');
    });

    it('화요일 할인을 올바르게 표시해야 한다', () => {
      // Given: 화요일 할인이 있는 할인 정보
      const discounts = {
        individual: [],
        bulk: { discountRate: 0 },
        tuesday: { discountAmount: 10000 },
        special: [],
      };

      // When: 할인 항목 생성
      const result = OrderSummary.generateDiscountItems(discounts);

      // Then: 화요일 할인이 표시되어야 함
      expect(result).toContain('🌟 화요일 추가 할인');
      expect(result).toContain('-10%');
      expect(result).toContain('text-purple-400');
    });
  });

  describe('getDiscountStyle() 메서드', () => {
    it('할인 타입별로 올바른 스타일을 반환해야 한다', () => {
      // Given: 각각의 할인 타입들

      // When: 각 타입별 스타일 조회
      const flashStyle = OrderSummary.getDiscountStyle('flash');
      const recommendStyle = OrderSummary.getDiscountStyle('recommend');
      const comboStyle = OrderSummary.getDiscountStyle('combo');
      const unknownStyle = OrderSummary.getDiscountStyle('unknown');

      // Then: 각 타입에 맞는 스타일이 반환되어야 함
      expect(flashStyle).toEqual({ icon: '⚡', color: 'text-red-400' });
      expect(recommendStyle).toEqual({ icon: '💝', color: 'text-blue-400' });
      expect(comboStyle).toEqual({ icon: '⚡💝', color: 'text-purple-600' });
      expect(unknownStyle).toEqual({ icon: '🎁', color: 'text-purple-400' });
    });
  });

  describe('generateSavingsInfo() 메서드', () => {
    it('절약 정보를 올바르게 생성해야 한다', () => {
      // Given: 절약 금액이 있는 가격 정보
      const pricing = {
        totalSavings: 60000,
        discountRate: 0.2,
      };

      // When: 절약 정보 생성
      const result = OrderSummary.generateSavingsInfo(pricing);

      // Then: 절약 정보가 표시되어야 함
      expect(result).toContain('savings-info');
      expect(result).toContain('총 할인율');
      expect(result).toContain('20.0%');
      expect(result).toContain('₩60,000 할인되었습니다');
      expect(result).toContain('bg-green-500/20');
    });

    it('절약 금액이 0일 때 빈 문자열을 반환해야 한다', () => {
      // Given: 절약 금액이 0인 가격 정보
      const pricing = {
        totalSavings: 0,
        discountRate: 0,
      };

      // When: 절약 정보 생성
      const result = OrderSummary.generateSavingsInfo(pricing);

      // Then: 빈 문자열 반환
      expect(result).toBe('');
    });

    it('null 가격 정보에 대해 빈 문자열을 반환해야 한다', () => {
      // Given: null 가격 정보

      // When: null로 절약 정보 생성
      const result = OrderSummary.generateSavingsInfo(null);

      // Then: 빈 문자열 반환
      expect(result).toBe('');
    });
  });

  describe('generatePointsInfo() 메서드', () => {
    it('포인트 정보를 올바르게 생성해야 한다', () => {
      // Given: 포인트 정보
      const points = mockPointsData;

      // When: 포인트 정보 생성
      const result = OrderSummary.generatePointsInfo(points);

      // Then: 포인트 정보가 표시되어야 함
      expect(result).toContain('points-info');
      expect(result).toContain('적립 포인트');
      expect(result).toContain('350p');
      expect(result).toContain('기본: 100p, 화요일 2배, 키보드+마우스 세트 +50p');
    });

    it('포인트가 0일 때 빈 문자열을 반환해야 한다', () => {
      // Given: 포인트가 0인 정보
      const points = { total: 0, messages: [] };

      // When: 포인트 정보 생성
      const result = OrderSummary.generatePointsInfo(points);

      // Then: 빈 문자열 반환
      expect(result).toBe('');
    });

    it('null 포인트 정보에 대해 빈 문자열을 반환해야 한다', () => {
      // Given: null 포인트 정보

      // When: null로 포인트 정보 생성
      const result = OrderSummary.generatePointsInfo(null);

      // Then: 빈 문자열 반환
      expect(result).toBe('');
    });
  });

  describe('generateTuesdayBanner() 메서드', () => {
    it('화요일 할인 배너를 올바르게 생성해야 한다', () => {
      // Given: 화요일 할인 정보
      const tuesdayDiscount = { discountAmount: 10000 };

      // When: 화요일 배너 생성
      const result = OrderSummary.generateTuesdayBanner(tuesdayDiscount);

      // Then: 화요일 배너가 표시되어야 함
      expect(result).toContain('tuesday-banner');
      expect(result).toContain('🎉');
      expect(result).toContain('Tuesday Special 10% Applied');
      expect(result).toContain('bg-white/10 rounded-lg');
    });

    it('할인 금액이 없으면 빈 문자열을 반환해야 한다', () => {
      // Given: 할인 금액이 없는 정보
      const tuesdayDiscount = { discountAmount: 0 };

      // When: 화요일 배너 생성
      const result = OrderSummary.generateTuesdayBanner(tuesdayDiscount);

      // Then: 빈 문자열 반환
      expect(result).toBe('');
    });

    it('null 할인 정보에 대해 빈 문자열을 반환해야 한다', () => {
      // Given: null 할인 정보

      // When: null로 배너 생성
      const result = OrderSummary.generateTuesdayBanner(null);

      // Then: 빈 문자열 반환
      expect(result).toBe('');
    });
  });

  describe('generateFinalSummary() 메서드', () => {
    it('최종 주문 금액 요약을 생성해야 한다', () => {
      // Given: 가격 정보
      const pricing = { finalAmount: 240000 };

      // When: 최종 요약 생성
      const result = OrderSummary.generateFinalSummary(pricing);

      // Then: 최종 금액이 표시되어야 함
      expect(result).toContain('final-summary');
      expect(result).toContain('Total');
      expect(result).toContain('₩240,000');
      expect(result).toContain('border-t border-white/10');
    });

    it('null 가격 정보에 대해 빈 문자열을 반환해야 한다', () => {
      // Given: null 가격 정보

      // When: null로 최종 요약 생성
      const result = OrderSummary.generateFinalSummary(null);

      // Then: 빈 문자열 반환
      expect(result).toBe('');
    });
  });

  describe('transformCalculationResults() 유틸리티', () => {
    it('Epic 3 계산 결과를 OrderSummary 형식으로 변환해야 한다', () => {
      // Given: Epic 3 계산 엔진 결과들
      const calculationResults = {
        priceResult: {
          subtotal: 300000,
          finalAmount: 240000,
          totalSavings: 60000,
          individualDiscounts: [{ productName: '무선 키보드', discountRate: 0.1 }],
          bulkDiscount: { discountRate: 0 },
          tuesdayDiscount: { discountAmount: 10000 },
        },
        pointsResult: {
          total: 350,
          messages: ['기본: 100p', '화요일 2배'],
        },
        discountResult: {
          specialDiscounts: [{ type: 'flash', description: '번개세일', rate: 0.2 }],
        },
        context: { isTuesday: true },
      };

      const cartItems = [
        {
          id: 'p1',
          product: { name: '무선 키보드', val: 100000 },
          quantity: 2,
          price: 100000,
        },
      ];

      // When: 계산 결과 변환
      const result = OrderSummary.transformCalculationResults(calculationResults, cartItems);

      // Then: OrderSummary 형식으로 변환되어야 함
      expect(result).toHaveProperty('pricing');
      expect(result).toHaveProperty('points');
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('context');

      expect(result.pricing.subtotal).toBe(300000);
      expect(result.pricing.finalAmount).toBe(240000);
      expect(result.pricing.totalSavings).toBe(60000);
      expect(result.pricing.discountRate).toBeCloseTo(0.2);

      expect(result.points.total).toBe(350);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe('무선 키보드');
      expect(result.context.isTuesday).toBe(true);
    });

    it('부분적인 계산 결과도 올바르게 처리해야 한다', () => {
      // Given: 일부 데이터만 있는 계산 결과
      const calculationResults = {
        priceResult: { subtotal: 100000, finalAmount: 100000, totalSavings: 0 },
      };

      // When: 부분 결과 변환
      const result = OrderSummary.transformCalculationResults(calculationResults, []);

      // Then: 기본값으로 채워져야 함
      expect(result.pricing.subtotal).toBe(100000);
      expect(result.pricing.discountRate).toBe(0);
      expect(result.points.total).toBe(0);
      expect(result.items).toHaveLength(0);
      expect(result.context.isTuesday).toBe(new Date().getDay() === 2);
    });
  });

  describe('통합 시나리오 테스트', () => {
    it('복잡한 할인 조합 시나리오를 완전히 처리해야 한다', () => {
      // Given: 모든 할인이 적용된 복잡한 주문
      const complexOrderData = {
        pricing: {
          subtotal: 500000,
          finalAmount: 350000,
          totalSavings: 150000,
          discountRate: 0.3,
          discounts: {
            individual: [{ productName: '헤드폰', discountRate: 0.15 }],
            bulk: { discountRate: 0.25 },
            tuesday: { discountAmount: 25000 },
            special: [
              { type: 'flash', description: '번개세일', rate: 0.2 },
              { type: 'combo', description: '콤보할인', rate: 0.1 },
            ],
          },
        },
        points: {
          total: 500,
          messages: ['기본: 200p', '화요일 2배', '풀세트 구매 +100p'],
        },
        items: [
          { id: 'p1', name: '헤드폰', quantity: 2, unitPrice: 150000, totalPrice: 300000 },
          { id: 'p2', name: '키보드', quantity: 1, unitPrice: 100000, totalPrice: 100000 },
          { id: 'p3', name: '마우스', quantity: 1, unitPrice: 50000, totalPrice: 50000 },
        ],
        context: { isTuesday: true, hasSpecialDiscounts: true, itemCount: 4 },
      };

      // When: 복잡한 주문 렌더링
      const result = OrderSummary.render(complexOrderData);

      // Then: 모든 요소가 올바르게 렌더링되어야 함
      expect(result).toContain('Tuesday Special 10% Applied'); // 화요일 배너
      expect(result).toContain('헤드폰 x 2'); // 아이템 내역
      expect(result).toContain('키보드 x 1');
      expect(result).toContain('마우스 x 1');
      expect(result).toContain('₩500,000'); // 소계
      expect(result).toContain('🎉 대량구매 할인'); // 대량 할인
      expect(result).toContain('⚡ 번개세일'); // 특별 할인
      expect(result).toContain('⚡💝 콤보할인');
      expect(result).toContain('🌟 화요일 추가 할인'); // 화요일 할인
      expect(result).toContain('30.0%'); // 총 할인율
      expect(result).toContain('₩150,000 할인되었습니다'); // 절약 금액
      expect(result).toContain('500p'); // 포인트
    });

    it('할인 없는 일반 주문을 올바르게 처리해야 한다', () => {
      // Given: 할인이 없는 단순한 주문
      const simpleOrderData = {
        pricing: {
          subtotal: 100000,
          finalAmount: 100000,
          totalSavings: 0,
          discountRate: 0,
          discounts: {
            individual: [],
            bulk: { discountRate: 0 },
            tuesday: { discountAmount: 0 },
            special: [],
          },
        },
        points: { total: 100, messages: ['기본: 100p'] },
        items: [{ id: 'p1', name: '마우스', quantity: 1, unitPrice: 100000, totalPrice: 100000 }],
        context: { isTuesday: false, hasSpecialDiscounts: false, itemCount: 1 },
      };

      // When: 단순한 주문 렌더링
      const result = OrderSummary.render(simpleOrderData);

      // Then: 기본 요소들만 표시되어야 함
      expect(result).toContain('마우스 x 1');
      expect(result).toContain('₩100,000');
      expect(result).toContain('100p');
      expect(result).not.toContain('tuesday-banner'); // 화요일 배너 없음
      expect(result).not.toContain('savings-info'); // 절약 정보 없음
      expect(result).not.toContain('할인'); // 할인 정보 없음
    });
  });
});
