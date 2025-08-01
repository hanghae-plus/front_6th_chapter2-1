import { useEffect } from 'react';
import { Product } from '../types/product';
import { DISCOUNT_RATES } from '../utils/constants';

export const useLightningSale = (
  setProductList: React.Dispatch<React.SetStateAction<Product[]>>
) => {
  useEffect(() => {
    const lightningDelay = Math.random() * 10000;
    const initialTimer = setTimeout(() => {
      const intervalId = setInterval(() => {
        setProductList((prevProducts) => {
          const availableProducts = prevProducts.filter(
            (p) => p.stock > 0 && !p.onSale
          );
          if (availableProducts.length === 0) return prevProducts;

          const luckyIdx = Math.floor(Math.random() * availableProducts.length);
          const luckyItem = availableProducts[luckyIdx];

          const updatedProducts = prevProducts.map((p) => {
            if (p.id === luckyItem.id) {
              const newPrice = Math.round(
                p.originalVal * (1 - DISCOUNT_RATES.LIGHTNING_SALE)
              );
              alert(`⚡번개세일! ${p.name}이(가) 20% 할인 중입니다!`);
              return { ...p, val: newPrice, onSale: true };
            }
            return p;
          });
          return updatedProducts;
        });
      }, 30000);

      return () => clearInterval(intervalId);
    }, lightningDelay);

    return () => clearTimeout(initialTimer);
  }, [setProductList]);
};
