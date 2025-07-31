import { useCartDispatch, useCartState } from '../../../contexts/CartContext';

export const AddButton = () => {
  const dispatch = useCartDispatch();
  const state = useCartState();

  const handleClick = () => {
    if (dispatch && state) {
      dispatch({ type: 'ADD_ITEM', payload: { productId: state.selectedProductId } });
    }
  };

  return (
    <button
      id='add-to-cart'
      onClick={handleClick}
      className='w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all'
    >
      Add to Cart
    </button>
  );
};
