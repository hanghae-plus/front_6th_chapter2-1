// 마지막에 담은 상품이 아니면서
// 재고가 남아있으면서
// 현재 추천 상태가 아닌 상품
export const findSuggestedProduct = (productList, lastSelectedProductId) => {
  return (
    productList.find(
      (product) => product.id !== lastSelectedProductId && product.quantity > 0 && !product.suggestSale
    ) || null
  );
};
