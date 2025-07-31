// src/advanced/hooks/useSpecialSales.ts
import { useEffect } from 'react';
import { Dispatch } from 'react';
import { Action, State } from '../state/cartReducer';
import { DISCOUNT, TIMER } from '../../basic/constants';

export function useSpecialSales(state: State, dispatch: Dispatch<Action>) {
  const { products, cart, lastSelectedId } = state;

  // 번개세일 로직
  useEffect(() => {
    const lightningDelay = Math.random() * 10000;
    const timerId = setTimeout(() => {
      const intervalId = setInterval(() => {
        const availableProducts = products.filter(p => p.q > 0 && !p.onSale);
        if (availableProducts.length === 0) return;

        const luckyIdx = Math.floor(Math.random() * availableProducts.length);
        const luckyItem = availableProducts[luckyIdx];
        
        alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        dispatch({
          type: 'APPLY_SALE',
          payload: {
            productId: luckyItem.id,
            newPrice: Math.round(luckyItem.originalVal * (1 - DISCOUNT.LIGHTNING_SALE_RATE)),
            saleType: 'onSale',
          },
        });
      }, TIMER.LIGHTNING_SALE_INTERVAL);
      return () => clearInterval(intervalId);
    }, lightningDelay);

    return () => clearTimeout(timerId);
  }, [products, dispatch]);

  // 추천할인 로직
  useEffect(() => {
    const recommendDelay = Math.random() * 20000;
    const timerId = setTimeout(() => {
      const intervalId = setInterval(() => {
        if (cart.length === 0 || !lastSelectedId) return;

        const availableProducts = products.filter(p => p.id !== lastSelectedId && p.q > 0 && !p.suggestSale);
        if (availableProducts.length === 0) return;
        
        const suggest = availableProducts[0];

        alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
        dispatch({
          type: 'APPLY_SALE',
          payload: {
            productId: suggest.id,
            newPrice: Math.round(suggest.val * (1 - DISCOUNT.RECOMMEND_SALE_RATE)),
            saleType: 'suggestSale',
          },
        });
      }, TIMER.RECOMMEND_SALE_INTERVAL);
      return () => clearInterval(intervalId);
    }, recommendDelay);

    return () => clearTimeout(timerId);
  }, [products, cart, lastSelectedId, dispatch]);
}
