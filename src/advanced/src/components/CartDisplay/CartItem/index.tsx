import { useCart } from '../../../hooks/useCart';
import PriceDisplay from './PriceDisplay';
import QuantityControls from './QuantityControls';

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
      {/* thumbnail */}
      <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>

      <div>
        {/* title */}
        <h3 className="text-base font-normal mb-1 tracking-tight">
          {saleIcon}
          {name}
        </h3>
        <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <PriceDisplay
          originalPrice={originalPrice}
          price={price}
          className="text-xs text-black mb-3"
        />
        <QuantityControls
          quantity={quantity}
          onQuantityChange={handleQuantityChange}
        />
      </div>
      <div className="text-right flex flex-col items-end">
        <PriceDisplay
          originalPrice={originalPrice}
          price={price}
          className="text-lg mb-2 tracking-tight tabular-nums"
        />
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
