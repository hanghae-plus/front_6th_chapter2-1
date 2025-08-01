import { productList } from '@basic/features/product/constants';
import { getProductOptionStyle, getSalesInfoText, isOutOfStock } from '@basic/features/product/service';

const ProductSelector = () => {
  return (
    <select className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3" id="product-select">
      {productList.map((product) => (
        <option
          key={product.id}
          className={getProductOptionStyle(product)}
          value={product.id}
          disabled={isOutOfStock(product)}
        >
          {getSalesInfoText(product)}
        </option>
      ))}
    </select>
  );
};

export default ProductSelector;
