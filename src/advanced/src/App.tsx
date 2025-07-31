import { Header } from "./components/layout/Header";
import { ManualOverlay } from "./components/ui/ManualOverlay";
import { ProductSelector } from "./components/cart/ProductSelector";
import { CartItems } from "./components/cart/CartItems";
import { CartSummary } from "./components/cart/CartSummary";
import { useAppContext } from "./context";

function App() {
  const {
    products,
    cart,
    isManualOpen,
    selectedProduct,
    stockStatus,
    addToCart,
    updateQuantity,
    removeFromCart,
    toggleManual,
    setSelectedProduct,
  } = useAppContext();

  const total = cart.reduce((sum, item) => {
    const discountedPrice = item.val * (1 - item.discount / 100);
    return sum + discountedPrice * item.quantity;
  }, 0);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Header itemCount={itemCount} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
          {/* 왼쪽 컬럼: 상품 선택 및 장바구니 */}
          <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
            <ProductSelector
              products={products}
              selectedProduct={selectedProduct}
              onProductSelect={setSelectedProduct}
              onAddToCart={() => addToCart(selectedProduct)}
              stockStatus={stockStatus}
            />

            <CartItems
              items={cart}
              onQuantityChange={updateQuantity}
              onRemove={removeFromCart}
            />
          </div>

          {/* 오른쪽 컬럼: 주문 요약 */}
          <CartSummary
            total={total}
            loyaltyPoints={Math.floor(total * 0.001)}
            discountInfo=""
            isTuesdaySpecial={false}
          />
        </div>
      </div>

      <ManualOverlay
        isOpen={isManualOpen}
        onToggle={toggleManual}
        onClose={toggleManual}
      />
    </div>
  );
}

export default App;
