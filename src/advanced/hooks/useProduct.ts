import { productList } from '@advanced/feature/product/constant';
import { type Product } from '@advanced/feature/product/type';
import { useState } from 'react';

const useProduct = () => {
  const [products, setProducts] = useState<Product[]>(productList);

  const updateProduct = (productId: string, callback: (prevProduct: Product) => Partial<Product>) => {
    setProducts((prev) =>
      prev.map((el) => {
        if (el.id === productId) {
          const updated = callback(el);

          return { ...el, ...updated };
        }

        return el;
      })
    );
  };

  const isOutOfProductStock = (product: Product) => product.quantity === 0;

  const findProduct = (productId: string) => products.find((product) => product.id === productId);

  return {
    products,
    isOutOfProductStock,
    updateProduct,
    findProduct,
  };
};

export default useProduct;
