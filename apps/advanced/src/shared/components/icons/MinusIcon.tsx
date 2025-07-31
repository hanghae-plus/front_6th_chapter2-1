import type { ComponentProps } from "react";

type CloseIconProps = ComponentProps<"svg">;

export function MinusIcon(props: CloseIconProps) {
	const { className = "h-4 w-4", ...rest } = props;

	return (
		<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...rest}>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12H6"></path>
		</svg>
	);
}
