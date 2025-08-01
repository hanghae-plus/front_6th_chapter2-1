import type { ComponentProps } from "react";

type CloseIconProps = ComponentProps<"svg">;

export function CloseIcon(props: CloseIconProps) {
	const { className = "h-6 w-6", ...rest } = props;

	return (
		<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...rest}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M6 18L18 6M6 6l12 12"
			></path>
		</svg>
	);
}
