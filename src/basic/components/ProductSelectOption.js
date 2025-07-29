import { createProductText, getProductStatus, getProductStyle } from "../utils/product.util";

export default function ProductSelectOption(product) {
  const { id, onSale, suggestSale } = product;

  const discountText = onSale ? "⚡SALE" : suggestSale ? "💝추천" : "";

  const productStatus = getProductStatus(product);
  const productStyle = getProductStyle(productStatus);
  const optionText = createProductText(product, productStatus) + discountText;

  const isDisabled = productStatus === "outOfStock";
  const disabledAttribute = isDisabled ? "disabled" : "";

  return /* HTML */ `<option value="${id}" ${disabledAttribute} class="${productStyle}">
    ${optionText}
  </option>`;
}
