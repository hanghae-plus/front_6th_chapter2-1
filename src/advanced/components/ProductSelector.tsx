import { QUANTITY_THRESHOLDS, DISCOUNT_PERCENTAGES } from '../constants';
import { Product } from '../types';
import { 
  calculateTotalStock, 
  getLowStockProducts, 
  getOutOfStockProducts
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



  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        id="product-select"
        className={`w-full p-3 border border-gray-300 rounded-lg text-base mb-3 ${
          totalStockCount < QUANTITY_THRESHOLDS.STOCK_WARNING ? 'border-orange-500' : ''
        }`}
        value={selectedProduct}
        onChange={(e) => {
          handleProductSelect(e.target.value);
        }}
      >

        {products.map((product) => {
          let discountText = '';
          if (product.hasLightningDiscount) discountText += ' ⚡SALE';
          if (product.hasRecommendationDiscount) discountText += ' 💝추천';

          if (product.quantity === QUANTITY_THRESHOLDS.OUT_OF_STOCK) {
            return (
              <option key={product.id} value={product.id} disabled className="text-gray-400">
                {product.name} - {product.price}원 (품절){discountText}
              </option>
            );
          }

          let optionText = '';
          let optionClassName = '';

          if (product.hasLightningDiscount && product.hasRecommendationDiscount) {
            optionText = `⚡💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (${DISCOUNT_PERCENTAGES.SUPER_SALE}% SUPER SALE!)`;
            optionClassName = 'text-purple-600 font-bold';
          } else if (product.hasLightningDiscount) {
            optionText = `⚡${product.name} - ${product.originalPrice}원 → ${product.price}원 (${DISCOUNT_PERCENTAGES.LIGHTNING_SALE}% SALE!)`;
            optionClassName = 'text-red-500 font-bold';
          } else if (product.hasRecommendationDiscount) {
            optionText = `💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (${DISCOUNT_PERCENTAGES.RECOMMENDATION}% 추천할인!)`;
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