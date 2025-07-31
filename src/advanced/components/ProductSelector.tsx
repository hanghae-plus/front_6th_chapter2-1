import { Product } from '../types';

interface ProductSelectorProps {
  products: Product[];
  selectedProduct: string;
  onProductSelect: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProduct,
  onProductSelect,
  onAddToCart
}) => {
  // 원본과 동일한 재고 상태 계산 (고정)
  const totalStock = products.reduce((sum, product) => sum + product.q, 0);
  const lowStockProducts = products.filter(product => product.q < 5 && product.q > 0);
  const outOfStockProducts = products.filter(product => product.q === 0);

  // 디버깅을 위한 콘솔 로그
  const stockStatusText = [
    ...lowStockProducts.map(p => `${p.name}: 재고 부족 (${p.q}개 남음)`),
    ...outOfStockProducts.map(p => `${p.name}: 품절`)
  ].join('\n');
  
  console.log('ProductSelector rendered:', { 
    totalStock, 
    lowStockProducts: lowStockProducts.map(p => ({ name: p.name, q: p.q })),
    outOfStockProducts: outOfStockProducts.map(p => ({ name: p.name, q: p.q })),
    allProducts: products.map(p => ({ name: p.name, q: p.q })),
    stockStatusText,
    hasLowStock: lowStockProducts.length > 0,
    hasOutOfStock: outOfStockProducts.length > 0
  });

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        id="product-select"
        className={`w-full p-3 border border-gray-300 rounded-lg text-base mb-3 ${
          totalStock < 50 ? 'border-orange-500' : ''
        }`}
        value={selectedProduct}
        onChange={(e) => {
          console.log('Product selected:', e.target.value);
          onProductSelect(e.target.value);
        }}
      >

        {products.map((product) => {
          let discountText = '';
          if (product.onSale) discountText += ' ⚡SALE';
          if (product.suggestSale) discountText += ' 💝추천';

          if (product.q === 0) {
            return (
              <option key={product.id} value={product.id} disabled className="text-gray-400">
                {product.name} - {product.val}원 (품절){discountText}
              </option>
            );
          }

          let optionText = '';
          let optionClassName = '';

          if (product.onSale && product.suggestSale) {
            optionText = `⚡💝${product.name} - ${product.originalVal}원 → ${product.val}원 (25% SUPER SALE!)`;
            optionClassName = 'text-purple-600 font-bold';
          } else if (product.onSale) {
            optionText = `⚡${product.name} - ${product.originalVal}원 → ${product.val}원 (20% SALE!)`;
            optionClassName = 'text-red-500 font-bold';
          } else if (product.suggestSale) {
            optionText = `💝${product.name} - ${product.originalVal}원 → ${product.val}원 (5% 추천할인!)`;
            optionClassName = 'text-blue-500 font-bold';
          } else {
            optionText = `${product.name} - ${product.val}원${discountText}`;
          }

          return (
            <option key={product.id} value={product.id} className={optionClassName}>
              {optionText}
            </option>
          );
        })}
      </select>

      <button
        id="add-to-cart"
        data-testid="add-to-cart"
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
        onClick={() => {
          console.log('Add to cart clicked:', selectedProduct);
          // 원본과 동일하게 선택된 상품이 없으면 첫 번째 상품을 사용
          const productToAdd = selectedProduct || products[0]?.id;
          if (productToAdd) {
            onAddToCart(productToAdd);
          }
        }}
        disabled={false}
      >
        Add to Cart
      </button>

      <div id="stock-status" data-testid="stock-status" className="text-xs text-red-500 mt-3 whitespace-pre-line">
        {/* 재고 부족 상품 */}
        {lowStockProducts.map(product => 
          `${product.name}: 재고 부족 (${product.q}개 남음)`
        ).join('\n')}
        {/* 재고 부족과 품절 사이 줄바꿈 */}
        {lowStockProducts.length > 0 && outOfStockProducts.length > 0 && '\n'}
        {/* 품절 상품 */}
        {outOfStockProducts.map(product => 
          `${product.name}: 품절`
        ).join('\n')}
      </div>
    </div>
  );
}; 