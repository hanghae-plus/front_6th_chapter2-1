type HeaderProps = {
	itemCnt: number;
};

export function Header({ itemCnt }: HeaderProps) {
	return (
		<div className="mb-8">
			<h1 className="tracking-extra-wide mb-2 text-xs font-medium uppercase">
				🛒 Hanghae Online Store
			</h1>
			<div className="text-5xl leading-none tracking-tight">Shopping Cart</div>
			<p id="item-count" className="mt-3 text-sm font-normal text-gray-500">
				🛍️ {itemCnt} items in cart
			</p>
		</div>
	);
}
