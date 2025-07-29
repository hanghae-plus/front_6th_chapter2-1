export const getStockMessages = (productList) => {
  const messages = [];

  productList.forEach((product) => {
    if (product.quantity < 5) {
      if (product.quantity > 0) {
        messages.push(`${product.name}: 재고 부족 (${product.quantity}개 남음)`);
      } else {
        messages.push(`${product.name}: 품절`);
      }
    }
  });

  return messages.join('\n');
};
