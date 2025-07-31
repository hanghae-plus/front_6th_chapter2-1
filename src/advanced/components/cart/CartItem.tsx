import { CartItemProps } from '../../types';

const CartItem = ({ cartItem, product, onQuantityChange, onRemove }: CartItemProps) => {
  const getProductIcon = () => {
    if (product.isOnSale && product.isRecommended) return '⚡💝';
    if (product.isOnSale) return '⚡';
    if (product.isRecommended) return '��';
    return '';
  };

  const getStockStatus = () => {
    if (product.stock === 0) return ' 🚫';
    if (product.stock < 5) return ' ⚠️';
    return '';
  };

  const getStockMessage = () => {
    if (product.stock === 0) return ' • 품절';
    if (product.stock < 5) return ` • 재고 부족 (${product.stock}개)`;
    return '';
  };

  const getPriceDisplay = () => {
    if (product.isOnSale || product.isRecommended) {
      return (
        <>
          <span className="line-through text-gray-400">₩{product.originalPrice.toLocaleString()}</span>{' '}
          <span
            className={
              product.isOnSale && product.isRecommended
                ? 'text-purple-600'
                : product.isOnSale
                  ? 'text-red-500'
                  : 'text-blue-500'
            }
          >
            ₩{product.price.toLocaleString()}
          </span>
        </>
      );
    }
    return <span className="text-black">₩{product.price.toLocaleString()}</span>;
  };

  const getTotalPriceDisplay = () => {
    if (product.isOnSale || product.isRecommended) {
      return (
        <>
          <span className="line-through text-gray-400">
            ₩{(product.originalPrice * cartItem.quantity).toLocaleString()}
          </span>{' '}
          <span
            className={
              product.isOnSale && product.isRecommended
                ? 'text-purple-600'
                : product.isOnSale
                  ? 'text-red-500'
                  : 'text-blue-500'
            }
          >
            ₩{(product.price * cartItem.quantity).toLocaleString()}
          </span>
        </>
      );
    }
    return `₩${(product.price * cartItem.quantity).toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0 hover:bg-gray-50 transition-colors">
      <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45" />
      </div>
      <div>
        <h3
          className={`text-base mb-1 tracking-tight ${cartItem.quantity >= 10 ? 'font-bold' : 'font-normal'} ${product.stock < 5 ? 'text-red-600' : ''}`}
        >
          {getProductIcon()}
          {product.name}
          {getStockStatus()}
        </h3>
        <p className={`text-xs mb-0.5 tracking-wide ${product.stock < 5 ? 'text-red-500' : 'text-gray-500'}`}>
          PRODUCT{getStockMessage()}
        </p>
        <p className="text-xs mb-3">{getPriceDisplay()}</p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onQuantityChange(cartItem.productId, -1)}
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white hover:scale-110"
          >
            -
          </button>
          <span className="text-sm font-normal min-w-[20px] text-center tabular-nums">{cartItem.quantity}</span>
          <button
            onClick={() => onQuantityChange(cartItem.productId, 1)}
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white hover:scale-110"
          >
            +
          </button>
        </div>
      </div>
      <div className="text-right">
        <div
          className={`text-lg mb-2 tracking-tight tabular-nums ${cartItem.quantity >= 10 ? 'font-bold' : 'font-normal'}`}
        >
          {getTotalPriceDisplay()}
        </div>
        <a
          onClick={() => onRemove(cartItem.productId)}
          className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
        >
          Remove
        </a>
      </div>
    </div>
  );
};

export default CartItem;
