import { Product } from '../types';
import { 
  calculateTotalStock, 
  getLowStockProducts, 
  getOutOfStockProducts, 
  extractProductInfo,
  generateStockStatusMessage 
} from '../utils';

interface ProductSelectorProps {
  products: Product[];
  selectedProduct: string;
  handleProductSelect: (productId: string) => void;
  handleAddToCart: (productId: string) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProduct,
  handleProductSelect,
  handleAddToCart
}) => {
  // 원본과 동일한 재고 상태 계산 (고정)
  const totalStockCount = calculateTotalStock(products);
  const lowStockProductList = getLowStockProducts(products);
  const outOfStockProductList = getOutOfStockProducts(products);

  // 디버깅을 위한 콘솔 로그
  const stockStatusMessage = generateStockStatusMessage(products);
  
      console.log('ProductSelector rendered:', { 
      totalStockCount, 
      lowStockProductList: extractProductInfo(lowStockProductList),
      outOfStockProductList: extractProductInfo(outOfStockProductList),
      allProducts: extractProductInfo(products),
      stockStatusMessage,
      hasLowStock: lowStockProductList.length > 0,
      hasOutOfStock: outOfStockProductList.length > 0
    });

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        id="product-select"
        className={`w-full p-3 border border-gray-300 rounded-lg text-base mb-3 ${
          totalStockCount < 50 ? 'border-orange-500' : ''
        }`}
        value={selectedProduct}
        onChange={(e) => {
          console.log('Product selected:', e.target.value);
          handleProductSelect(e.target.value);
        }}
      >

        {products.map((product) => {
          let discountText = '';
          if (product.hasLightningDiscount) discountText += ' ⚡SALE';
          if (product.hasRecommendationDiscount) discountText += ' 💝추천';

          if (product.quantity === 0) {
            return (
              <option key={product.id} value={product.id} disabled className="text-gray-400">
                {product.name} - {product.price}원 (품절){discountText}
              </option>
            );
          }

          let optionText = '';
          let optionClassName = '';

          if (product.hasLightningDiscount && product.hasRecommendationDiscount) {
            optionText = `⚡💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (25% SUPER SALE!)`;
            optionClassName = 'text-purple-600 font-bold';
          } else if (product.hasLightningDiscount) {
            optionText = `⚡${product.name} - ${product.originalPrice}원 → ${product.price}원 (20% SALE!)`;
            optionClassName = 'text-red-500 font-bold';
          } else if (product.hasRecommendationDiscount) {
            optionText = `💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (5% 추천할인!)`;
            optionClassName = 'text-blue-500 font-bold';
          } else {
            optionText = `${product.name} - ${product.price}원${discountText}`;
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
            handleAddToCart(productToAdd);
          }
        }}
        disabled={false}
      >
        Add to Cart
      </button>

      <div id="stock-status" data-testid="stock-status" className="text-xs text-red-500 mt-3 whitespace-pre-line">
        {/* 재고 부족 상품 */}
        {lowStockProductList.map(product => 
          `${product.name}: 재고 부족 (${product.quantity}개 남음)`
        ).join('\n')}
        {/* 재고 부족과 품절 사이 줄바꿈 */}
        {lowStockProductList.length > 0 && outOfStockProductList.length > 0 && '\n'}
        {/* 품절 상품 */}
        {outOfStockProductList.map(product => 
          `${product.name}: 품절`
        ).join('\n')}
      </div>
    </div>
  );
}; 