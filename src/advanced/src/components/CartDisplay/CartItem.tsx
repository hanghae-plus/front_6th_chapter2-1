import { useCart } from '../../hooks/useCart';

interface CartItemProps {
  id: string;
  name: string;
  originalPrice: number;
  price: number;
  quantity: number;
  saleIcon?: string;
}

export default function CartItem({
  id,
  name,
  originalPrice,
  price,
  quantity,
  saleIcon = '',
}: CartItemProps) {
  const { dispatch } = useCart();

  const formatPrice = (price: number) => `₩${price.toLocaleString()}`;

  const getPriceColor = (originalPrice: number, price: number) => {
    const discount = ((originalPrice - price) / originalPrice) * 100;
    if (discount >= 20) return 'text-purple-600';
    if (discount >= 15) return 'text-red-500';
    return 'text-blue-500';
  };

  const handleQuantityChange = (change: number) => {
    dispatch({
      type: 'ADJUST_QUANTITY',
      payload: { productId: id, quantity: change },
    });
  };

  const handleRemoveItem = () => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { productId: id, quantity: 0 },
    });
  };

  return (
    <div
      id={id}
      className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 className="text-base font-normal mb-1 tracking-tight">
          {saleIcon}
          {name}
        </h3>
        <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p className="text-xs text-black mb-3">
          <span className="line-through text-gray-400">
            {formatPrice(originalPrice)}
          </span>{' '}
          <span className={getPriceColor(originalPrice, price)}>
            {formatPrice(price)}
          </span>
        </p>
        <div className="flex items-center gap-4">
          <button
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            onClick={() => handleQuantityChange(-1)}
          >
            −
          </button>
          <span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">
            {quantity}
          </span>
          <button
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            onClick={() => handleQuantityChange(1)}
          >
            +
          </button>
        </div>
      </div>
      <div className="text-right">
        <div
          className="text-lg mb-2 tracking-tight tabular-nums"
          style={{ fontWeight: 'normal' }}
        >
          <span className="line-through text-gray-400">
            {formatPrice(originalPrice)}
          </span>{' '}
          <span className={getPriceColor(originalPrice, price)}>
            {formatPrice(price)}
          </span>
        </div>
        <button
          className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
          onClick={handleRemoveItem}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
