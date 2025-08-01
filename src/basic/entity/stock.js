import { prodList } from "../data";

export const getStockInfoMessage = () => {
  let message = "";
  prodList.forEach((item) => {
    if (item.quantity < 5) {
      if (item.quantity > 0) {
        message = `${message} ${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
      } else {
        message = `${message} ${item.name}: 품절\n`;
      }
    }
  });

  return message;
};
