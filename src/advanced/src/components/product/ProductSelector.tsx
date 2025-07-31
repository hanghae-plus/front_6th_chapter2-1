import { useProductStore } from '../../store';
import { ProductOption } from './ProductOption';

export const ProductSelector = () => {
  const { products, setSelectedProduct } = useProductStore();

  const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProduct(event.target.value || null);
  };

  return (
    <select
      id="product-select"
      className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
      onChange={handleProductChange}
    >
      <option value="">상품을 선택하세요</option>
      {products.map((product) => (
        <ProductOption key={product.id} item={product} />
      ))}
    </select>
  );
}; 