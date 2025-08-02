import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { useDiscountService, usePointsService, useSaleService } from "../hooks";
import {
  Header,
  ManualModal,
  ProductSelector,
  CartDisplay,
  OrderSummary,
} from "../components";
import { MESSAGES } from "../constants";

export function CartPage() {
  // Context에서 상태와 액션 가져오기
  const { state, dispatch } = useAppContext();
  const { products, cartItems, selectedProductId } = state;

  // 세일 서비스 시작 (타이머 자동 시작)
  useSaleService();

  // 계산된 값들
  const itemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const subTotalPrice = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const isTuesday = useMemo(() => new Date().getDay() === 2, []);

  // 할인 계산
  const discountResult = useDiscountService(cartItems, isTuesday);

  // 포인트 계산
  const pointsResult = usePointsService(
    discountResult.finalTotal,
    cartItems,
    itemCount,
    isTuesday
  );

  // 이벤트 핸들러들
  const handleProductSelect = (productId: string) => {
    dispatch({ type: "SET_SELECTED_PRODUCT_ID", payload: productId });
  };

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { productId: selectedProductId },
    });
  };

  const handleQuantityChange = (productId: string, change: number) => {
    const filterItem = cartItems.filter(
      (item) => item.product.id === productId
    )[0];
    const { quantity, product } = filterItem;
    if (change + quantity > product.quantity)
      return alert(MESSAGES.OUT_OF_STOCK);
    dispatch({
      type: "UPDATE_CART_ITEM_QUANTITY",
      payload: { productId, change },
    });
  };

  const handleRemoveItem = (productId: string) => {
    dispatch({ type: "REMOVE_CART_ITEM", payload: { productId } });
  };

  return (
    <>
      <ManualModal />
      <Header itemCount={itemCount} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
        <div className="p-8 bg-white border border-gray-200 p-8 overflow-y-auto">
          <ProductSelector
            products={products}
            selectedProductId={selectedProductId}
            onProductSelect={handleProductSelect}
            onAddToCart={handleAddToCart}
          />

          <CartDisplay
            items={cartItems}
            products={products}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemoveItem}
          />
        </div>

        <OrderSummary
          cartItems={cartItems}
          products={products}
          subTotalPrice={subTotalPrice}
          totalAmount={discountResult.finalTotal}
          originalTotal={discountResult.originalTotal}
          discountRate={discountResult.discountRate}
          itemCount={itemCount}
          itemDiscounts={discountResult.itemDiscounts}
          isTuesday={isTuesday}
          bonusPoints={pointsResult.totalPoints}
          pointsDetails={pointsResult.pointsDetails}
        />
      </div>
    </>
  );
}
