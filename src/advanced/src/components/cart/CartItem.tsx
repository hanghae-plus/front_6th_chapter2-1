interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem = ({
  id,
  name,
  price,
  quantity,
  discount,
  onQuantityChange,
  onRemove,
}: CartItemProps) => {
  const discountedPrice = price * (1 - discount / 100);
  const totalPrice = discountedPrice * quantity;

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-500">
            ₩{price.toLocaleString()}
          </span>
          {discount > 0 && (
            <>
              <span className="text-xs text-red-500">-{discount}%</span>
              <span className="text-sm font-medium text-gray-900">
                ₩{discountedPrice.toLocaleString()}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center border border-gray-300 rounded">
          <button
            aria-label={`${name} 수량 감소`}
            onClick={() => onQuantityChange(id, Math.max(0, quantity - 1))}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
          >
            -
          </button>
          <span className="px-3 py-1 text-sm font-medium">{quantity}</span>
          <button
            aria-label={`${name} 수량 증가`}
            onClick={() => onQuantityChange(id, quantity + 1)}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
          >
            +
          </button>
        </div>

        <div className="text-right min-w-[80px]">
          <div className="font-medium">₩{totalPrice.toLocaleString()}</div>
        </div>

        <button
          aria-label={`${name} 장바구니에서 제거`}
          onClick={() => onRemove(id)}
          className="text-gray-400 hover:text-red-500"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
