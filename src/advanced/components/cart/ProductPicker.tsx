import { useCartContext } from '../../hooks/CartContext';

const ProductPicker = () => {
  const { products, addToCart } = useCartContext();

  const handleAddToCart = () => {
    const select = document.getElementById('product-select') as HTMLSelectElement;
    const selectedProductId = select.value;

    if (!selectedProductId) return;

    const product = products.find((p) => p.productId === selectedProductId);

    if (product && product.stock > 0) {
      addToCart(selectedProductId);
    } else {
      alert('재고가 부족합니다.');
    }
  };

  const getStockMessage = () => {
    return products
      .filter((product) => product.stock < 5)
      .map((product) =>
        product.stock === 0 ? `${product.name}: 품절` : `${product.name}: 재고 부족 (${product.stock}개 남음)`
      )
      .join('\n');
  };

  const getTotalStock = () => {
    return products.reduce((total, product) => total + product.stock, 0);
  };

  const totalAvailableStock = getTotalStock();

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        id="product-select"
        className="w-full p-3 border rounded-lg text-base mb-3"
        style={{
          borderColor: totalAvailableStock < 50 ? 'orange' : '#d1d5db',
        }}
      >
        {products.map((product) => {
          const isOutOfStock = product.stock === 0;

          return (
            <option
              key={product.productId}
              value={product.productId}
              disabled={isOutOfStock}
              className={
                isOutOfStock
                  ? 'text-gray-400'
                  : product.stock < 5
                    ? 'text-red-600 font-medium'
                    : product.isOnSale && product.isRecommended
                      ? 'text-purple-600 font-bold'
                      : product.isOnSale
                        ? 'text-red-500 font-bold'
                        : product.isRecommended
                          ? 'text-blue-500 font-bold'
                          : ''
              }
            >
              {/* 재고 경고가 최우선 */}
              {!isOutOfStock && product.stock < 5 && '⚠️ '}
              {/* 할인 아이콘들 */}
              {product.isOnSale && product.isRecommended && '⚡💝'}
              {product.isOnSale && !product.isRecommended && '⚡'}
              {!product.isOnSale && product.isRecommended && '💝'}
              {product.name} -
              {product.isOnSale || product.isRecommended ? (
                <>
                  <span style={{ textDecoration: 'line-through' }}>{product.originalPrice.toLocaleString()}원</span>
                  {' → '}
                  {product.price.toLocaleString()}원{product.isOnSale && product.isRecommended && ' (25% SUPER SALE!)'}
                  {product.isOnSale && !product.isRecommended && ' (20% SALE!)'}
                  {!product.isOnSale && product.isRecommended && ' (5% 추천할인!)'}
                </>
              ) : (
                `${product.price.toLocaleString()}원`
              )}
              {/* 재고 상태 표시 */}
              {isOutOfStock ? ' (품절)' : product.stock < 5 ? ` (재고 ${product.stock}개)` : ''}
            </option>
          );
        })}
      </select>
      <button
        onClick={handleAddToCart}
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
      >
        Add to Cart
      </button>
      <div className="text-xs text-red-500 mt-3 whitespace-pre-line">{getStockMessage()}</div>
    </div>
  );
};

export default ProductPicker;
