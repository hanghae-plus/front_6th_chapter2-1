import type { Product } from '../type';

interface CartProductItemProps {
  product: Product;
  count: number;
  onChangeQuantity?: (productId: string, delta: number) => void;
  onRemove?: (productId: string) => void;
}

export const CartProductItem = ({ product, count, onChangeQuantity, onRemove }: CartProductItemProps) => {
  const { id, name, originalPrice, changedPrice, onSale, suggestSale } = product;

  const getPriceDisplay = () => {
    const priceText = (
      <>
        <span className="line-through text-gray-400">₩{originalPrice.toLocaleString()}</span>
        <span className={onSale && suggestSale ? 'text-purple-600' : onSale ? 'text-red-500' : 'text-blue-500'}>
          ₩{changedPrice.toLocaleString()}
        </span>
      </>
    );

    return onSale || suggestSale ? priceText : <>₩{changedPrice.toLocaleString()}</>;
  };

  const prefix = onSale && suggestSale ? '⚡💝' : onSale ? '⚡' : suggestSale ? '💝' : '';

  return (
    <div
      className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
      id={id}
    >
      <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45" />
      </div>

      <div>
        <h3 className="text-base font-normal mb-1 tracking-tight">
          {prefix}
          {name}
        </h3>
        <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p className="text-xs text-black mb-3">{getPriceDisplay()}</p>

        <div className="flex items-center gap-4">
          <button
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            onClick={() => onChangeQuantity?.(id, -1)}
          >
            −
          </button>
          <span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">{count}</span>
          <button
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            onClick={() => onChangeQuantity?.(id, 1)}
          >
            +
          </button>
        </div>
      </div>

      <div className="text-right">
        <div className={`text-lg mb-2 tracking-tight tabular-nums ${count >= 10 ? 'font-bold' : ''}`}>
          {getPriceDisplay()}
        </div>
        <button
          className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
          onClick={() => onRemove?.(id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartProductItem;
