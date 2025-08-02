import CartProduct from '@advanced/components/CartProduct';
import Header from '@advanced/components/Header';
import ProductSelector from '@advanced/components/ProductSelector';
import Summary from '@advanced/components/Summary';
import { type Product } from '@advanced/feature/product/type';
import useCart from '@advanced/hooks/useCart';
import useProduct from '@advanced/hooks/useProduct';
import { applyLightningSale, applySuggestSale, getStockInfo } from '@basic/features/product/service';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';

const App = () => {
  const { products, isOutOfProductStock, updateProduct } = useProduct();
  const { cart, addCart, removeCart, updateCartProduct } = useCart();
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id ?? '');
  const lastSelectedIdRef = useRef('');

  const totalCart = cart.reduce((acc, cur) => (acc += cur.quantity), 0);

  const handleSelectProduct = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(e.target.value);
  };

  const handleAddToCart = () => {
    const selectedProduct = products.find((product) => product.id === selectedProductId);

    if (!selectedProduct) {
      return;
    }

    if (isOutOfProductStock(selectedProduct)) {
      return;
    }

    const cartProduct = cart.find((cartProduct) => cartProduct.id === selectedProduct.id);

    if (!cartProduct) {
      addCart(selectedProduct);
      updateProduct(selectedProduct.id, (prev) => ({ quantity: prev.quantity - 1 }));
    } else {
      updateCartProduct(cartProduct.id, (prev) => ({ quantity: prev.quantity + 1 }));
      updateProduct(selectedProduct.id, (prev) => ({ quantity: prev.quantity - 1 }));
    }

    lastSelectedIdRef.current = selectedProduct.id;
  };

  const handleIncrease = (cartProduct: Product) => {
    const product = products.find((product) => product.id === cartProduct.id);

    if (product?.quantity === 0) {
      alert('재고가 부족합니다.');

      return;
    }

    updateCartProduct(cartProduct.id, (prev) => ({ quantity: prev.quantity + 1 }));
    updateProduct(cartProduct.id, (prev) => ({ quantity: prev.quantity - 1 }));
  };

  const handleDecrease = (cartProduct: Product) => {
    if (cartProduct.quantity === 1) {
      handleRemove(cartProduct);

      return;
    }

    updateCartProduct(cartProduct.id, (prev) => ({ quantity: prev.quantity - 1 }));
    updateProduct(cartProduct.id, (prev) => ({ quantity: prev.quantity + 1 }));
  };

  const handleRemove = (cartProduct: Product) => {
    removeCart(cartProduct);
    updateProduct(cartProduct.id, (prev) => ({ quantity: prev.quantity + cartProduct.quantity }));
  };

  useEffect(() => {
    const lightningSaleTimer = setTimeout(() => {
      setInterval(function () {
        const lightningSale = applyLightningSale(products);

        if (lightningSale) {
          alert(lightningSale.message);

          updateProduct(lightningSale.updatedProduct.id, (el) => ({
            ...el,
            value: lightningSale.updatedProduct.value,
            onSale: lightningSale.updatedProduct.onSale,
          }));
          updateCartProduct(lightningSale.updatedProduct.id, (el) => ({
            ...el,
            value: lightningSale.updatedProduct.value,
            onSale: lightningSale.updatedProduct.onSale,
          }));
        }
      }, 30000);
    }, Math.random() * 10000);

    const suggestSaleTimer = setTimeout(function () {
      setInterval(function () {
        if (lastSelectedIdRef) {
          const suggestSale = applySuggestSale(products, lastSelectedIdRef);

          if (suggestSale) {
            alert(suggestSale.message);

            updateProduct(suggestSale.updatedProduct.id, (el) => ({
              ...el,
              value: suggestSale.updatedProduct.value,
              suggestSale: suggestSale.updatedProduct.suggestSale,
            }));
            updateCartProduct(suggestSale.updatedProduct.id, (el) => ({
              ...el,
              value: suggestSale.updatedProduct.value,
              suggestSale: suggestSale.updatedProduct.suggestSale,
            }));
          }
        }
      }, 60000);
    }, Math.random() * 20000);

    return () => {
      clearTimeout(lightningSaleTimer);
      clearTimeout(suggestSaleTimer);
    };
  }, []);

  return (
    <>
      <Header>
        <p id="item-count" className="text-sm text-gray-500 font-normal mt-3">
          {`🛍️ ${totalCart} items in cart`}
        </p>
      </Header>
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
            {/* stockInfo */}
            <div className="text-xs text-red-500 mt-3 whitespace-pre-line" id="stock-status">
              {products.map(getStockInfo).filter(Boolean).join('\n')}
            </div>
          </div>
          {/* cartContainerEl */}
          <div id="cart-items">
            {cart.map((cartProduct) => (
              <CartProduct
                key={cartProduct.id}
                product={cartProduct}
                onIncrease={() => handleIncrease(cartProduct)}
                onDecrease={() => handleDecrease(cartProduct)}
                onRemove={() => handleRemove(cartProduct)}
              />
            ))}
          </div>
        </div>
        {/* rightColumn */}
        <div className="bg-black text-white p-8 flex flex-col">
          <Summary />
        </div>
      </div>
    </>
  );
};

export default App;
