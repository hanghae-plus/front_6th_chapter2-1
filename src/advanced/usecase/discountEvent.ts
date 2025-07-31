import { LIGHTNING_DISCOUNT_RATE, SUGGEST_DISCOUNT_RATE } from '@/const/discount';
import { OUT_OF_STOCK } from '@/const/stock';
import { Product } from '@/data/product';

type DiscountTarget = {
  id: string;
  changes: Partial<Pick<Product, 'discountPrice' | 'onSale' | 'suggestSale' | 'quantity'>>;
  message: string;
} | null;

/**
 * 번개 세일 적용
 */
export const applyLightningSale = (products: Product[]): DiscountTarget => {
  const randomIndex = Math.floor(Math.random() * products.length);
  const randomProduct = products[randomIndex];

  if (randomProduct.quantity > OUT_OF_STOCK && !randomProduct.onSale) {
    return {
      id: randomProduct.id,
      changes: {
        discountPrice: Math.round(randomProduct.price * (1 - LIGHTNING_DISCOUNT_RATE)),
        onSale: true,
      },
      message: `⚡번개세일! ${randomProduct.name}이(가) 20% 할인 중입니다!`,
    };
  }

  return null;
};

/**
 * 추천 세일 적용
 */
export const applySuggestSale = (products: Product[], lastAddedItemId: string | null): DiscountTarget => {
  if (!lastAddedItemId) return null;

  const suggestProduct = products.find((product) => product.id !== lastAddedItemId && product.quantity > OUT_OF_STOCK);
  if (!suggestProduct) return null;

  return {
    id: suggestProduct.id,
    changes: {
      discountPrice: Math.round(suggestProduct.discountPrice * (1 - SUGGEST_DISCOUNT_RATE)),
      suggestSale: true,
    },
    message: `💝 ${suggestProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
  };
};
