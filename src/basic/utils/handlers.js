import { state, dispatch } from '../store';

const handleSelectChange = (event) => {
  const selectedId = event.target.value;
  dispatch({ type: 'SET_SELECTED_PRODUCT', payload: { productId: selectedId } });
};

const handleAddItemToCart = () => {
  const selectedId = state.selectedProductId;
  if (!selectedId) return;

  dispatch({ type: 'ADD_ITEM', payload: { productId: selectedId } });
  dispatch({ type: 'SET_LAST_SELECTED', payload: { productId: selectedId } });
};

const handleCartItemActions = (event) => {
  const button = event.target.closest('.quantity-change, .remove-item');

  if (!button) {
    return;
  }

  const { productId } = button.dataset;

  if (!productId) return;

  if (button.classList.contains('quantity-change')) {
    const change = parseInt(button.dataset.change, 10);
    if (change > 0) {
      dispatch({ type: 'INCREASE_QUANTITY', payload: { productId } });
    } else {
      dispatch({ type: 'DECREASE_QUANTITY', payload: { productId } });
    }
  }

  if (button.classList.contains('remove-item')) {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  }
};

export { handleSelectChange, handleAddItemToCart, handleCartItemActions };
