import { useMemo } from "react";
import type { CartItem, Product } from "../types";
import { DISCOUNT_THRESHOLDS, DISCOUNT_RATES } from "../constants";

type ItemDiscount = {
  name: string;
  discount: number;
};

type OrderSummaryProps = {
  cartItems: CartItem[];
  products: Product[];
  subTotalPrice: number;
  totalAmount: number;
  originalTotal: number;
  discountRate: number;
  itemCount: number;
  itemDiscounts: ItemDiscount[];
  isTuesday: boolean;
  bonusPoints: number;
  pointsDetails: string[];
};

type SummaryDetailsProps = {
  cartItems: CartItem[];
  products: Product[];
  subTotalPrice: number;
  itemCount: number;
  itemDiscounts: ItemDiscount[];
  isTuesday: boolean;
  totalAmount: number;
};

function SummaryDetails({
  cartItems,
  products,
  subTotalPrice,
  itemCount,
  itemDiscounts,
  isTuesday,
  totalAmount,
}: SummaryDetailsProps) {
  const itemTotals = useMemo(
    () =>
      cartItems.map((item) => {
        // CartDisplay와 동일하게 products에서 최신 정보를 찾기
        const currentProduct = products.find(
          (product) => product.id === item.product.id
        );

        if (!currentProduct) {
          return {
            id: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            total: item.product.price * item.quantity,
            isDiscounted: false,
            discountedFrom: item.product.originalPrice * item.quantity,
          };
        }

        return {
          id: currentProduct.id,
          name: currentProduct.name,
          quantity: item.quantity,
          total: currentProduct.price * item.quantity,
          isDiscounted: currentProduct.price < currentProduct.originalPrice,
          discountedFrom: currentProduct.originalPrice * item.quantity,
        };
      }),
    [cartItems, products]
  );

  if (subTotalPrice <= 0) return null;

  return (
    <div className="space-y-3">
      {itemTotals.map((item) => (
        <div
          key={item.id}
          className="flex justify-between text-xs tracking-wide text-gray-400"
        >
          <span>
            {item.name} x {item.quantity}
            {item.isDiscounted && (
              <span className="text-green-400 ml-1">🔻</span>
            )}
          </span>
          <div className="text-right">
            {item.isDiscounted && (
              <div className="text-2xs text-gray-500 line-through">
                ₩{item.discountedFrom.toLocaleString()}
              </div>
            )}
            <span>₩{item.total.toLocaleString()}</span>
          </div>
        </div>
      ))}

      <div className="border-t border-white/10 my-3" />

      <div className="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩{subTotalPrice.toLocaleString()}</span>
      </div>

      {itemCount >= DISCOUNT_THRESHOLDS.BULK_DISCOUNT ? (
        <div className="flex justify-between text-sm tracking-wide text-green-400">
          <span className="text-xs">
            🎉 대량구매 할인 ({DISCOUNT_THRESHOLDS.BULK_DISCOUNT}개 이상)
          </span>
          <span className="text-xs">
            -{Math.round(DISCOUNT_RATES.BULK * 100)}%
          </span>
        </div>
      ) : (
        itemDiscounts.map((item) => (
          <div
            key={item.name}
            className="flex justify-between text-sm tracking-wide text-green-400"
          >
            <span className="text-xs">
              {item.name} ({DISCOUNT_THRESHOLDS.INDIVIDUAL_DISCOUNT}개↑)
            </span>
            <span className="text-xs">-{item.discount}%</span>
          </div>
        ))
      )}

      {isTuesday && totalAmount > 0 && (
        <div className="flex justify-between text-sm tracking-wide text-purple-400">
          <span className="text-xs">🌟 화요일 추가 할인</span>
          <span className="text-xs">
            -{Math.round(DISCOUNT_RATES.TUESDAY * 100)}%
          </span>
        </div>
      )}

      <div className="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    </div>
  );
}

function DiscountInfo({
  discountRate,
  originalTotal,
  totalAmount,
}: {
  discountRate: number;
  originalTotal: number;
  totalAmount: number;
}) {
  if (discountRate <= 0 || totalAmount <= 0) return null;

  const savedAmount = originalTotal - totalAmount;
  const discountPercentage = (discountRate * 100).toFixed(1);

  return (
    <div className="bg-green-500/20 rounded-lg p-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs uppercase tracking-wide text-green-400">
          총 할인율
        </span>
        <span className="text-sm font-medium text-green-400">
          {discountPercentage}%
        </span>
      </div>
      <div className="text-2xs text-gray-300">
        ₩{Math.round(savedAmount).toLocaleString()} 할인되었습니다
      </div>
    </div>
  );
}

function LoyaltyPoints({
  bonusPoints,
  pointsDetails,
}: {
  bonusPoints: number;
  pointsDetails: string[];
}) {
  return (
    <div className="text-xs text-blue-400 mt-2 text-right">
      {bonusPoints > 0 && (
        <>
          <div>
            적립 포인트: <span className="font-bold">{bonusPoints}p</span>
          </div>
          <div className="text-2xs opacity-70 mt-1">
            {pointsDetails.join(", ")}
          </div>
        </>
      )}
    </div>
  );
}

function TuesdaySpecial({
  isTuesday,
  totalAmount,
}: {
  isTuesday: boolean;
  totalAmount: number;
}) {
  if (!isTuesday || totalAmount <= 0) return null;

  return (
    <div className="mt-4 p-3 bg-white/10 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-2xs">🎉</span>
        <span className="text-xs uppercase tracking-wide">
          Tuesday Special 10% Applied
        </span>
      </div>
    </div>
  );
}

export function OrderSummary({
  cartItems,
  products,
  subTotalPrice,
  totalAmount,
  originalTotal,
  discountRate,
  itemCount,
  itemDiscounts,
  isTuesday,
  bonusPoints,
  pointsDetails,
}: OrderSummaryProps) {
  return (
    <div className="bg-black text-white p-8 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">
        Order Summary
      </h2>

      <div className="flex-1 flex flex-col">
        <SummaryDetails
          cartItems={cartItems}
          products={products}
          subTotalPrice={subTotalPrice}
          itemCount={itemCount}
          itemDiscounts={itemDiscounts}
          isTuesday={isTuesday}
          totalAmount={totalAmount}
        />

        <div className="mt-auto">
          <div className="mb-4">
            <DiscountInfo
              discountRate={discountRate}
              originalTotal={originalTotal}
              totalAmount={totalAmount}
            />
          </div>

          <div className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">
                ₩{Math.round(totalAmount).toLocaleString()}
              </div>
            </div>

            <LoyaltyPoints
              bonusPoints={bonusPoints}
              pointsDetails={pointsDetails}
            />
          </div>

          <TuesdaySpecial isTuesday={isTuesday} totalAmount={totalAmount} />
        </div>
      </div>

      <button className="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
        Proceed to Checkout
      </button>

      <p className="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.
        <br />
        <span>Earn loyalty points with purchase.</span>
      </p>
    </div>
  );
}
