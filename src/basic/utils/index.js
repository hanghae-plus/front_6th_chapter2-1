import { STOCK_WARNING_THRESHOLD, TUESDAY } from '../constants/enum';

/**
 *
 * @param {{
 *  id: string;
 *  name: string;
 *  value: number;
 *  originalVal: number;
 *  quantity: number;
 *  onSale: boolean;
 *  suggestSale: boolean;
 *  }[]} productList
 * @returns {string}
 */
function getStockInfoMessage(productList) {
  const infoMessage = productList.reduce((message, product) => {
    if (product.quantity < STOCK_WARNING_THRESHOLD) {
      if (product.quantity > 0) {
        return `${message}${product.name}: 재고 부족 (${product.quantity}개 남음)\n`;
      }

      return `${message}${product.name}: 품절\n`;
    }

    return message;
  }, '');

  return infoMessage;
}

// 화요일 판별 함수
function checkTuesday(date = new Date()) {
  return date.getDay() === TUESDAY;
}

export { getStockInfoMessage, checkTuesday };
