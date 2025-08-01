import type { ComponentProps } from "react";

type CloseIconProps = ComponentProps<"svg">;

export function InfoIcon(props: CloseIconProps) {
	const { className = "h-5 w-5", ...rest } = props;

	return (
		<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...rest}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			></path>
		</svg>
	);
}
