// TODO : enum 타입 사용하기

export const getProductStatus = product => {
  if (product.q === 0) return "outOfStock";
  if (product.onSale && product.suggestSale) return "superSale";
  if (product.onSale) return "lightningSale";
  if (product.suggestSale) return "suggestionSale";
  return "normal";
};

export const createProductText = (product, status) => {
  const formatters = {
    outOfStock: () => `${product.name} - ${product.val}원 (품절)`,
    superSale: () =>
      `⚡💝${product.name} - ${product.originalVal}원 → ${product.val}원 (${getSuperSaleRate()}% SUPER SALE!)`,
    lightningSale: () =>
      `⚡${product.name} - ${product.originalVal}원 → ${product.val}원 (${DISCOUNT_RATE_LIGHTNING}% SALE!)`,
    suggestionSale: () =>
      `💝${product.name} - ${product.originalVal}원 → ${product.val}원 (${DISCOUNT_RATE_SUGGESTION}% 추천할인!)`,
    normal: () => `${product.name} - ${product.val}원`,
  };

  return formatters[status]();
};

export const getProductStyle = status => {
  const styles = {
    outOfStock: "text-gray-400",
    superSale: "text-purple-600 font-bold",
    lightningSale: "text-red-500 font-bold",
    suggestionSale: "text-blue-500 font-bold",
    normal: "",
  };

  return styles[status];
};
