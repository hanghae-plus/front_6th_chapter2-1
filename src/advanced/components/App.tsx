import { useState, useCallback, useMemo } from "react";
import { IProduct } from "../types";
import { ICartItem } from "../domains/cart/types";

// Domain Hooks
import { useProductData } from "../domains/products/useProductData";
import { useCartManager } from "../domains/cart/useCartManager";
import { usePointsManager } from "../domains/points/usePointsManager";
import { useStockManager } from "../domains/stock/useStockManager";
import { useDiscountManager } from "../domains/discounts/useDiscountManager";
import { useSpecialSales } from "../domains/sales/useSpecialSales";

// Domain Components
import { ProductSelect } from "../domains/products/ProductSelect";
import { CartDisplay } from "../domains/cart/CartDisplay";
import { OrderSummary } from "../domains/cart/OrderSummary";
import { PointsDisplay } from "../domains/points/PointsDisplay";
import { StockWarning } from "../domains/stock/StockWarning";
import { DiscountInfo } from "../domains/discounts/DiscountInfo";
import { SaleNotification } from "../domains/sales/SaleNotification";

/**
 * 메인 앱 컴포넌트
 *
 * 모든 도메인 훅들을 통합하여 쇼핑카트 애플리케이션 구현
 * - 상품 선택 및 장바구니 관리
 * - 할인 및 포인트 계산
 * - 재고 관리 및 특별 세일
 */
export default function App() {
  // 도메인 훅들
  const productData = useProductData();
  const cartManager = useCartManager();
  const pointsManager = usePointsManager();
  const stockManager = useStockManager();
  const discountManager = useDiscountManager();

  // 상태 관리
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [saleNotificationMessage, setSaleNotificationMessage] = useState<string | null>(null);

  // 특별 세일 핸들러들
  const handleLightningSale = useCallback(
    (product: IProduct) => {
      productData.updateProductSaleStatus(product.id, {
        onSale: true,
        suggestSale: false,
      });
    },
    [productData],
  );

  const handleRecommendationSale = useCallback(
    (product: IProduct) => {
      productData.applyRecommendationDiscount(product.id, 5);
    },
    [productData],
  );

  const handleShowAlert = useCallback((message: string) => {
    setSaleNotificationMessage(message);
  }, []);

  // 특별 세일 훅
  const specialSales = useSpecialSales(
    productData.products,
    selectedProductId,
    cartManager.cartItems.length > 0,
    handleLightningSale,
    handleRecommendationSale,
    handleShowAlert,
  );

  // 상품 선택 핸들러
  const handleProductSelect = useCallback((productId: string) => {
    setSelectedProductId(productId);
  }, []);

  // ✅ 공통 상태 업데이트 헬퍼 함수
  const updateAllCalculations = useCallback(
    (cartItems: ICartItem[]) => {
      const calculation = cartManager.calculateCartCalculation(cartItems);
      cartManager.updateCartState(calculation);

      const bonusResult = pointsManager.calculateBonusPoints(calculation.subtotal, calculation.itemCount, cartItems);
      pointsManager.updatePointsState(bonusResult);
    },
    [cartManager, pointsManager],
  );

  // 장바구니 추가 핸들러
  const handleAddToCart = useCallback(() => {
    if (!selectedProductId) return;

    const product = productData.findProductById(selectedProductId);
    if (!product || product.quantity <= 0) return;

    // 장바구니에 상품 추가
    const cartItem = {
      ...product,
      itemTotal: product.val,
    };
    cartManager.addToCart(cartItem);

    // 상품 재고 감소
    productData.updateProductStock(selectedProductId, -1);

    // ✅ 상태 업데이트: 이벤트 핸들러에서만 수행
    const updatedCartItems = [...cartManager.cartItems, cartItem];
    updateAllCalculations(updatedCartItems);
  }, [selectedProductId, productData, cartManager, pointsManager, updateAllCalculations]);

  // 수량 변경 핸들러
  const handleUpdateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const cartItem = cartManager.cartItems.find((item) => item.id === productId);
      if (!cartItem) return;

      const quantityDiff = newQuantity - cartItem.quantity;

      // 재고 업데이트
      productData.updateProductStock(productId, -quantityDiff);

      // 장바구니 수량 업데이트
      cartManager.updateQuantity(productId, newQuantity);

      // ✅ 상태 업데이트: 이벤트 핸들러에서만 수행
      updateAllCalculations(cartManager.cartItems);
    },
    [cartManager, productData, pointsManager, updateAllCalculations],
  );

  // 상품 제거 핸들러
  const handleRemoveItem = useCallback(
    (productId: string) => {
      const cartItem = cartManager.cartItems.find((item) => item.id === productId);
      if (!cartItem) return;

      // 재고 복구
      productData.updateProductStock(productId, cartItem.quantity);

      // 장바구니에서 제거
      cartManager.removeFromCart(productId);

      // ✅ 상태 업데이트: 이벤트 핸들러에서만 수행
      updateAllCalculations(cartManager.cartItems);
    },
    [cartManager, productData, pointsManager, updateAllCalculations],
  );

  // ✅ 렌더링 시: 순수 함수만 호출 (useMemo로 최적화)
  const cartCalculation = useMemo(
    () => cartManager.calculateCartCalculation(cartManager.cartItems),
    [cartManager.cartItems],
  );

  const stockStatus = useMemo(() => stockManager.getStockStatus(productData.products), [productData.products]);

  const discountInfo = useMemo(
    () =>
      discountManager.calculateDiscountInfo(
        cartCalculation.discountRate,
        cartCalculation.totalAmount,
        cartCalculation.originalTotal,
      ),
    [cartCalculation.discountRate, cartCalculation.totalAmount, cartCalculation.originalTotal],
  );

  const bonusPointsResult = useMemo(
    () =>
      pointsManager.calculateBonusPoints(cartCalculation.subtotal, cartCalculation.itemCount, cartManager.cartItems),
    [cartCalculation.subtotal, cartCalculation.itemCount, cartManager.cartItems],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">쇼핑카트</h1>
        </div>
      </header>

      {/* 메인 컨테이너 */}
      <main className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽 컬럼 - 상품 선택 및 장바구니 */}
          <div className="space-y-6">
            {/* 상품 선택 */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">상품 선택</h2>
              <ProductSelect
                products={productData.products}
                onProductSelect={handleProductSelect}
                onAddToCart={handleAddToCart}
              />
            </div>

            {/* 장바구니 */}
            <CartDisplay
              cartItems={cartManager.cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          </div>

          {/* 오른쪽 컬럼 - 주문 요약 및 정보 */}
          <div className="space-y-6">
            {/* 주문 요약 */}
            <OrderSummary
              cartItems={cartManager.cartItems}
              subtotal={cartCalculation.subtotal}
              itemCount={cartCalculation.itemCount}
              itemDiscounts={cartCalculation.itemDiscounts}
              isSpecialDiscount={cartCalculation.isSpecialDiscount}
              totalAmount={cartCalculation.totalAmount}
            />

            {/* 할인 정보 */}
            <DiscountInfo discountData={discountInfo} />

            {/* 포인트 정보 */}
            <PointsDisplay bonusPointsResult={bonusPointsResult} />

            {/* 재고 경고 */}
            <StockWarning products={productData.products} warningMessage={stockStatus.warningMessage} />
          </div>
        </div>
      </main>

      {/* 세일 알림 */}
      <SaleNotification message={saleNotificationMessage} onClose={() => setSaleNotificationMessage(null)} />
    </div>
  );
}
