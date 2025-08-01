import type { PropsWithChildren } from "react";

type HelpSectionProps = PropsWithChildren<{
	title: string;
	icon?: string;
}>;

export function HelpSection(props: HelpSectionProps) {
	const { title, children, icon } = props;

	return (
		<div className="mb-6">
			<h3 className="mb-3 text-base font-bold">
				{icon}&nbsp;{title}
			</h3>
			<div className="space-y-3">{children}</div>
		</div>
	);
}
