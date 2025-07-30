import { useContext } from 'react';
import { cartContext } from '../../contexts/cartContext';

export function useCart() {
  const context = useContext(cartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
