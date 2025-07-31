import { useRef, useState, useEffect } from 'react';
import { useCart } from '../../../hooks/useCart';
import {
  getProducts,
  addProductUpdateCallback,
  setSelectedProduct,
  type Product,
} from '../../../services/saleService';
import ProductSelect from './ProductSelect';
import ProductOption from './ProductOption';
import AddToCartButton from './AddToCartButton';
import StockStatus from './StockStatus';

export default function AddToCartForm() {
  const { dispatch } = useCart();
  const selectRef = useRef<HTMLSelectElement>(null);
  const [products, setProducts] = useState<Product[]>(getProducts());

  useEffect(() => {
    addProductUpdateCallback((updatedProducts) => {
      setProducts([...updatedProducts]);
    });
  }, []);

  const handleAddToCart = () => {
    const selected = selectRef.current?.value;
    if (!selected) return;

    const selectedProduct = products.find((p) => p.id === selected);
    if (selectedProduct && selectedProduct.quantity === 0) {
      alert('재고가 부족합니다.');
      return;
    }

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        productId: selected,
        quantity: 1,
      },
    });
  };

  const handleSelectChange = () => {
    const selected = selectRef.current?.value;
    if (selected) {
      setSelectedProduct(selected);
    }
  };

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <ProductSelect ref={selectRef} onChange={handleSelectChange}>
        {products.map((product) => (
          <ProductOption key={product.id} product={product} />
        ))}
      </ProductSelect>
      <AddToCartButton onClick={handleAddToCart} />
      <StockStatus products={products} />
    </div>
  );
}
