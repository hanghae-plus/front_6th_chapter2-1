type HelpDrawerBackdropProps = {
	isOpen: boolean;
	onClose: () => void;
};

export function HelpDrawerBackdrop(props: HelpDrawerBackdropProps) {
	const { isOpen, onClose } = props;

	return (
		<div
			className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${isOpen ? "" : "hidden"}`}
			onClick={onClose}
		></div>
	);
}
