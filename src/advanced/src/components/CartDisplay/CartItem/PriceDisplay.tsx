interface PriceDisplayProps {
  originalPrice: number;
  price: number;
  className?: string;
}

export default function PriceDisplay({ originalPrice, price, className = '' }: PriceDisplayProps) {
  const formatPrice = (price: number) => `₩${price.toLocaleString()}`;

  const getPriceColor = (originalPrice: number, price: number) => {
    const discount = ((originalPrice - price) / originalPrice) * 100;
    if (discount >= 20) return 'text-purple-600';
    if (discount >= 15) return 'text-red-500';
    return 'text-blue-500';
  };

  const isOnSale = price < originalPrice;

  if (!isOnSale) {
    return <span className={className}>{formatPrice(price)}</span>;
  }

  return (
    <span className={className}>
      <span className="line-through text-gray-400">
        {formatPrice(originalPrice)}
      </span>{' '}
      <span className={getPriceColor(originalPrice, price)}>
        {formatPrice(price)}
      </span>
    </span>
  );
}