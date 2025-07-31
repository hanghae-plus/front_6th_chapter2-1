function getOptionMeta({
  name,
  price,
  originalPrice,
  isSoldOut,
  onSale,
  suggestSale,
}) {
  switch (true) {
    case isSoldOut:
      return {
        label: `${name} - ${price}원 (품절) ${onSale ? "⚡SALE" : ""}${suggestSale ? "💝추천" : ""}`,
        className: "text-gray-400",
      };
    case onSale && suggestSale:
      return {
        label: `⚡💝${name} - ${originalPrice}원 → ${price}원 (25% SUPER SALE!)`,
        className: "text-purple-600 font-bold",
      };
    case onSale:
      return {
        label: `⚡${name} - ${originalPrice}원 → ${price}원 (20% SALE!)`,
        className: "text-red-500 font-bold",
      };
    case suggestSale:
      return {
        label: `💝${name} - ${originalPrice}원 → ${price}원 (5% 추천할인!)`,
        className: "text-blue-500 font-bold",
      };
    default:
      return {
        label: `${name} - ${price}원`,
      };
  }
}

export const ProductOption = ({
  id,
  name,
  price,
  originalPrice,
  quantity,
  onSale,
  suggestSale,
}) => {
  const isSoldOut = quantity === 0;
  const { label, className } = getOptionMeta({
    isSoldOut,
    name,
    onSale,
    originalPrice,
    price,
    suggestSale,
  });

  return (
    <option
      key={`product-option-${id}`}
      value={id}
      disabled={isSoldOut}
      className={className}
    >
      {label}
    </option>
  );
};
