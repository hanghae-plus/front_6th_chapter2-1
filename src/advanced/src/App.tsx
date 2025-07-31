import { Header } from "./components/layout/Header";
import { ManualOverlay } from "./components/ui/ManualOverlay";
import { ProductSelector } from "./components/cart/ProductSelector";
import { CartItems } from "./components/cart/CartItems";
import { CartSummary } from "./components/cart/CartSummary";
import { useAppContext } from "./context";
import { calculateCartTotals } from "./utils/cartUtils";
import { calculateBonusPoints } from "./utils/pointsUtils";

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

  // 할인 계산
  const cartTotals = calculateCartTotals(cart);

  // 포인트 계산
  const pointsCalculation = calculateBonusPoints(
    cart,
    cartTotals.totalAmount,
    cartTotals.totalQty,
    cartTotals.isTuesday
  );

  const itemCount = cartTotals.totalQty;

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
            total={cartTotals.totalAmount}
            loyaltyPoints={pointsCalculation.finalPoints}
            discountInfo={
              cartTotals.itemDiscounts.length > 0
                ? cartTotals.itemDiscounts
                    .map((d) => `${d.name}: ${d.discount}% 할인`)
                    .join(", ")
                : ""
            }
            isTuesdaySpecial={cartTotals.isTuesday}
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
