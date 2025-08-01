import type { PropsWithChildren } from "react";

type BenefitCardProps = PropsWithChildren<{
	title: string;
}>;

export function BenefitCard(props: BenefitCardProps) {
	const { title, children } = props;

	return (
		<div className="rounded-lg bg-gray-100 p-3">
			<p className="mb-1 text-sm font-semibold">{title}</p>
			<div className="pl-2 text-xs text-gray-700">{children}</div>
		</div>
	);
}
