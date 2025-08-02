import { type Product } from '@advanced/feature/product/type';

interface Props {
  product: Product;
  onRemove: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}

const CartProduct = ({ product, onRemove, onDecrease, onIncrease }: Props) => {
  const discountTag =
    product.onSale && product.suggestSale ? '⚡💝' : product.onSale ? '⚡' : product.suggestSale ? '💝' : '';

  return (
    <div
      className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
      id={product.id}
    >
      <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45" />
      </div>

      <div>
        <h3 className="text-base font-normal mb-1 tracking-tight">
          {discountTag}
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p className="text-xs text-black mb-3">{Price({ product })}</p>

        <div className="flex items-center gap-4">
          <button
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            onClick={onDecrease}
          >
            −
          </button>
          <span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">
            {product.quantity}
          </span>
          <button
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            onClick={onIncrease}
          >
            +
          </button>
        </div>
      </div>

      <div className="text-right">
        <div className="text-lg mb-2 tracking-tight tabular-nums">{Price({ product })}</div>
        <a
          className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
          onClick={onRemove}
        >
          Remove
        </a>
      </div>
    </div>
  );
};

interface PriceProps {
  product: Product;
}

const Price = ({ product }: PriceProps) => {
  const discountClass =
    product.onSale && product.suggestSale
      ? 'text-purple-600'
      : product.onSale
        ? 'text-red-500'
        : product.suggestSale
          ? 'text-blue-500'
          : '';

  if (product.onSale || product.suggestSale) {
    return (
      <>
        <span className="line-through text-gray-400">₩{product.originalValue.toLocaleString()}</span>{' '}
        <span className={discountClass}>₩{product.value.toLocaleString()}</span>
      </>
    );
  }

  return <>₩{product.value.toLocaleString()}</>;
};

export default CartProduct;
