function getOptionMeta({
  name,
  price,
  originalPrice,
  isSoldOut,
  onSale,
  suggestSale,
}: {
  name: string;
  price: number;
  originalPrice: number;
  isSoldOut: boolean;
  onSale: boolean;
  suggestSale: boolean;
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

interface Props {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  onSale: boolean;
  suggestSale: boolean;
}

export const ProductOption = ({
  id,
  name,
  price,
  originalPrice,
  quantity,
  onSale,
  suggestSale,
}: Props) => {
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
