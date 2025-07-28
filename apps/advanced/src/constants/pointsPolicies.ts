/**
 * 포인트 적립 정책 상수 정의
 * 모든 포인트 관련 정책을 중앙집중적으로 관리합니다.
 */

import { PointsPolicy } from "../types/promotion.types";

/**
 * 포인트 적립률 상수
 */
export const POINTS_RATES = {
  BASE_RATE: 0.001, // 0.1% (1000원당 1포인트)
  TUESDAY_MULTIPLIER: 2, // 화요일 2배 적립
  MINIMUM_EARNING: 1, // 최소 적립 포인트
} as const;

/**
 * 보너스 포인트 정책 상수
 */
export const BONUS_POINTS = {
  KEYBOARD_MOUSE_SET: {
    points: 50,
    description: "키보드+마우스 세트 +50p",
  },
  FULL_SET: {
    points: 100,
    description: "풀세트 구매 +100p",
  },
  BULK_PURCHASE: {
    LEVEL_1: { threshold: 10, points: 20, description: "대량구매(10개+) +20p" },
    LEVEL_2: { threshold: 20, points: 50, description: "대량구매(20개+) +50p" },
    LEVEL_3: {
      threshold: 30,
      points: 100,
      description: "대량구매(30개+) +100p",
    },
  },
} as const;

/**
 * 포인트 메시지 템플릿
 */
export const POINTS_MESSAGES = {
  BASE_POINTS: "기본: {points}p",
  TUESDAY_DOUBLE: "화요일 2배",
  KEYBOARD_MOUSE_SET: "키보드+마우스 세트 +{points}p",
  FULL_SET: "풀세트 구매 +{points}p",
  BULK_PURCHASE_TEMPLATE: "대량구매({threshold}개+) +{points}p",
} as const;

/**
 * 포인트 정책 배열
 */
export const POINTS_POLICIES: PointsPolicy[] = [
  {
    id: "base-points",
    earnRate: 0.001,
    minPurchase: 0,
    description: "기본 포인트 적립 (0.1%)",
  },
  {
    id: "tuesday-bonus",
    earnRate: 0.002,
    minPurchase: 0,
    description: "화요일 2배 적립",
  },
];
