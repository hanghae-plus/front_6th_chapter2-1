import { useState } from "react";
import { Header } from "./components/layout/Header";
import { ManualOverlay } from "./components/ui/ManualOverlay";
import { ProductSelector } from "./components/cart/ProductSelector";
import { CartItems } from "./components/cart/CartItems";
import { CartSummary } from "./components/cart/CartSummary";

// 임시 상품 데이터
const mockProducts = [
  { id: "1", name: "키보드", price: 50000, stock: 100 },
  { id: "2", name: "마우스", price: 30000, stock: 150 },
  { id: "3", name: "모니터암", price: 80000, stock: 50 },
  { id: "4", name: "스피커", price: 120000, stock: 30 },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
}

function App() {
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [stockStatus, setStockStatus] = useState("");

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const product = mockProducts.find((p) => p.id === selectedProduct);
    if (!product) return;

    const existingItem = cartItems.find((item) => item.id === selectedProduct);

    if (existingItem) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === selectedProduct
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          id: selectedProduct,
          name: product.name,
          price: product.price,
          quantity: 1,
          discount: 0,
        },
      ]);
    }

    setSelectedProduct("");
    setStockStatus("");
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const handleRemove = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => {
    const discountedPrice = item.price * (1 - item.discount / 100);
    return sum + discountedPrice * item.quantity;
  }, 0);

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Header itemCount={itemCount} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
          {/* 왼쪽 컬럼: 상품 선택 및 장바구니 */}
          <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
            <ProductSelector
              products={mockProducts}
              selectedProduct={selectedProduct}
              onProductSelect={setSelectedProduct}
              onAddToCart={handleAddToCart}
              stockStatus={stockStatus}
            />

            <CartItems
              items={cartItems}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
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
        onToggle={() => setIsManualOpen(!isManualOpen)}
        onClose={() => setIsManualOpen(false)}
      />
    </div>
  );
}

export default App;
