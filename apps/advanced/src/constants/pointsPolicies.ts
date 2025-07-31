import { PointsPolicy } from '../types/promotion.types';

export const POINTS_RATES = {
  BASE_RATE: 0.001, // 0.1% (1000원당 1포인트)
  TUESDAY_MULTIPLIER: 2, // 화요일 2배 적립
  MINIMUM_EARNING: 1 // 최소 적립 포인트
} as const;

export const BONUS_POINTS = {
  KEYBOARD_MOUSE_SET: {
    points: 50,
    description: '키보드+마우스 세트 +50p'
  },
  FULL_SET: {
    points: 100,
    description: '풀세트 구매 +100p'
  },
  BULK_PURCHASE: {
    LEVEL_1: { threshold: 10, points: 20, description: '대량구매(10개+) +20p' },
    LEVEL_2: { threshold: 20, points: 50, description: '대량구매(20개+) +50p' },
    LEVEL_3: {
      threshold: 30,
      points: 100,
      description: '대량구매(30개+) +100p'
    }
  }
} as const;

export const POINTS_MESSAGES = {
  BASE_POINTS: '기본: {points}p',
  TUESDAY_DOUBLE: '화요일 2배',
  KEYBOARD_MOUSE_SET: '키보드+마우스 세트 +{points}p',
  FULL_SET: '풀세트 구매 +{points}p',
  BULK_PURCHASE_TEMPLATE: '대량구매({threshold}개+) +{points}p'
} as const;

export const POINTS_POLICIES: PointsPolicy[] = [
  {
    id: 'base-points',
    earnRate: 0.001,
    minPurchase: 100000,
    description: '기본 포인트 적립 (0.1%)'
  },
  {
    id: 'tuesday-bonus',
    earnRate: 0.002,
    minPurchase: 500000,
    description: '화요일 2배 적립'
  }
];
