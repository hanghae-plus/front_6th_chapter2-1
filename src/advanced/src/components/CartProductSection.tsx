import { findProductById } from '../lib/findProductById';
import type { CartProduct, Product } from '../type';
import CartProductItem from './CartProductItem';

interface CartProductSectionProps {
  productList: Product[];
  cartList: CartProduct[];
}

export const CartProductSection = ({ productList, cartList }: CartProductSectionProps) => {
  return (
    <div>
      {cartList.map((item) => {
        const product = findProductById(productList, item.id);
        if (!product) return null;

        return (
          <CartProductItem
            key={product.id}
            product={product}
            count={item.count}
            // onChangeQuantity={}
            // onRemove={}
          />
        );
      })}
    </div>
  );
};

export default CartProductSection;
