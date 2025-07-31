import { useCartState, useCartDispatch } from '../../../contexts/CartContext';
import type { Product } from '../../../reducer';

interface CartItemProps {
  productId: string;
  quantity: number;
}

const PriceDisplay = ({ product }: { product: Product }) => {
  if (!product.onSale && !product.suggestSale) {
    return <>{`₩${product.price}`}</>;
  }

  const colorClass =
    product.onSale && product.suggestSale
      ? 'text-purple-600'
      : product.onSale
        ? 'text-red-500'
        : 'text-blue-500';

  return (
    <>
      <span className='line-through text-gray-400'>{`₩${product.originalPrice}`}</span>
      <span className={`ml-2 ${colorClass}`}>{`₩${product.price}`}</span>
    </>
  );
};

export const CartItem = ({ productId, quantity }: CartItemProps) => {
  const state = useCartState();
  const dispatch = useCartDispatch();

  const product = state?.products.find((p) => p.id === productId);

  if (!product) return null;

  const handleIncrease = () => {
    dispatch?.({ type: 'INCREASE_QUANTITY', payload: { productId } });
  };
  const handleDecrease = () => {
    dispatch?.({ type: 'DECREASE_QUANTITY', payload: { productId } });
  };
  const handleRemove = () => {
    dispatch?.({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  const saleIcon =
    product.onSale && product.suggestSale
      ? '⚡💝'
      : product.onSale
        ? '⚡'
        : product.suggestSale
          ? '💝'
          : '';

  return (
    <div
      className='grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0'
      id={product.id}
    >
      <div className='w-20 h-20 bg-gradient-black relative overflow-hidden'>
        <div className='absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45'></div>
      </div>
      <div>
        <h3 className='text-base font-normal mb-1 tracking-tight'>
          {saleIcon && `${saleIcon} `}
          {product.name}
        </h3>
        <p className='text-xs text-gray-500 mb-0.5 tracking-wide'>PRODUCT</p>
        <p className='text-xs text-black mb-3'>
          <PriceDisplay product={product} />
        </p>
        <div className='flex items-center gap-4'>
          <button
            className='quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white'
            data-product-id={product.id}
            onClick={handleDecrease}
          >
            −
          </button>
          <span className='quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums'>
            {quantity}
          </span>
          <button
            className='quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white'
            data-product-id={product.id}
            onClick={handleIncrease}
          >
            +
          </button>
        </div>
      </div>
      <div className='text-right'>
        <div className='text-lg mb-2 tracking-tight tabular-nums'>
          <PriceDisplay product={product} />
        </div>
        <a
          className='remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black'
          data-product-id={product.id}
          onClick={handleRemove}
        >
          Remove
        </a>
      </div>
    </div>
  );
};
