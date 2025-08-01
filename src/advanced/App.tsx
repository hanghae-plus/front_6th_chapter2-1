import Header from '@advanced/components/Header';
import ProductSelector from '@advanced/components/ProductSelector';
import { productList } from '@advanced/feature/product/constant';
import { type Product } from '@advanced/feature/product/type';
import { getStockInfo } from '@basic/features/product/service';
import { type ChangeEvent, useState } from 'react';

const App = () => {
  const [products, setProducts] = useState<Product[]>(productList);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id ?? '');
  const [cart, setCart] = useState<Product[]>([]);

  const handleSelectProduct = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(e.target.value);
  };

  const handleAddToCart = () => {
    const cartProduct = cart.find((cartProduct) => cartProduct.id === selectedProductId);
    const selectedProduct = products.find((product) => product.id === selectedProductId);

    if (!selectedProduct) {
      return;
    }

    if (selectedProduct.quantity === 0) {
      return;
    }

    if (!cartProduct) {
      setCart((prevCart) => [...prevCart, { ...selectedProduct, quantity: 1 }]);

      setProducts((prevProducts) => {
        return prevProducts.map((product) => {
          if (product.id === selectedProductId) {
            return { ...product, quantity: product.quantity - 1 };
          }

          return product;
        });
      });

      return;
    }

    setCart((prevCart) =>
      prevCart.map((product) => {
        if (product.id === selectedProductId) {
          return { ...product, quantity: product.quantity + 1 };
        }

        return product;
      })
    );

    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === selectedProductId) {
          return { ...product, quantity: product.quantity - 1 };
        }

        return product;
      })
    );
  };

  return (
    <>
      <Header />
      {/* gridContainer */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
        {/* leftColumn */}
        <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
          {/* selectorContainer */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <ProductSelector products={products} value={selectedProductId} onChange={handleSelectProduct} />
            <button
              className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
              id="add-to-cart"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <div className="text-xs text-red-500 mt-3 whitespace-pre-line" id="stock-status">
              {products.map(getStockInfo).filter(Boolean).join('\n')}
            </div>
          </div>
          {/* cartContainerEl */}
          <div id="cart-items">
            {cart.map((cartProduct) => (
              <div>{`${cartProduct.name}: ${cartProduct.quantity}`}</div>
            ))}
          </div>
        </div>
        {/* rightColumn */}
        <div className="bg-black text-white p-8 flex flex-col"></div>
      </div>
    </>
  );
};

export default App;
