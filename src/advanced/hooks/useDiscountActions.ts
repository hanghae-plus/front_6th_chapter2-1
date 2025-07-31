import { useCallback } from 'react';
import { CartItem } from '../types';
import { DISCOUNT_RATES } from '../constants/config';

interface UseDiscountActionsProps {
  getAvailableProductsForLightning: () => any[];
  getAvailableProductsForSuggestion: (excludeId: string) => any;
  applyLightningSale: (productId: string) => void;
  applySuggestionSale: (productId: string) => void;
  updateCartItemPrices: (products: any[]) => void;
  cartItems: CartItem[];
  lastSelectedProduct: string;
  products: any[];
}

export function useDiscountActions({
  getAvailableProductsForLightning,
  getAvailableProductsForSuggestion,
  applyLightningSale,
  applySuggestionSale,
  updateCartItemPrices,
  cartItems,
  lastSelectedProduct,
  products,
}: UseDiscountActionsProps) {
  const handleLightningSale = useCallback(() => {
    console.log('🔥 번개세일 실행!', new Date().toLocaleTimeString());

    const availableProducts = getAvailableProductsForLightning();
    if (availableProducts.length === 0) {
      console.log('⚠️ 번개세일 가능한 상품이 없습니다');
      return;
    }

    const luckyIndex = Math.floor(Math.random() * availableProducts.length);
    const selectedProduct = availableProducts[luckyIndex];

    applyLightningSale(selectedProduct.id);

    alert(
      `⚡번개세일! ${selectedProduct.name}이(가) ${DISCOUNT_RATES.LIGHTNING_SALE * 100}% 할인 중입니다!`
    );

    updateCartItemPrices(products);
  }, [
    getAvailableProductsForLightning,
    applyLightningSale,
    updateCartItemPrices,
    products,
  ]);

  const handleProductSuggestion = useCallback(() => {
    console.log('💝 추천할인 실행!', new Date().toLocaleTimeString());

    if (cartItems.length === 0 || !lastSelectedProduct) {
      console.log(
        '⚠️ 추천할인 조건 불만족: 장바구니 비어있음 또는 선택된 상품 없음'
      );
      return;
    }

    const suggestedProduct =
      getAvailableProductsForSuggestion(lastSelectedProduct);
    if (!suggestedProduct) {
      console.log('⚠️ 추천할인 가능한 상품이 없습니다');
      return;
    }

    applySuggestionSale(suggestedProduct.id);

    alert(
      `💝 ${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 ${DISCOUNT_RATES.SUGGESTION * 100}% 추가 할인!`
    );

    updateCartItemPrices(products);
  }, [
    cartItems,
    lastSelectedProduct,
    getAvailableProductsForSuggestion,
    applySuggestionSale,
    updateCartItemPrices,
    products,
  ]);

  return {
    handleLightningSale,
    handleProductSuggestion,
  };
}
