import { Product } from "../model/types";

export const getStockInfoMessage = (productList: Product[]) => {
  return productList.reduce((acc, item) => {
    if (item.quantity < 5) {
      if (item.quantity > 0) {
        acc += `${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
      } else {
        acc += `${item.name}: 품절\n`;
      }
    }
    return acc;
  }, "");
};
