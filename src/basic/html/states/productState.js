export const applyFlashSale = (productList, productId) => {
  const product = productList.find(product.id === productId);
  if (!product) return;

  product.changedPrice = Math.round(product.originalPrice * 0.8); // 20% 할인
  product.onSale = true;
};

export const applySuggestSale = (productList, productId) => {
  const product = productList.find(product.id === productId);
  if (!product) return;

  product.changedPrice = Math.round(product.changedPrice * 0.95); // 5% 추가 할인
  product.suggestSale = true;
};
