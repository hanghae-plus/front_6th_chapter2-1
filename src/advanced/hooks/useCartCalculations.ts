// ==========================================
// 장바구니 계산 훅
// ==========================================

import { useMemo } from 'react';
import { calculateCartTotals } from '../services/cartService';
import { useBonusPoints } from './useBonusPoints';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  val: number;
  originalVal: number;
  onSale: boolean;
  suggestSale: boolean;
}

interface Product {
  id: string;
  name: string;
  quantity: number;
  val: number;
  originalVal: number;
  onSale: boolean;
  suggestSale: boolean;
}

export function useCartCalculations(cartItems: CartItem[], products: Product[]) {
  const calculation = useMemo(() => calculateCartTotals(cartItems), [cartItems]);
  
  const bonusPointsData = useBonusPoints(
    calculation.finalTotal,
    cartItems,
    calculation.totalItemCount
  );
  
  return useMemo(() => {
    const totalStock = products.reduce((sum, product) => sum + product.quantity, 0);
    const cartCount = calculation.totalItemCount;

    return {
      ...calculation,
      loyaltyPoints: bonusPointsData.finalPoints,
      bonusPointsDetail: bonusPointsData.pointsDetail,
      totalStock,
      cartCount
    };
  }, [calculation, bonusPointsData, products]);
}