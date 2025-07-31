import { describe, expect, it } from 'vitest';

import { calculateDiscount } from '../components/utils/discountCalculator';
import { calculatePoints } from '../components/utils/pointsCalculator';
import { PRODUCT_IDS, PRODUCT_LIST } from '../lib/products';

describe('Advanced Shopping Cart Tests', () => {
  describe('할인 계산 테스트', () => {
    it('빈 장바구니일 때 할인이 0이어야 한다', () => {
      const result = calculateDiscount([], PRODUCT_LIST);

      expect(result.originalTotal).toBe(0);
      expect(result.discountedTotal).toBe(0);
      expect(result.discountRate).toBe(0);
      expect(result.savedAmount).toBe(0);
      expect(result.discountDetails).toEqual([]);
    });

    it('개별 상품 10개 이상 구매 시 할인이 적용되어야 한다', () => {
      const cartItems = [
        { productId: PRODUCT_IDS.KEYBOARD, quantity: 10 }, // 10% 할인
        { productId: PRODUCT_IDS.MOUSE, quantity: 5 },
      ];

      const result = calculateDiscount(cartItems, PRODUCT_LIST);

      expect(result.discountDetails).toContainEqual({
        name: '버그 없애는 키보드 (10개↑)',
        discountRate: 10,
      });
      expect(result.discountRate).toBeGreaterThan(0);
    });
  });

  describe('포인트 계산 테스트', () => {
    it('빈 장바구니일 때 포인트가 0이어야 한다', () => {
      const result = calculatePoints([], PRODUCT_LIST, 0);

      expect(result.totalPoints).toBe(0);
      expect(result.pointsDetails).toEqual([]);
    });

    it('1000원 구매 시 기본 포인트 1점이 적립되어야 한다', () => {
      const cartItems = [{ productId: PRODUCT_IDS.KEYBOARD, quantity: 1 }];

      const result = calculatePoints(cartItems, PRODUCT_LIST, 1000);

      expect(result.totalPoints).toBe(1);
      expect(result.pointsDetails).toContain('기본: 1p');
    });

    it('키보드+마우스 세트 구매 시 보너스 포인트가 적립되어야 한다', () => {
      const cartItems = [
        { productId: PRODUCT_IDS.KEYBOARD, quantity: 1 },
        { productId: PRODUCT_IDS.MOUSE, quantity: 1 },
      ];

      const result = calculatePoints(cartItems, PRODUCT_LIST, 2000);

      expect(result.pointsDetails).toContain('키보드+마우스 세트 +50p');
      expect(result.totalPoints).toBeGreaterThan(2); // 기본 2p + 보너스 50p
    });

    it('30개 이상 구매 시 대량구매 보너스가 적립되어야 한다', () => {
      const cartItems = [{ productId: PRODUCT_IDS.KEYBOARD, quantity: 30 }];

      const result = calculatePoints(cartItems, PRODUCT_LIST, 30000);

      expect(result.pointsDetails).toContain('대량구매(30개+) +100p');
      expect(result.totalPoints).toBeGreaterThan(30); // 기본 30p + 보너스 100p
    });
  });

  describe('상품 데이터 테스트', () => {
    it('모든 상품이 필수 필드를 가지고 있어야 한다', () => {
      PRODUCT_LIST.forEach((product) => {
        expect(product).toHaveProperty('productId');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('originalPrice');
        expect(product).toHaveProperty('stock');
        expect(product).toHaveProperty('isOnSale');
        expect(product).toHaveProperty('isRecommended');
      });
    });

    it('할인된 가격이 원가보다 낮거나 같아야 한다', () => {
      PRODUCT_LIST.forEach((product) => {
        if (product.isOnSale || product.isRecommended) {
          expect(product.price).toBeLessThanOrEqual(product.originalPrice);
        }
      });
    });

    it('재고는 0 이상이어야 한다', () => {
      PRODUCT_LIST.forEach((product) => {
        expect(product.stock).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('할인 로직 테스트', () => {
    it('번개세일과 추천할인이 동시 적용된 상품은 슈퍼세일로 표시되어야 한다', () => {
      // 테스트용으로 할인 상품을 임시로 생성
      const testProducts = [
        {
          ...PRODUCT_LIST[0],
          isOnSale: true,
          isRecommended: true,
          price: 8000, // 20% 할인
        },
      ];

      const cartItems = [{ productId: PRODUCT_IDS.KEYBOARD, quantity: 1 }];
      const result = calculateDiscount(cartItems, testProducts);

      expect(result.discountDetails).toContainEqual(
        expect.objectContaining({
          name: expect.stringContaining('슈퍼세일'),
        })
      );
    });

    it('화요일 할인은 추가 10%가 적용되어야 한다', () => {
      const cartItems = [{ productId: PRODUCT_IDS.KEYBOARD, quantity: 1 }];
      const result = calculateDiscount(cartItems, PRODUCT_LIST);

      // 화요일 할인이 적용되면 할인 내역에 포함됨
      const tuesdayDiscount = result.discountDetails.find((d) => d.name.includes('화요일'));

      if (tuesdayDiscount) {
        expect(tuesdayDiscount.discountRate).toBe(10);
      }
    });
  });

  describe('상품별 할인율 테스트', () => {
    it('키보드 10개 이상 구매 시 10% 할인이 적용되어야 한다', () => {
      const cartItems = [{ productId: PRODUCT_IDS.KEYBOARD, quantity: 10 }];
      const result = calculateDiscount(cartItems, PRODUCT_LIST);

      const keyboardDiscount = result.discountDetails.find(
        (d) => d.name.includes('버그 없애는 키보드') && d.name.includes('10개↑')
      );

      expect(keyboardDiscount).toBeDefined();
      expect(keyboardDiscount?.discountRate).toBe(10);
    });

    it('마우스 10개 이상 구매 시 15% 할인이 적용되어야 한다', () => {
      const cartItems = [{ productId: PRODUCT_IDS.MOUSE, quantity: 10 }];
      const result = calculateDiscount(cartItems, PRODUCT_LIST);

      const mouseDiscount = result.discountDetails.find(
        (d) => d.name.includes('생산성 폭발 마우스') && d.name.includes('10개↑')
      );

      expect(mouseDiscount).toBeDefined();
      expect(mouseDiscount?.discountRate).toBe(15);
    });

    it('스피커 10개 이상 구매 시 25% 할인이 적용되어야 한다', () => {
      const cartItems = [{ productId: PRODUCT_IDS.SPEAKER, quantity: 10 }];
      const result = calculateDiscount(cartItems, PRODUCT_LIST);

      const speakerDiscount = result.discountDetails.find(
        (d) => d.name.includes('Lo-Fi 스피커') && d.name.includes('10개↑')
      );

      expect(speakerDiscount).toBeDefined();
      expect(speakerDiscount?.discountRate).toBe(25);
    });
  });

  describe('포인트 계산 상세 테스트', () => {
    it('기본 포인트 계산이 정확해야 한다', () => {
      const cartItems = [{ productId: PRODUCT_IDS.KEYBOARD, quantity: 1 }];

      // 1000원당 1포인트
      const result1 = calculatePoints(cartItems, PRODUCT_LIST, 1000);
      expect(result1.totalPoints).toBe(1);

      const result2 = calculatePoints(cartItems, PRODUCT_LIST, 2500);
      expect(result2.totalPoints).toBe(2);
    });

    it('화요일 2배 포인트가 적용되어야 한다', () => {
      const cartItems = [{ productId: PRODUCT_IDS.KEYBOARD, quantity: 1 }];

      // 화요일인지 확인하는 로직은 실제 날짜에 의존하므로 조건부 테스트
      const result = calculatePoints(cartItems, PRODUCT_LIST, 1000);
      const today = new Date();
      const isTuesday = today.getDay() === 2;

      if (isTuesday) {
        expect(result.totalPoints).toBe(2); // 1 * 2
        expect(result.pointsDetails).toContain('화요일 2배');
      } else {
        expect(result.totalPoints).toBe(1);
      }
    });

    it('대량구매 보너스가 정확히 적용되어야 한다', () => {
      // 10개 이상
      const cartItems10 = [{ productId: PRODUCT_IDS.KEYBOARD, quantity: 10 }];
      const result10 = calculatePoints(cartItems10, PRODUCT_LIST, 10000);
      expect(result10.pointsDetails).toContain('대량구매(10개+) +20p');

      // 20개 이상
      const cartItems20 = [{ productId: PRODUCT_IDS.KEYBOARD, quantity: 20 }];
      const result20 = calculatePoints(cartItems20, PRODUCT_LIST, 20000);
      expect(result20.pointsDetails).toContain('대량구매(20개+) +50p');

      // 30개 이상
      const cartItems30 = [{ productId: PRODUCT_IDS.KEYBOARD, quantity: 30 }];
      const result30 = calculatePoints(cartItems30, PRODUCT_LIST, 30000);
      expect(result30.pointsDetails).toContain('대량구매(30개+) +100p');
    });

    it('풀세트 보너스가 적용되어야 한다', () => {
      const cartItems = [
        { productId: PRODUCT_IDS.KEYBOARD, quantity: 1 },
        { productId: PRODUCT_IDS.MOUSE, quantity: 1 },
        { productId: PRODUCT_IDS.MONITOR_ARM, quantity: 1 },
      ];

      const result = calculatePoints(cartItems, PRODUCT_LIST, 60000);

      expect(result.pointsDetails).toContain('키보드+마우스 세트 +50p');
      expect(result.pointsDetails).toContain('풀세트 구매 +100p');
    });
  });
});
