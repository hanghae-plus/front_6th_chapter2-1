import { useAppContext } from '../../context/AppContext';
import { Product } from '../../types/product.types';
import { Filter } from './Filter';
import { ProductGrid } from './ProductGrid';
import { ProductHeader } from './ProductHeader';

export const ProductSelector = () => {
  const { product, cart } = useAppContext();

  const handleAddToCart = (productItem: Product) => {
    if (productItem.stock > 0) {
      cart.addToCart(productItem, 1);
    }
  };

  const handleCategoryChange = (category: string) => {
    product.setCategory(category === 'all' ? null : category);
  };

  const handleSearchChange = (term: string) => {
    product.setSearchTerm(term);
  };

  return (
    <div className='product-selector'>
      <ProductHeader
        totalProducts={product.totalProducts}
        filteredCount={product.products.length}
      />

      <Filter
        categories={product.availableCategories}
        selectedCategory={product.selectedCategory ?? 'all'}
        onCategoryChange={handleCategoryChange}
        searchTerm={product.searchTerm}
        onSearchChange={handleSearchChange}
      />

      <ProductGrid products={product.products} onAddToCart={handleAddToCart} />
    </div>
  );
};
