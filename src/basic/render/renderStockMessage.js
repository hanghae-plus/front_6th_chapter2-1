import { getStockMessages } from '../libs/getStockMessage';

// 재고 품절 텍스트를 stockInfo에 출력
export const renderStockMessage = (state) => {
  const { productState } = state;
  const stockInfo = document.getElementById('stock-status');
  const stockMessage = getStockMessages(productState);

  stockInfo.textContent = stockMessage;
};
