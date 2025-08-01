import { Product } from "../model/types";

export const getLuckySaleProduct = (productList: Product[]) => {
  const newProductList = [...productList];
  const luckyIndex = Math.floor(Math.random() * productList.length);
  const luckyProduct = productList[luckyIndex];
  let alreadyLucky = false;

  if (luckyProduct.quantity > 0 && !luckyProduct.onSale) {
    newProductList[luckyIndex] = {
      ...luckyProduct,
      price: Math.round(
        (luckyProduct.originalPrice *
          (100 - 20 - (luckyProduct.suggestSale ? 5 : 0))) /
          100
      ),
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

export const getSuggestSaleProduct = (
  productList: Product[],
  lastSelectedItem: Product | null
) => {
  const newProductList = [...productList];
  if (lastSelectedItem == null) {
    return null;
  }

  const suggestProductIndex = productList.findIndex(
    (item) =>
      item.id !== lastSelectedItem.id && item.quantity > 0 && !item.suggestSale
  );

  if (suggestProductIndex === -1) {
    return null;
  }

  const suggestProduct = newProductList[suggestProductIndex];
  newProductList[suggestProductIndex] = {
    ...suggestProduct,
    price: Math.round(
      (suggestProduct.originalPrice *
        (100 - 5 - (suggestProduct.onSale ? 20 : 0))) /
        100
    ),
    suggestSale: true,
  };

  return {
    suggestProduct,
    productList: [...newProductList],
  };
};
