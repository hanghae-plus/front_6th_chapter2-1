import { type Product } from '@advanced/feature/product/type';
import { useState } from 'react';

const useCart = () => {
  const [cart, setCart] = useState<Product[]>([]);

  const addCart = (product: Product) => {
    setCart((prev) => [...prev, { ...product, quantity: 1 }]);
  };

  const removeCart = (product: Product) => {
    setCart((prev) => prev.filter((el) => el.id !== product.id));
  };

  const updateCartProduct = (cartProductId: string, callback: (prevCartProduct: Product) => Partial<Product>) => {
    setCart((prev) =>
      prev.map((el) => {
        if (el.id === cartProductId) {
          const updated = callback(el);

          return { ...el, ...updated };
        }

        return el;
      })
    );
  };

  const isOutOfCartProductStock = (product: Product) => product.quantity === 0;

  const findCartProduct = (productId: string) => cart.find((product) => product.id === productId);

  return {
    cart,
    isOutOfCartProductStock,
    updateCartProduct,
    addCart,
    removeCart,
    findCartProduct,
  };
};

export default useCart;
