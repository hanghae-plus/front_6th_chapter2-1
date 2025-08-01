import type { OrderSummaryProps } from "../types";
import { DiscountSection } from "./DiscountSection";
import { OrderItem } from "./OrderItem";
import { TotalSection } from "./TotalSection";
import { TuesdayBanner } from "./TuesdayBanner";

export function OrderSummary({ cartItems, products, calculations }: OrderSummaryProps) {
	const {
		bonusPoints,
		discountRate,
		isTuesday,
		itemCount,
		itemDiscounts,
		originalTotal,
		pointsDetail,
		subtotal,
		totalAmount
	} = calculations;

	return (
		<div className="flex flex-col bg-black p-8 text-white">
			<h2 className="tracking-extra-wide mb-5 text-xs font-medium uppercase">Order Summary</h2>
			<div className="flex flex-1 flex-col">
				<div className="space-y-3">
					{cartItems.map((cartItem) => {
						const product = products.find((p) => p.id === cartItem.id);
						if (!product) return null;

						return <OrderItem key={cartItem.id} cartItem={cartItem} product={product} />;
					})}

					{subtotal > 0 && (
						<>
							<div className="my-3 border-t border-white/10"></div>
							<div className="flex justify-between text-sm tracking-wide">
								<span>Subtotal</span>
								<span>₩{subtotal.toLocaleString()}</span>
							</div>

							<DiscountSection
								itemCount={itemCount}
								itemDiscounts={itemDiscounts}
								isTuesday={isTuesday}
								totalAmount={totalAmount}
							/>

							<div className="flex justify-between text-sm tracking-wide text-gray-400">
								<span>Shipping</span>
								<span>Free</span>
							</div>
						</>
					)}
				</div>

				<TotalSection
					discountRate={discountRate}
					totalAmount={totalAmount}
					originalTotal={originalTotal}
					bonusPoints={bonusPoints}
					pointsDetail={pointsDetail}
				/>

				<TuesdayBanner isTuesday={isTuesday} totalAmount={totalAmount} />
			</div>

			<button className="tracking-super-wide mt-6 w-full cursor-pointer bg-white py-4 text-sm font-normal uppercase text-black transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
				Proceed to Checkout
			</button>

			<p className="text-2xs mt-4 text-center leading-relaxed text-white/60">
				Free shipping on all orders.
				<br />
				<span>Earn loyalty points with purchase.</span>
			</p>
		</div>
	);
}
