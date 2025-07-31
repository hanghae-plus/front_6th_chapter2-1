export function OrderSummaryColumn() {
	return /* HTML */ `
		<div class="bg-black text-white p-8 flex flex-col">
			<h2 class="tracking-extra-wide mb-5 text-xs font-medium uppercase">Order Summary</h2>
			<div class="flex flex-1 flex-col">
				<div id="summary-details" class="space-y-3"></div>
				<div class="mt-auto">
					<div id="discount-info" class="mb-4"></div>
					<div id="cart-total" class="border-t border-white/10 pt-5">
						<div class="flex items-baseline justify-between">
							<span class="text-sm uppercase tracking-wider">Total</span>
							<div class="text-2xl tracking-tight">₩0</div>
						</div>
						<div id="loyalty-points" class="mt-2 text-right text-xs text-blue-400">
							적립 포인트: 0p
						</div>
					</div>
					<div id="tuesday-special" class="mt-4 hidden rounded-lg bg-white/10 p-3">
						<div class="flex items-center gap-2">
							<span class="text-2xs">🎉</span>
							<span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
						</div>
					</div>
				</div>
			</div>
			<button
				class="tracking-super-wide mt-6 w-full cursor-pointer bg-white py-4 text-sm font-normal uppercase text-black transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
			>
				Proceed to Checkout
			</button>
			<p class="text-2xs mt-4 text-center leading-relaxed text-white/60">
				Free shipping on all orders.<br />
				<span id="points-notice">Earn loyalty points with purchase.</span>
			</p>
		</div>
	`;
}
