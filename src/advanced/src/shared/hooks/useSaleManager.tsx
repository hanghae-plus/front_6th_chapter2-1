import { Product } from 'types';
import { SALE_EVENTS, TIMERS } from '@shared/constants/business-rules';

interface SaleManagerProps {
  products: Product[];
  updateSaleStatus: (productId: string, saleInfo: any) => void;
}

interface SaleManagerReturn {
  startLightningSale: () => void;
  startSuggestionSale: () => void;
  lightningSaleConfig: {
    delay: number;
    interval: number;
  };
  suggestionSaleConfig: {
    delay: number;
    interval: number;
  };
}

export function useSaleManager({
  products,
  updateSaleStatus,
}: SaleManagerProps): SaleManagerReturn {
  const lightningSaleConfig = {
    delay: Math.random() * TIMERS.lightningDelayMax,
    interval: TIMERS.saleInterval,
  };

  const suggestionSaleConfig = {
    delay: 60000,
    interval: 60000,
  };

  const startLightningSale = () => {
    if (products.length === 0) return;

    const luckyIdx = Math.floor(Math.random() * products.length);
    const luckyItem = products[luckyIdx];

    if (luckyItem && luckyItem.q > 0 && !luckyItem.onSale) {
      alert(`⚡ 번개세일! ${luckyItem.name}이(가) 20% 할인됩니다!`);
      updateSaleStatus(luckyItem.id, {
        val: Math.round(
          luckyItem.originalVal * SALE_EVENTS.lightning.priceMultiplier
        ),
        onSale: true,
      });
    }
  };

  const startSuggestionSale = () => {
    const suggestedProduct = products.find(
      (product: Product) => product.q > 0 && !product.suggestSale
    );

    if (suggestedProduct) {
      alert(`💡 추천세일! ${suggestedProduct.name}을(를) 5% 할인해드립니다!`);
      updateSaleStatus(suggestedProduct.id, {
        val: Math.round(
          suggestedProduct.val * SALE_EVENTS.suggestion.priceMultiplier
        ),
        suggestSale: true,
      });
    }
  };

  return {
    startLightningSale,
    startSuggestionSale,
    lightningSaleConfig,
    suggestionSaleConfig,
  };
}
