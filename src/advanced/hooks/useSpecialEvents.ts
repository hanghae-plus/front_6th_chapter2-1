import { useEffect, useCallback } from "react";
import { Product } from "../types";
import { SPECIAL_EVENTS, DISCOUNT_RATES } from "../constants";

interface UseSpecialEventsProps {
  products: Product[];
  onProductUpdate: (productId: string, updates: Partial<Product>) => void;
  selectedProductId: string | null;
}

export const useSpecialEvents = ({ products, onProductUpdate, selectedProductId }: UseSpecialEventsProps) => {
  const triggerLightningSale = useCallback(() => {
    const availableProducts = products.filter(p => p.q > 0 && !p.onSale);
    if (availableProducts.length === 0) return;

    const randomIndex = Math.floor(Math.random() * availableProducts.length);
    const luckyProduct = availableProducts[randomIndex];

    const newPrice = Math.round((luckyProduct.originalVal * (100 - DISCOUNT_RATES.LIGHTNING_DISCOUNT)) / 100);

    onProductUpdate(luckyProduct.id, {
      val: newPrice,
      onSale: true,
    });

    alert(`⚡번개세일! ${luckyProduct.name}이(가) ${DISCOUNT_RATES.LIGHTNING_DISCOUNT}% 할인 중입니다!`);
  }, [products, onProductUpdate]);

  const triggerSuggestSale = useCallback(() => {
    if (!selectedProductId) return;

    const availableProducts = products.filter(p => p.id !== selectedProductId && p.q > 0 && !p.suggestSale);

    if (availableProducts.length === 0) return;

    const suggestProduct = availableProducts[0];
    const newPrice = Math.round((suggestProduct.val * (100 - DISCOUNT_RATES.SUGGEST_DISCOUNT)) / 100);

    onProductUpdate(suggestProduct.id, {
      val: newPrice,
      suggestSale: true,
    });

    alert(`💝 ${suggestProduct.name}은(는) 어떠세요? 지금 구매하시면 ${DISCOUNT_RATES.SUGGEST_DISCOUNT}% 추가 할인!`);
  }, [products, selectedProductId, onProductUpdate]);

  useEffect(() => {
    // 번개세일 타이머
    const lightningDelay = Math.random() * SPECIAL_EVENTS.LIGHTNING_DELAY_RANGE;
    const lightningTimer = setTimeout(() => {
      const lightningInterval = setInterval(triggerLightningSale, SPECIAL_EVENTS.LIGHTNING_SALE_INTERVAL);

      return () => clearInterval(lightningInterval);
    }, lightningDelay);

    // 추천할인 타이머
    const suggestDelay = Math.random() * SPECIAL_EVENTS.SUGGEST_DELAY_RANGE;
    const suggestTimer = setTimeout(() => {
      const suggestInterval = setInterval(triggerSuggestSale, SPECIAL_EVENTS.SUGGEST_SALE_INTERVAL);

      return () => clearInterval(suggestInterval);
    }, suggestDelay);

    return () => {
      clearTimeout(lightningTimer);
      clearTimeout(suggestTimer);
    };
  }, [triggerLightningSale, triggerSuggestSale]);

  return {
    triggerLightningSale,
    triggerSuggestSale,
  };
};
