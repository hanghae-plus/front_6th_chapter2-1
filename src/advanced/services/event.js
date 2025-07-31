export const getLuckySaleProduct = (productList) => {
  const newProductList = [...productList];
  const luckyIndex = Math.floor(Math.random() * productList.length);
  const luckyProduct = productList[luckyIndex];
  let alreadyLucky = false;

  if (luckyProduct.quantity > 0 && !luckyProduct.onSale) {
    newProductList[luckyIndex] = {
      ...luckyProduct,
      price: Math.round((luckyProduct.originalPrice * 80) / 100),
      onSale: true,
    };
  } else {
    alreadyLucky = true;
  }

  return {
    luckyProduct,
    productList: newProductList,
    alreadyLucky,
  };
};

export const getSuggestSaleProduct = (productList, lastSelectedItem) => {
  const newProductList = [...productList];
  if (lastSelectedItem == null) {
    return null;
  }

  const suggestProduct = productList.find(
    (item) =>
      item.id !== lastSelectedItem.id && item.quantity > 0 && !item.suggestSale
  );

  if (suggestProduct == null) {
    return null;
  }

  newProductList[suggestProduct.index] = {
    ...suggestProduct,
    price: Math.round((suggestProduct.price * (100 - 5)) / 100),
    suggestSale: true,
  };

  return {
    suggestProduct,
    productList: newProductList,
  };
};
