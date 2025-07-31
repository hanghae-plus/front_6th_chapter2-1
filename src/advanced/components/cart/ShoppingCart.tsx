import ProductPicker from './ProductPicker';
import { useCart } from '../../contexts/CartContext';

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

  const calculateItemPrice = (item: any) => {
    const originalPrice = item.product.price * item.quantity;
    const discountedPrice = originalPrice * (1 - item.product.discount);
    return { originalPrice, discountedPrice };
  };

  return (
    <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
      <ProductPicker />
      <div id="cart-items">
        {cartItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">장바구니가 비어있습니다.</div>
        ) : (
          cartItems.map((item) => {
            const { originalPrice, discountedPrice } = calculateItemPrice(item);
            return (
              <div
                key={item.product.id}
                className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
              >
                <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45" />
                </div>
                <div>
                  <h3 className="text-base font-normal mb-1 tracking-tight">{item.product.name}</h3>
                  <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
                  <p className="text-xs text-black mb-3">₩{item.product.price.toLocaleString()}</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQuantityChange(item.product.id, -1)}
                      className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.product.id, 1)}
                      className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg mb-2 tracking-tight tabular-nums">
                    <span className="line-through text-gray-400">
                      ₩{originalPrice.toLocaleString()}
                    </span>{' '}
                    <span className="text-purple-600">
                      ₩{Math.round(discountedPrice).toLocaleString()}
                    </span>
                  </div>
                  <button
                    className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
                    onClick={() => handleRemoveItem(item.product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
