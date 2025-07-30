import { state } from '../store';

export const StockStatus = () => {
  let statusText = '';

  state.products.forEach(function (item) {
    if (item.quantity === 0) {
      statusText += `${item.name}: 품절\n`;
    } else if (item.quantity < 5) {
      statusText += `${item.name} : 재고 부족 (${item.quantity}개 남음)\n`;
    }
  });

  return statusText;
};
