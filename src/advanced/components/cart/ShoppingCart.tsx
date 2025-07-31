import { useCartContext } from '../../hooks/CartContext';
import CartItem from './CartItem';
import ProductPicker from './ProductPicker';

const ShoppingCart = () => {
  const { cartItems, updateQuantity, removeFromCart, products } = useCartContext();

  const handleQuantityChange = (productId: string, change: number) => {
    const currentItem = cartItems.find((item) => item.productId === productId);
    if (currentItem) {
      updateQuantity(productId, currentItem.quantity + change);
    }
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  return (
    <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
      <ProductPicker />
      <div id="cart-items">
        {cartItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🛒</div>
            <p>장바구니가 비어있습니다.</p>
          </div>
        ) : (
          cartItems.map((cartItem) => {
            const product = products.find((p) => p.productId === cartItem.productId);
            if (!product) return null;

            return (
              <CartItem
                key={cartItem.productId}
                cartItem={cartItem}
                product={product}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
