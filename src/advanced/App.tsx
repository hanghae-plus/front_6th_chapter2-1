import React from 'react';
import { Header } from './components/Header';
import { GridContainer } from './components/GridContainer';
import { ManualOverlay } from './components/ManualOverlay';
import { useCartStore } from './hooks/useCartStore';

const App: React.FC = () => {
  const {
    products,
    cartItems,
    cartTotals,
    bonusPoints,
    stockWarnings,
    addToCart,
    updateQuantity,
    removeFromCart,
  } = useCartStore();

  return (
    <div id='app'>
      <Header itemCount={cartTotals.itemCount} />
      <GridContainer
        products={products}
        cartItems={cartItems}
        stockWarnings={stockWarnings}
        cartTotals={cartTotals}
        bonusPoints={bonusPoints}
        onAddToCart={addToCart}
        onQuantityChange={updateQuantity}
        onRemoveItem={removeFromCart}
      />
      <ManualOverlay />
    </div>
  );
};

export default App;
