import React, { useState } from 'react';

import { AddToCartButton } from './AddToCartButton';
import { ProductSelector } from './ProductSelector';
import { useCartState, useCartDispatch } from '../../../contexts/CartContext';
import { getProducts } from '../../../contexts/getters';

export const ProductSelection = () => {
  const state = useCartState();
  const dispatch = useCartDispatch();
  const products = getProducts(state);

  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(event.target.value);
  };

  const handleAddToCart = () => {
    if (!selectedProductId) return;
    dispatch({ type: 'ADD_ITEM', payload: { productId: selectedProductId } });
  };

  return (
    <>
      <ProductSelector
        products={products}
        selectedId={selectedProductId}
        onSelectChange={handleSelectChange}
      />
      <AddToCartButton onAddToCart={handleAddToCart} />
    </>
  );
};
