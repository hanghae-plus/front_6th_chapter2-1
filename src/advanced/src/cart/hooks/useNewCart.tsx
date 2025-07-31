import { Product } from 'types';
import { getCartTotals } from 'cart/utils';
import { getStockStatus } from 'product/utils';
import { useProductInventory } from 'product/hooks';
import { useCartItems } from './useCartItems';
import { useCartActions } from './useCartActions';

interface UseNewCartProps {
  initialProducts: Product[];
}

export function useNewCart({ initialProducts }: UseNewCartProps) {
  const { products, updateStock, updateSaleStatus, getProduct } =
    useProductInventory(initialProducts);
  const {
    cartItems,
    addItem,
    removeItem,
    updateItemQuantity,
    getItemQuantity,
    clearCart,
  } = useCartItems(products);

  const totals = getCartTotals(cartItems);
  const stockStatus = getStockStatus(products);

  const { addToCart, handleRemove, handleQuantityChange } = useCartActions({
    products,
    getProduct,
    updateStock,
    addItem,
    removeItem,
    updateItemQuantity,
    getItemQuantity,
  });

  return {
    products,
    getProduct,
    cartItems,
    getItemQuantity,
    cartTotal: totals.cartTotal,
    loyaltyPoints: totals.loyaltyPoints,
    discountInfo: totals.discountInfo,
    stockStatus,
    addToCart,
    handleRemove,
    handleQuantityChange,
    updateSaleStatus,
    clearCart,
  };
}
