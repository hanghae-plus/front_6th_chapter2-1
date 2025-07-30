/**
 * 포인트 시스템 관련 타입 정의
 */

import { CartItem } from './cart';

export interface PointsCalculation {
  basePoints: number;
  tuesdayBonus: number;
  setBonus: number;
  quantityBonus: number;
  totalPoints: number;
  details: PointsDetail[];
}

export interface PointsDetail {
  type: 'base' | 'tuesday' | 'set' | 'quantity';
  description: string;
  points: number;
}

export interface SetBonus {
  name: string;
  requiredProducts: string[];
  bonusPoints: number;
  isEligible: (cartItems: CartItem[]) => boolean;
}

export interface QuantityBonus {
  threshold: number;
  bonusPoints: number;
  description: string;
}