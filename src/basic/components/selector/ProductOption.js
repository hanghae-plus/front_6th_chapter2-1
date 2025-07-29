export const ProductOption = ({
  id,
  name,
  price,
  originalPrice,
  quantity,
  onSale,
  suggestSale,
}) => {
  const isSoldout = quantity === 0;

  const option = document.createElement("option");
  option.value = id;
  option.disabled = isSoldout;

  if (isSoldout) {
    const discountText = `${onSale ? "⚡SALE" : ""}${suggestSale ? "💝추천" : ""}`;
    option.textContent = `${name} - ${price}원 (품절) ${discountText}`;
    option.className = "text-gray-400";
    return option;
  }

  if (onSale && suggestSale) {
    option.textContent = `⚡💝${name} - ${originalPrice}원 → ${price}원 (25% SUPER SALE!)`;
    option.className = "text-purple-600 font-bold";
    return option;
  }

  if (onSale) {
    option.textContent = `⚡${name} - ${originalPrice}원 → ${price}원 (20% SALE!)`;
    option.className = "text-red-500 font-bold";
    return option;
  }

  if (suggestSale) {
    option.textContent = `💝${name} - ${originalPrice}원 → ${price}원 (5% 추천할인!)`;
    option.className = "text-blue-500 font-bold";
    return option;
  }

  option.textContent = `${name} - ${price}원`;
  return option;
};
