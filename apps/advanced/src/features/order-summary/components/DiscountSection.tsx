import type { ItemDiscount } from "../../../shared";
import { isBulkDiscount } from "../services";

type DiscountSectionProps = {
	itemCount: number;
	itemDiscounts: ItemDiscount[];
	isTuesday: boolean;
	totalAmount: number;
};

export function DiscountSection({
	itemCount,
	itemDiscounts,
	isTuesday,
	totalAmount
}: DiscountSectionProps) {
	const hasBulkDiscount = isBulkDiscount(itemCount);

	return (
		<>
			{hasBulkDiscount && (
				<div className="flex justify-between text-sm tracking-wide text-green-400">
					<span className="text-xs">🎉 대량구매 할인 (30개 이상)</span>
					<span className="text-xs">-25%</span>
				</div>
			)}

			{!hasBulkDiscount &&
				itemDiscounts.map((item) => (
					<div
						key={item.name}
						className="flex justify-between text-sm tracking-wide text-green-400"
					>
						<span className="text-xs">{item.name} (10개↑)</span>
						<span className="text-xs">-{item.discount}%</span>
					</div>
				))}

			{isTuesday && totalAmount > 0 && (
				<div
					id="tuesday-special"
					className="flex justify-between text-sm tracking-wide text-purple-400"
				>
					<span className="text-xs">🌟 화요일 추가 할인</span>
					<span className="text-xs">-10%</span>
				</div>
			)}
		</>
	);
}
