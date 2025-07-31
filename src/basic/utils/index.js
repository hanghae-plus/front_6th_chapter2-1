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
    if (product.quantity < 5) {
      if (product.quantity > 0) {
        return message + `${product.name}: 재고 부족 (${product.quantity}개 남음)\n`;
      } else {
        return message + `${product.name}: 품절\n`;
      }
    }

    return message;
  }, '');

  return infoMessage;
}

export { getStockInfoMessage };
