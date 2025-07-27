// ProductSelector 컴포넌트 - React 전환이 쉬운 스타일
const ProductSelector = ({ products }) => {
  const getOptionText = (product) => {
    const discountPrefix =
      product.onSale && product.suggestSale
        ? "⚡💝"
        : product.onSale
        ? "⚡"
        : product.suggestSale
        ? "💝"
        : "";

    const priceText =
      product.onSale || product.suggestSale
        ? `${product.originalVal}원 → ${product.val}원`
        : `${product.val}원`;

    const discountText =
      product.onSale && product.suggestSale
        ? " (25% SUPER SALE!)"
        : product.onSale
        ? " (20% SALE!)"
        : product.suggestSale
        ? " (5% 추천할인!)"
        : "";

    const stockText = product.q === 0 ? " (품절)" : "";

    return `${discountPrefix}${product.name} - ${priceText}${discountText}${stockText}`;
  };

  const getOptionClass = (product) => {
    if (product.q === 0) return "text-gray-400";
    if (product.onSale && product.suggestSale)
      return "text-purple-600 font-bold";
    if (product.onSale) return "text-red-500 font-bold";
    if (product.suggestSale) return "text-blue-500 font-bold";
    return "";
  };

  return products
    .map(
      (product) =>
        `<option value="${product.id}" class="${getOptionClass(product)}" ${
          product.q === 0 ? "disabled" : ""
        }>
        ${getOptionText(product)}
      </option>`
    )
    .join("");
};

export default ProductSelector;
