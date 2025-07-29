import { getStockMessages } from '../utils/getStockMessage';

// 재고 품절 텍스트를 stockInfo에 출력
export const renderStockMessage = (productList, stockInfo) => {
  const stockMessage = getStockMessages(productList);
  stockInfo.textContent = stockMessage;
};
