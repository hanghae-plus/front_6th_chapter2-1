// hooks/useCartWithProduct.ts
import { Product } from '@/data/product';
import { useCartContext } from '@/store/CartContext';
import { useProductContext } from '@/store/ProductContext';

export const useCartWithProduct = () => {
  const { items, addItem, removeItem, changeQuantity, getQuantityByProductId } = useCartContext();
  const { updateProduct, getProductById } = useProductContext();

  const enrichedItems = items.map((item) => {
    // 좀 더 안전하게 처리할 방법 있는지 찾아보기
    const product = getProductById(item.productId) as Product;
    return { ...product, quantity: item.quantity };
  });

  const addToCart = (productId: string) => {
    const product = getProductById(productId);

    if (!product || product.quantity <= 0) {
      alert('재고가 부족합니다.');
      return;
    }

    const currentQuantityInCart = getQuantityByProductId(productId);
    const totalAvailable = product.quantity + currentQuantityInCart;

    if (currentQuantityInCart + 1 <= totalAvailable) {
      if (currentQuantityInCart > 0) {
        changeQuantity(productId, 1);
      } else {
        addItem(productId);
      }
      updateProduct(productId, { quantity: product.quantity - 1 });
    } else {
      alert('재고가 부족합니다.');
    }
  };

  const updateCartItemQuantity = (productId: string, delta: number) => {
    const product = getProductById(productId) as Product;
    const currentQuantity = getQuantityByProductId(productId);

    const newQuantity = currentQuantity + delta;

    if (newQuantity > 0 && newQuantity <= product.quantity + currentQuantity) {
      changeQuantity(productId, delta);
      updateProduct(productId, { quantity: product.quantity - delta });
    } else if (newQuantity <= 0) {
      removeItem(productId);
      updateProduct(productId, { quantity: product.quantity + currentQuantity });
    } else {
      alert('재고가 부족합니다.');
    }
  };

  const removeFromCart = (productId: string) => {
    const product = getProductById(productId);
    const currentQuantity = getQuantityByProductId(productId);

    removeItem(productId);
    if (product) {
      updateProduct(productId, { quantity: product.quantity + currentQuantity });
    }
  };

  return {
    cartItems: enrichedItems,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
  };
};
