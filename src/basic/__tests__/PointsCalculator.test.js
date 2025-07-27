/**
 * PointsCalculator 단위 테스트
 * 모든 포인트 계산 로직의 정확성을 검증합니다.
 */

import { describe, expect, it } from 'vitest';
import { PointsCalculator } from '../helpers/PointsCalculator.js';

describe('PointsCalculator', () => {
  describe('calculateBasePoints', () => {
    it('1000원당 1포인트로 기본 포인트 계산', () => {
      const result = PointsCalculator.calculateBasePoints(50000);

      expect(result.points).toBe(50);
      expect(result.rate).toBe(0.001);
      expect(result.calculation).toContain('50p');
    });

    it('1000원 미만은 버림 처리', () => {
      const result = PointsCalculator.calculateBasePoints(1999);

      expect(result.points).toBe(1);
      expect(result.rate).toBe(0.001);
    });

    it('0원 또는 음수는 0포인트', () => {
      const zeroResult = PointsCalculator.calculateBasePoints(0);
      const negativeResult = PointsCalculator.calculateBasePoints(-1000);

      expect(zeroResult.points).toBe(0);
      expect(negativeResult.points).toBe(0);
    });
  });

  describe('calculateTuesdayMultiplier', () => {
    it('화요일에는 2배 적용', () => {
      const tuesday = new Date('2024-01-02'); // 화요일
      const result = PointsCalculator.calculateTuesdayMultiplier(50, tuesday);

      expect(result.points).toBe(100);
      expect(result.multiplier).toBe(2);
      expect(result.isTuesday).toBe(true);
      expect(result.calculation).toContain('화요일 2배');
    });

    it('평일에는 변동 없음', () => {
      const monday = new Date('2024-01-01'); // 월요일
      const result = PointsCalculator.calculateTuesdayMultiplier(50, monday);

      expect(result.points).toBe(50);
      expect(result.multiplier).toBe(1);
      expect(result.isTuesday).toBe(false);
      expect(result.calculation).toContain('평일');
    });
  });

  describe('calculateSetBonus', () => {
    it('키보드+마우스 세트 보너스 50p', () => {
      const cart = [
        { id: 'p1', quantity: 1 }, // 키보드
        { id: 'p2', quantity: 1 }, // 마우스
      ];

      const result = PointsCalculator.calculateSetBonus(cart);

      expect(result.points).toBe(50);
      expect(result.details).toHaveLength(1);
      expect(result.details[0].type).toBe('keyboard_mouse');
    });

    it('풀세트 구매 시 중복 적용 (150p = 50p + 100p)', () => {
      const cart = [
        { id: 'p1', quantity: 1 }, // 키보드
        { id: 'p2', quantity: 1 }, // 마우스
        { id: 'p3', quantity: 1 }, // 모니터암
      ];

      const result = PointsCalculator.calculateSetBonus(cart);

      expect(result.points).toBe(150); // 50p + 100p 중복 적용
      expect(result.details).toHaveLength(2);
      expect(result.details[0].type).toBe('keyboard_mouse');
      expect(result.details[1].type).toBe('full_set');
    });

    it('세트 조건 미달 시 0포인트', () => {
      const cart = [
        { id: 'p1', quantity: 1 }, // 키보드만
      ];

      const result = PointsCalculator.calculateSetBonus(cart);

      expect(result.points).toBe(0);
      expect(result.details).toHaveLength(0);
    });
  });

  describe('calculateQuantityBonus', () => {
    it('30개 이상 100포인트', () => {
      const result = PointsCalculator.calculateQuantityBonus(35);

      expect(result.points).toBe(100);
      expect(result.calculation).toContain('35개 구매');
    });

    it('20개 이상 50포인트', () => {
      const result = PointsCalculator.calculateQuantityBonus(25);

      expect(result.points).toBe(50);
      expect(result.calculation).toContain('25개 구매');
    });

    it('10개 이상 20포인트', () => {
      const result = PointsCalculator.calculateQuantityBonus(15);

      expect(result.points).toBe(20);
      expect(result.calculation).toContain('15개 구매');
    });

    it('10개 미만은 0포인트', () => {
      const result = PointsCalculator.calculateQuantityBonus(5);

      expect(result.points).toBe(0);
      expect(result.threshold).toBe('10개 미만');
    });
  });

  describe('calculateBonusPoints', () => {
    it('세트 보너스와 수량 보너스 통합 계산', () => {
      const cart = [
        { id: 'p1', quantity: 10 }, // 키보드 10개
        { id: 'p2', quantity: 10 }, // 마우스 10개
        { id: 'p3', quantity: 10 }, // 모니터암 10개
      ];

      const result = PointsCalculator.calculateBonusPoints(cart);

      expect(result.total).toBe(250); // 세트보너스 150p + 수량보너스 100p
      expect(result.setBonus.points).toBe(150);
      expect(result.quantityBonus.points).toBe(100);
    });
  });

  describe('getTotalPoints - 통합 테스트', () => {
    it('풀세트 30개 화요일 구매 복합 시나리오', () => {
      const cart = [
        { id: 'p1', quantity: 10 }, // 키보드 10개
        { id: 'p2', quantity: 10 }, // 마우스 10개
        { id: 'p3', quantity: 10 }, // 모니터암 10개
      ];
      const finalAmount = 100000; // 10만원
      const tuesday = new Date('2024-01-02'); // 화요일

      const result = PointsCalculator.getTotalPoints(cart, finalAmount, { date: tuesday });

      // 기본: 100p → 화요일 2배: 200p + 세트보너스: 150p + 수량보너스: 100p = 450p
      expect(result.total).toBe(450);
      expect(result.breakdown.base.points).toBe(100);
      expect(result.breakdown.tuesday.points).toBe(200);
      expect(result.breakdown.setBonus.points).toBe(150);
      expect(result.breakdown.quantityBonus.points).toBe(100);

      // 메시지 확인
      expect(result.messages).toContain('기본: 100p');
      expect(result.messages).toContain('화요일 2배');
      expect(result.messages).toContain('키보드+마우스 세트 +50p');
      expect(result.messages).toContain('풀세트 구매 +100p');
    });

    it('기본 구매 시나리오 (보너스 없음)', () => {
      const cart = [
        { id: 'p4', quantity: 1 }, // 헤드폰 1개
      ];
      const finalAmount = 30000; // 3만원
      const monday = new Date('2024-01-01'); // 월요일

      const result = PointsCalculator.getTotalPoints(cart, finalAmount, { date: monday });

      // 기본: 30p (보너스 없음)
      expect(result.total).toBe(30);
      expect(result.breakdown.base.points).toBe(30);
      expect(result.breakdown.tuesday.points).toBe(30);
      expect(result.breakdown.setBonus.points).toBe(0);
      expect(result.breakdown.quantityBonus.points).toBe(0);

      expect(result.messages).toContain('기본: 30p');
      expect(result.messages).not.toContain('화요일 2배');
    });
  });
});
