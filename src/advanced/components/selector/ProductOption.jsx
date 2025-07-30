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
    return (
      <option value={id} disabled={isSoldout} className="text-gray-400">
        {`${name} - ${price}원 (품절) ${discountText}`}
      </option>
    );
  }

  if (onSale && suggestSale) {
    return (
      <option value={id} className="text-purple-600 font-bold">
        {`⚡💝${name} - ${originalPrice}원 → ${price}원 (25% SUPER SALE!)`}
      </option>
    );
  }

  if (onSale) {
    return (
      <option value={id} className="text-red-500 font-bold">
        {`⚡${name} - ${originalPrice}원 → ${price}원 (20% SALE!)`}
      </option>
    );
  }

  if (suggestSale) {
    return (
      <option value={id} className="text-blue-500 font-bold">
        {`💝${name} - ${originalPrice}원 → ${price}원 (5% 추천할인!)`}
      </option>
    );
  }

  return <option value={id}>{`${name} - ${price}원`}</option>;
};
