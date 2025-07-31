interface PriceDisplayProps {
  originalPrice: number;
  price: number;
  showDiscount?: boolean;
}

export default function PriceDisplay({ originalPrice, price, showDiscount = false }: PriceDisplayProps) {
  const formatPrice = (price: number) => `₩${price.toLocaleString()}`;

  const getPriceColor = (originalPrice: number, price: number) => {
    const discount = ((originalPrice - price) / originalPrice) * 100;
    if (discount >= 20) return 'text-purple-600';
    if (discount >= 15) return 'text-red-500';
    return 'text-blue-500';
  };

  const isOnSale = price < originalPrice;
  
  const getClassName = () => {
    if (showDiscount) {
      return 'text-lg mb-2 tracking-tight tabular-nums';
    }
    return 'text-xs text-black mb-3';
  };

  // 할인 노출하지 않는 경우 - 정가만 표시
  if (!showDiscount) {
    return <p className={getClassName()}>{formatPrice(originalPrice)}</p>;
  }

  // 할인 노출하는 경우 - 할인가가 있으면 원가/할인가, 없으면 현재가만
  if (!isOnSale) {
    return <div className={getClassName()}>{formatPrice(price)}</div>;
  }

  return (
    <div className={getClassName()}>
      <span className="line-through text-gray-400">
        {formatPrice(originalPrice)}
      </span>{' '}
      <span className={getPriceColor(originalPrice, price)}>
        {formatPrice(price)}
      </span>
    </div>
  );
}