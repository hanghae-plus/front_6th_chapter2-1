type TuesdayBannerProps = {
	isTuesday: boolean;
	totalAmount: number;
};

export function TuesdayBanner({ isTuesday, totalAmount }: TuesdayBannerProps) {
	return (
		<div
			id="tuesday-special"
			className={`mt-4 rounded-lg bg-white/10 p-3 ${!(isTuesday && totalAmount > 0) ? "hidden" : ""}`}
		>
			<div className="flex items-center gap-2">
				<span className="text-2xs">🎉</span>
				<span className="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
			</div>
		</div>
	);
}
