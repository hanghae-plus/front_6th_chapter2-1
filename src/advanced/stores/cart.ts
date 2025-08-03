import { create } from 'zustand';
import { useProducts } from './products';
import { safeFindById } from '../utils/find';

interface Cart {
  id: string;
  quantity: number;
}

interface CartStore {
  carts: Cart[];
  addQuantity: (params: Cart) => void;
}

export const useCart = create<CartStore>((set) => ({
  carts: [],
  addQuantity: ({ id, quantity }: Cart) => {
    set(({ carts }) => {
      const cart = safeFindById({ data: carts, id });

      if (cart) {
        return {
          carts: updateCart(carts, id, { quantity: cart.quantity + quantity }),
        };
      }

      return {
        carts: [...carts, { id, quantity }],
      };
    });
  },
}));

useCart.subscribe(({ carts }) => {
  useProducts.setState(({ products }) => {
    return {
      products: products.map((product) => {
        const cart = safeFindById({ data: carts, id: product.id });

        if (cart) {
          return {
            ...product,
            quantity: product.originalQuantity - cart.quantity,
          };
        }

        return product;
      }),
    };
  });
});

function updateCart(carts: Cart[], id: string, data: Partial<Cart>) {
  return carts
    .map((cart) => (cart.id === id ? { ...cart, ...data } : cart))
    .filter(({ quantity }) => quantity > 0);
}
