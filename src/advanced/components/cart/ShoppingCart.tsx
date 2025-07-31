import { useCart } from '../../contexts/CartContext';
import { Product } from '../../lib/product';
import ProductPicker from './ProductPicker';

const ShoppingCart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (productId: string, change: number) => {
    const item = cartItems.find((item) => item.product.id === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  const getProductDisplayName = (product: Product) => {
    let icon = '';
    if (product.lightningSale && product.recommendationSale) {
      icon = '⚡💝';
    } else if (product.lightningSale) {
      icon = '⚡';
    } else if (product.recommendationSale) {
      icon = '💝';
    }
    return `${icon}${product.name}`;
  };

  const getPriceDisplay = (product: Product) => {
    const originalPrice = product.price;
    const discountedPrice = Math.round(product.price * (1 - product.discount));

    if (product.lightningSale || product.recommendationSale) {
      let colorClass = '';
      if (product.lightningSale && product.recommendationSale) {
        colorClass = 'text-purple-600';
      } else if (product.lightningSale) {
        colorClass = 'text-red-500';
      } else if (product.recommendationSale) {
        colorClass = 'text-blue-500';
      }

      return (
        <>
          <span className="line-through text-gray-400">₩{originalPrice.toLocaleString()}</span>{' '}
          <span className={colorClass}>₩{discountedPrice.toLocaleString()}</span>
        </>
      );
    }

    return `₩${originalPrice.toLocaleString()}`;
  };

  const getTotalPriceDisplay = (product: Product, quantity: number) => {
    const originalTotal = product.price * quantity;
    const discountedTotal = Math.round(product.price * (1 - product.discount) * quantity);

    if (product.lightningSale || product.recommendationSale) {
      let colorClass = '';
      if (product.lightningSale && product.recommendationSale) {
        colorClass = 'text-purple-600';
      } else if (product.lightningSale) {
        colorClass = 'text-red-500';
      } else if (product.recommendationSale) {
        colorClass = 'text-blue-500';
      }

      return (
        <>
          <span className="line-through text-gray-400">₩{originalTotal.toLocaleString()}</span>{' '}
          <span className={colorClass}>₩{discountedTotal.toLocaleString()}</span>
        </>
      );
    }

    return `₩${originalTotal.toLocaleString()}`;
  };

  return (
    <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
      <ProductPicker />
      <div id="cart-items">
        {cartItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">장바구니가 비어있습니다.</div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.product.id}
              id={item.product.id}
              className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
            >
              <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45" />
              </div>
              <div>
                <h3 className="text-base font-normal mb-1 tracking-tight">
                  {getProductDisplayName(item.product)}
                </h3>
                <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
                <p className="text-xs text-black mb-3">{getPriceDisplay(item.product)}</p>
                <div className="flex items-center gap-4">
                  <button
                    className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
                    data-product-id={item.product.id}
                    data-change="-1"
                    onClick={() => handleQuantityChange(item.product.id, -1)}
                  >
                    −
                  </button>
                  <span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
                    data-product-id={item.product.id}
                    data-change="1"
                    onClick={() => handleQuantityChange(item.product.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg mb-2 tracking-tight tabular-nums">
                  {getTotalPriceDisplay(item.product, item.quantity)}
                </div>
                <button
                  className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
                  data-product-id={item.product.id}
                  onClick={() => handleRemoveItem(item.product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
