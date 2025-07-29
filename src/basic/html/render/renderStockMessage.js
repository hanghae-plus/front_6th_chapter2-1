import { getStockMessages } from '../../utils/getStockMessage';

// 재고 품절 텍스트를 stockInfo에 출력
export const renderStockMessage = (state, stockInfo) => {
  const { productState } = state;
  const stockMessage = getStockMessages(productState);
  stockInfo.textContent = stockMessage;
};
