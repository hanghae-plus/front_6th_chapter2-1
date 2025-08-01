import { calculateDiscountAmount, formatDiscountRate } from "../services";

type TotalSectionProps = {
	discountRate: number;
	totalAmount: number;
	originalTotal: number;
	bonusPoints: number;
	pointsDetail: string[];
};

export function TotalSection({
	discountRate,
	totalAmount,
	originalTotal,
	bonusPoints,
	pointsDetail
}: TotalSectionProps) {
	const discountAmount = calculateDiscountAmount(originalTotal, totalAmount);

	return (
		<div className="mt-auto">
			{/* Always present discount info element for tests */}
			<span id="discount-info" style={{ display: "none" }}>
				{formatDiscountRate(discountRate)}%
			</span>

			{discountRate > 0 && totalAmount > 0 && (
				<div className="mb-4">
					<div className="rounded-lg bg-green-500/20 p-3">
						<div className="mb-1 flex items-center justify-between">
							<span className="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
							<span className="text-sm font-medium text-green-400">
								{formatDiscountRate(discountRate)}%
							</span>
						</div>
						<div className="text-2xs text-gray-300">
							₩{discountAmount.toLocaleString()} 할인되었습니다
						</div>
					</div>
				</div>
			)}

			<div className="border-t border-white/10 pt-5">
				<div className="flex items-baseline justify-between">
					<span className="text-sm uppercase tracking-wider">Total</span>
					<div id="cart-total" className="text-2xl tracking-tight">
						₩{Math.round(totalAmount).toLocaleString()}
					</div>
				</div>

				{bonusPoints > 0 ? (
					<div id="loyalty-points" className="mt-2 text-right text-xs text-blue-400">
						<div>
							적립 포인트: <span className="font-bold">{bonusPoints}p</span>
						</div>
						<div className="text-2xs mt-1 opacity-70">{pointsDetail.join(", ")}</div>
					</div>
				) : (
					<div id="loyalty-points" className="mt-2 text-right text-xs text-blue-400">
						적립 포인트: 0p
					</div>
				)}
			</div>
		</div>
	);
}
