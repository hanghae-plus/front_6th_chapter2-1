import { useEffect, useMemo, useState } from 'react';

import { initialProducts } from '../components/lib/product';
import { DISCOUNT_RATES } from '../constants';
import { CartItem, Product } from '../types';

interface UseProductsResult {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  stockInfoMessage: string;
  totalStockQuantity: number;
}

export const useProducts = (cartItems: CartItem[]): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // 재고 현황 메시지 계산
  const stockInfoMessage = useMemo(() => {
    let msg = '';
    products.forEach((item) => {
      if (item.q < 5) {
        if (item.q > 0) {
          msg += `${item.name}: 재고 부족 (${item.q}개 남음)\n`;
        } else {
          msg += `${item.name}: 품절\n`;
        }
      }
    });
    return msg;
  }, [products]);

  // 전체 상품 재고 수량
  const totalStockQuantity = useMemo(() => {
    return products.reduce((acc, p) => acc + p.q, 0);
  }, [products]);

  // 번개 세일 및 추천 할인 로직 (useEffect로 관리)
  useEffect(() => {
    // 번개 세일 (20% 할인)
    const lightningDelay = Math.random() * 10000;
    const lightningTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setProducts((prevProducts) => {
          const updatableProducts = prevProducts.filter((p) => p.q > 0 && !p.onSale);
          if (updatableProducts.length === 0) return prevProducts;

          const luckyIdx = Math.floor(Math.random() * updatableProducts.length);
          const luckyItem = updatableProducts[luckyIdx];

          const newProducts = prevProducts.map((p) =>
            p.id === luckyItem.id
              ? {
                  ...p,
                  val: Math.round(p.originalVal * (1 - DISCOUNT_RATES.LIGHTNING_SALE_RATE)),
                  onSale: true,
                }
              : p
          );
          alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
          return newProducts;
        });
      }, 30000); // 30초마다

      return () => clearInterval(interval); // 클린업 함수
    }, lightningDelay);

    // 추천 할인 (5% 할인)
    const suggestDelay = Math.random() * 20000;
    const suggestTimer = setTimeout(() => {
      const interval = setInterval(() => {
        // 장바구니에 상품이 없으면 추천 할인 안함
        if (cartItems.length === 0) return;

        setProducts((prevProducts) => {
          // 현재 장바구니에 있는 상품은 추천 대상에서 제외
          const currentCartProductIds = cartItems.map((item) => item.id);
          const suggestableProducts = prevProducts.filter(
            (p) => p.q > 0 && !p.suggestSale && !currentCartProductIds.includes(p.id)
          );

          if (suggestableProducts.length === 0) return prevProducts;

          const suggestIdx = Math.floor(Math.random() * suggestableProducts.length);
          const suggestedItem = suggestableProducts[suggestIdx];

          const newProducts = prevProducts.map((p) =>
            p.id === suggestedItem.id
              ? {
                  ...p,
                  val: Math.round(p.val * (1 - DISCOUNT_RATES.SUGGESTION_SALE_RATE)),
                  suggestSale: true,
                }
              : p
          );
          alert('💝 ' + suggestedItem.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          return newProducts;
        });
      }, 60000); // 1분마다

      return () => clearInterval(interval); // 클린업 함수
    }, suggestDelay);

    return () => {
      clearTimeout(lightningTimer);
      clearTimeout(suggestTimer);
    };
  }, [cartItems]); // cartItems가 변경될 때마다 useEffect 재실행

  return { products, setProducts, stockInfoMessage, totalStockQuantity };
};
