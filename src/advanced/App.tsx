import { useState, useMemo, useEffect } from 'react';
import { Header } from './shared/components/Header.tsx';
import HelpModal from './shared/components/HelpModal.tsx';
import ProductSelector from './features/product/components/ProductSelector.tsx';
import CartItem from './features/cart/components/CartItem.tsx';
import OrderSummaryDetails from './features/order/components/OrderSummaryDetails.tsx';
import { ELEMENT_IDS } from './shared/constants/elementIds.ts';
import { initialProducts } from './features/product/constants/index.ts';
import { useCartStore } from './features/cart/store/cartStore.ts';
import {
  stockValidators,
  quantityManagers,
  stockManagers,
} from './features/cart/utils/stockUtils.ts';
import { calculatePoints } from './features/point/utils/pointsCalculator.ts';
import {
  generateStockStatusMessage,
  getTotalStock,
  isLowTotalStock,
} from './features/product/utils/productUtils.ts';
import {
  setupFlashSaleTimer,
  setupRecommendationTimer,
} from './features/cart/services/promotionService.ts';
import { calculateCartTotals } from './features/cart/services/cartCalculator.ts';
import { BUSINESS_CONSTANTS } from './shared/constants/business.ts';

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [selectedProductId, setSelectedProductId] = useState(
    initialProducts[0]?.id || '',
  );
  const [lastSelectedProduct, setLastSelectedProduct] = useState<string | null>(
    null,
  );

  const {
    cartItems,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    updateItemProperties,
  } = useCartStore();

  const cartCalculation = useMemo(
    () => calculateCartTotals(cartItems),
    [cartItems],
  );
  const {
    totalAmount,
    discountRate,
    savedAmount,
    isTuesday,
    hasDiscounts,
    itemDiscounts,
  } = cartCalculation;

  const { totalPoints, details, hasPoints } = useMemo(
    () => calculatePoints(cartItems, totalAmount),
    [cartItems, totalAmount],
  );

  const stockStatus = useMemo(() => {
    const message = generateStockStatusMessage(products, 5);
    const isLowStock = isLowTotalStock(products, 50);
    const totalStock = getTotalStock(products);

    return {
      message,
      isLowStock,
      totalStock,
    };
  }, [products]);

  useEffect(() => {
    const promotionCallbacks = {
      onFlashSale: (_product: any) => {
        setProducts(prevProducts => [...prevProducts]);
      },
      onSuggestSale: (_product: any) => {
        setProducts(prevProducts => [...prevProducts]);
      },
      updateProductList: () => {
        setProducts(prevProducts => [...prevProducts]);
      },
    };

    setupFlashSaleTimer(() => products, promotionCallbacks);

    setupRecommendationTimer(
      () => products,
      () => lastSelectedProduct,
      () => itemCount,
      promotionCallbacks,
    );
  }, []);

  useEffect(() => {
    cartItems.forEach(cartItem => {
      const updatedProduct = products.find(p => p.id === cartItem.id);
      if (
        updatedProduct &&
        (updatedProduct.onSale !== cartItem.onSale ||
          updatedProduct.suggestSale !== cartItem.suggestSale ||
          updatedProduct.val !== cartItem.val)
      ) {
        updateItemProperties(cartItem.id, {
          val: updatedProduct.val,
          originalVal: updatedProduct.originalVal,
          onSale: updatedProduct.onSale,
          suggestSale: updatedProduct.suggestSale,
        });
      }
    });
  }, [products, cartItems, updateItemProperties]);

  const handleProductSelection = (productId: string) => {
    setSelectedProductId(productId);
  };

  const handleAddToCart = () => {
    if (!selectedProductId) return;

    const selectedProduct = products.find(p => p.id === selectedProductId);
    if (!selectedProduct) return;

    if (stockValidators.isOutOfStock(selectedProduct.q)) {
      alert('재고가 부족합니다.');
      return;
    }

    const existingItem = cartItems.find(item => item.id === selectedProductId);

    if (existingItem) {
      if (!stockValidators.canIncreaseQuantity(1, selectedProduct.q)) {
        alert('재고가 부족합니다.');
        return;
      }
    }

    addItem({
      id: selectedProduct.id,
      name: selectedProduct.name,
      val: selectedProduct.val,
      originalVal: selectedProduct.originalVal,
      onSale: selectedProduct.onSale,
      suggestSale: selectedProduct.suggestSale,
    });

    setProducts(prev =>
      prev.map(p =>
        p.id === selectedProductId ? stockManagers.decreaseStock(p, 1) : p,
      ),
    );

    setLastSelectedProduct(selectedProductId);
  };

  const handleQuantityChange = (id: string, change: number) => {
    const product = products.find(p => p.id === id);
    const cartItem = cartItems.find(item => item.id === id);

    if (!product || !cartItem) return;

    const newQuantity = quantityManagers.calculateNewQuantity(
      cartItem.quantity,
      change,
    );

    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }

    if (change > 0 && !stockValidators.canIncreaseQuantity(change, product.q)) {
      alert('재고가 부족합니다.');
      return;
    }

    updateQuantity(id, newQuantity);

    setProducts(prev =>
      prev.map(p => (p.id === id ? stockManagers.updateStock(p, -change) : p)),
    );
  };

  const handleRemoveItem = (id: string) => {
    const cartItem = cartItems.find(item => item.id === id);
    if (!cartItem) return;

    removeItem(id);

    setProducts(prev =>
      prev.map(p =>
        p.id === id ? stockManagers.increaseStock(p, cartItem.quantity) : p,
      ),
    );
  };

  const summaryData = {
    cartItems: cartItems.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.val,
    })),
    subtotal: cartCalculation.subtotal,
    itemCount,
    isTuesday,
    hasBulkDiscount:
      itemCount >= BUSINESS_CONSTANTS.DISCOUNT.BULK_DISCOUNT_THRESHOLD,
    itemDiscounts: itemDiscounts.map(discount => ({
      name: cartItems.find(item => item.id === discount.productId)?.name || '',
      discount: Math.round(discount.discountRate * 100),
    })),
  };

  return (
    <>
      <Header itemCount={itemCount} />

      {/* Main Grid Layout */}
      <div className='grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden'>
        {/* Left Column */}
        <div className='bg-white border border-gray-200 p-8 overflow-y-auto'>
          <div className='mb-6 pb-6 border-b border-gray-200'>
            <div
              className='mb-3'
              style={{
                borderColor: stockStatus.isLowStock ? 'orange' : '',
              }}
            >
              <ProductSelector
                products={products}
                selectedProductId={selectedProductId}
                onSelectionChange={handleProductSelection}
              />
            </div>
            <button
              id={ELEMENT_IDS.ADD_TO_CART}
              className='w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all'
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <div
              id={ELEMENT_IDS.STOCK_STATUS}
              className='text-xs text-red-500 mt-3 whitespace-pre-line'
            >
              {stockStatus.message}
            </div>
          </div>

          <div id={ELEMENT_IDS.CART_ITEMS} className='space-y-3'>
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                id={item.id}
                name={item.name}
                val={item.val}
                originalVal={item.originalVal}
                quantity={item.quantity}
                onSale={item.onSale}
                suggestSale={item.suggestSale}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className='bg-black text-white p-8 flex flex-col'>
          <h2 className='text-xs font-medium mb-5 tracking-extra-wide uppercase'>
            Order Summary
          </h2>
          <div className='flex-1 flex flex-col'>
            <OrderSummaryDetails {...summaryData} />
            <div className='mt-auto'>
              <div id='discount-info' className='mb-4'>
                {hasDiscounts && (
                  <div className='text-green-600 text-sm'>
                    <div className='flex justify-between items-center'>
                      <span>총 할인율: {Math.round(discountRate * 100)}%</span>
                      <span>
                        ₩{savedAmount.toLocaleString()} 할인되었습니다
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div id='cart-total' className='pt-5 border-t border-white/10'>
                <div className='flex justify-between items-baseline'>
                  <span className='text-sm uppercase tracking-wider'>
                    Total
                  </span>
                  <div id='total-amount' className='text-2xl tracking-tight'>
                    ₩{totalAmount.toLocaleString()}
                  </div>
                </div>
                <div
                  id='loyalty-points'
                  className='text-xs text-blue-400 mt-2 text-right'
                  style={{ display: hasPoints ? 'block' : 'block' }}
                >
                  {hasPoints ? (
                    <>
                      <div>
                        적립 포인트:{' '}
                        <span className='font-bold'>{totalPoints}p</span>
                      </div>
                      <div className='text-2xs opacity-70 mt-1'>
                        {details.join(', ')}
                      </div>
                    </>
                  ) : (
                    '적립 포인트: 0p'
                  )}
                </div>
              </div>
              <div
                id='tuesday-special'
                className={`mt-4 p-3 bg-white/10 rounded-lg ${isTuesday ? '' : 'hidden'}`}
              >
                <div className='flex items-center gap-2'>
                  <span className='text-2xs'>🎉</span>
                  <span className='text-xs uppercase tracking-wide'>
                    Tuesday Special 10% Applied
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button className='w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30'>
            Proceed to Checkout
          </button>
          <p className='mt-4 text-2xs text-white/60 text-center leading-relaxed'>
            Free shipping on all orders.
            <br />
            <span id='points-notice'>Earn loyalty points with purchase.</span>
          </p>
        </div>
      </div>

      <HelpModal />
    </>
  );
}

export default App;
