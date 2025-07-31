import { useCartStore, useProductStore } from '../../store';
import { findProductById } from '../../utils/product';
import { updateStockQuantity } from '../../utils/stock';

export const AddToCartButton = () => {
  const { addItem } = useCartStore();
  const { selectedProduct, products, updateProducts } = useProductStore();

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const product = findProductById(products, selectedProduct);
    if (!product || product.quantity <= 0) return;

    // 장바구니에 추가
    addItem({
      id: product.id,
      name: product.name,
      val: product.val,
      originalVal: product.originalVal,
      quantity: 1,
      onSale: product.onSale,
      suggestSale: product.suggestSale,
    });

    // 재고 감소
    updateStockQuantity(products, product.id, -1);
    updateProducts([...products]);
  };

  return (
    <button
      id='add-to-cart'
      className='w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
      onClick={handleAddToCart}
      disabled={!selectedProduct}
    >
      Add to Cart
    </button>
  );
};
